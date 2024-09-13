import 'reflect-metadata'
import express from 'express'
import authRouter from './auth/auth.router'
import { exceptionHandler } from './middlewares/exception-handler.middleware'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import {
    initializeDataSource,
    mongodbConnect,
    redisConnect,
} from './data-source'
import rateLimit from 'express-rate-limit'
import cluster from 'node:cluster'
import os from 'node:os'

const start = async () => {
    const app = express()

    await initializeDataSource()
    await mongodbConnect()
    await redisConnect()

    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 10000,
            message: 'Too many requests from this IP, please try again later.',
        }),
    )
    app.use(express.json())
    app.use(helmet())
    app.use(compression())
    app.use(cors())
    app.use(authRouter)
    app.use(exceptionHandler)

    const port = process.env.PORT || 3000

    app.listen(port, () => console.info(`Server started on port ${port}`))
}

const numCPUs = os.cpus().length

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`)
    })
} else {
    start()
    console.log(`Worker ${process.pid} started`)
}
