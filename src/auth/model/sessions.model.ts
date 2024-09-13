import mongoose from 'mongoose'
import { EXPIRE_SESSION_TIME } from '../../config/expire-time.config'

export interface ISessions {
    userId: string
    phoneNumber: string
    email: string
    name: string
    surname: string
    refreshToken: string
    accessToken: string
    expiresAt?: Date
}

const sessionsSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessToken: { type: String, required: true },
    expiresAt: { type: Date, required: true, default: Date.now },
})

sessionsSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: EXPIRE_SESSION_TIME },
)
sessionsSchema.index({ refreshToken: 1 }, { unique: true })

export const SessionsModel = mongoose.model('Sessions', sessionsSchema)
