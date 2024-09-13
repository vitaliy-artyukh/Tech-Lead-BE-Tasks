import { HttpException } from '../common/http.exception'
import { StatusCodes, getReasonPhrase, ReasonPhrases } from 'http-status-codes'
import { NextFunction, Request, Response } from 'express'

export const exceptionHandler = (
    err: unknown,
    _: Request,
    res: Response,
    next: NextFunction,
) => {
    if (err instanceof HttpException) {
        const statusCode = err.status
        const message = err.message

        res.status(statusCode).json({
            message,
            error: getReasonPhrase(statusCode),
        })
        console.error(err.stack)
    } else if (err instanceof Error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: err.message,
            error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        })
        console.error(err.stack)
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: ReasonPhrases.INTERNAL_SERVER_ERROR,
            error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        })
        console.error(err)
    }
    next()
}
