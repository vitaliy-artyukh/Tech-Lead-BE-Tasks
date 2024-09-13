import 'reflect-metadata'
import dataSource from '../data-source'
import { CreateUserDto } from './dto/create-user.dto'
import { UserEntity } from './entities/user.entity'
import * as bcrypt from 'bcryptjs'
import { HttpException } from '../common/http.exception'
import { StatusCodes } from 'http-status-codes'

export class UserService {
    private readonly userRepository = dataSource.getRepository(UserEntity)

    public async create(user: CreateUserDto): Promise<UserEntity> {
        const hashPassword = await bcrypt.hash(user.password, 10)

        const isEmailExists = await this.userRepository.findOneBy({
            email: user.email,
        })
        if (isEmailExists) {
            throw new HttpException(
                'Email already exists',
                StatusCodes.BAD_REQUEST,
            )
        }

        const isPhoneNumberExists = await this.userRepository.findOneBy({
            phoneNumber: user.phoneNumber,
        })
        if (isPhoneNumberExists) {
            throw new HttpException(
                'Phone number already exists',
                StatusCodes.CONFLICT,
            )
        }

        const createdUser = this.userRepository.create({
            ...user,
            password: hashPassword,
        })
        await this.userRepository.save(createdUser)

        return createdUser
    }

    public async findByEmail(email: string): Promise<UserEntity | null> {
        return this.userRepository.findOneBy({ email })
    }
}

export default new UserService()
