import { NextFunction, Response, Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { HttpException } from '../common/http.exception'
import * as yup from 'yup'

export const registerValidation = async (
    req: Request,
    _: Response,
    next: NextFunction,
) => {
    const schema = yup.object({
        email: yup.string().email().required(),
        password: yup.string().min(6).required(),
        name: yup.string().required(),
        surname: yup.string().required(),
        phoneNumber: yup
            .string()
            .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
            .required(),
    })

    try {
        await schema.validate(req.body)
        next()
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Bad request'
        throw new HttpException(message, StatusCodes.BAD_REQUEST)
    }
}
