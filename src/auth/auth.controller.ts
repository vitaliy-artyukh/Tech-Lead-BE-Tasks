import { Request, Response } from 'express'
import authService from './auth.service'
import { StatusCodes } from 'http-status-codes'

export class AuthController {
    public async login(req: Request, res: Response) {
        const token = await authService.login(req.body)
        res.status(StatusCodes.CREATED).send(token)
    }

    public async register(req: Request, res: Response) {
        const token = await authService.register(req.body)
        res.status(StatusCodes.CREATED).send(token)
    }

    public async session(req: Request, res: Response) {
        const result = await authService.checkSession(req.params.sessionId)
        res.status(StatusCodes.OK).send(result)
    }

    public async logout(req: Request, res: Response) {
        const result = await authService.logout(
            req.headers.authorization?.split(' ')[1],
        )
        res.status(StatusCodes.OK).send(result)
    }
}
