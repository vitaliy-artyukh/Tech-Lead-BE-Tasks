import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { config } from 'dotenv'
import path from 'node:path'
import mongoose from 'mongoose'
import * as redis from 'redis'

config()

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'postgres',
    entities: [path.join(__dirname, '**/*.entity.{js,ts}')],
    migrations: [path.join(__dirname, 'migrations/**/*.{js,ts}')],
    migrationsRun: true,
})

export const initializeDataSource = async () => {
    try {
        await dataSource.initialize()
        console.log('Postgres database connected')
    } catch (error) {
        console.error('Error during Data Source initialization:', error)
        process.exit(1)
    }
}

export const mongodbConnect = async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase',
        )
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    }
}

export const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
})

export const redisConnect = async () => {
    try {
        await redisClient.connect()
        console.log('Redis connected successfully')
    } catch (error) {
        console.error('Redis connection error:', error)
        process.exit(1)
    }
}

export default dataSource
