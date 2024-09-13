import { StatusCodes } from 'http-status-codes'
import { HttpException } from '../common/http.exception'
import { CreateUserDto } from '../users/dto/create-user.dto'
import userService from '../users/user.service'
import { LoginUserDto } from './dto/login-user.dto'
import * as bcrypt from 'bcryptjs'
import { UserEntity } from '../users/entities/user.entity'
import jwt from 'jsonwebtoken'
import { ISessions, SessionsModel } from './model/sessions.model'
import CryptoJS from 'crypto-js'
import { redisClient } from '../data-source'
import { EXPIRE_JWT_TIME } from '../config/expire-time.config'

export class AuthService {
    public async register(userDto: CreateUserDto) {
        const user = await userService.create(userDto)

        return this.createSession(user)
    }

    public async login(credentials: LoginUserDto) {
        const user = await userService.findByEmail(credentials.email)

        if (!user) {
            throw new HttpException('User not found', StatusCodes.NOT_FOUND)
        }

        const compare = await bcrypt.compare(
            credentials.password,
            user.password,
        )

        if (!compare) {
            throw new HttpException(
                'Invalid credentials',
                StatusCodes.UNAUTHORIZED,
            )
        }

        return this.createSession(user)
    }

    public async checkSession(sessionId: string) {
        const userJson = await redisClient.get(sessionId)

        if (userJson) {
            return {
                message: 'Authorized',
                data: JSON.parse(userJson),
            }
        }

        const session = await SessionsModel.findOne({
            refreshToken: sessionId,
        })

        if (!session) {
            throw new HttpException('Session not found', StatusCodes.NOT_FOUND)
        }

        return this.refreshSession(session)
    }

    public async logout(accessToken?: string) {
        if (!accessToken) {
            throw new HttpException('Unauthorized', StatusCodes.UNAUTHORIZED)
        }

        const session = await SessionsModel.findOneAndDelete({ accessToken })

        if (!session) {
            throw new HttpException('Invalid token', StatusCodes.BAD_REQUEST)
        }
        await redisClient.del(session.refreshToken)

        return {
            message: 'Logout success',
        }
    }

    private async createSession(user: UserEntity) {
        const userMetadata = {
            userId: user.id,
            email: user.email,
            phoneNumber: user.phoneNumber,
            name: user.name,
            surname: user.surname,
        }

        const token = jwt.sign(
            userMetadata,
            process.env.JWT_SECRET || 'secret',
            {
                expiresIn: EXPIRE_JWT_TIME,
            },
        )

        const refreshToken = this.generateRefreshToken(token)
        await SessionsModel.create({
            ...userMetadata,
            refreshToken,
            accessToken: token,
        })

        await redisClient.setEx(
            refreshToken,
            EXPIRE_JWT_TIME,
            JSON.stringify(userMetadata),
        )

        return {
            accessToken: token,
            refreshToken,
        }
    }

    private generateRefreshToken(str: string) {
        return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex)
    }

    private async refreshSession(session: ISessions) {
        const payload = {
            userId: session.userId,
            email: session.email,
            phoneNumber: session.phoneNumber,
            name: session.name,
            surname: session.surname,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
            expiresIn: EXPIRE_JWT_TIME,
        })

        await redisClient.setEx(
            session.refreshToken,
            EXPIRE_JWT_TIME,
            JSON.stringify(payload),
        )

        SessionsModel.updateOne(
            { refreshToken: session.refreshToken },
            {
                $set: {
                    expiresAt: new Date(Date.now() + EXPIRE_JWT_TIME),
                    accessToken: token,
                },
            },
        )

        return {
            accessToken: token,
        }
    }
}

export default new AuthService()
