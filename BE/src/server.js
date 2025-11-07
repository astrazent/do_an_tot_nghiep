import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import exitHook from 'async-exit-hook'
import { createConnection, closeConnection } from '~/config/mysql.js'
import { env } from '~/config/environment.js'
import { APIs_V1, APIs_V2 } from '~/routes/index.js'
import { errorHandlingMiddleware } from './middlewares/errorHandling'
import ErrorServer from './utils/ErrorServer'

const PORTS = [env.APP_PORT, 3000, 4000] // danh sách port thử fallback
let serverInstance

const START_SERVER = (index = 0) => {
    if (index >= PORTS.length) {
        console.error('No available port to start server.')
        process.exit(1)
    }

    const app = express()

    // Middleware
    app.use(
        cors({
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
            credentials: true,
        })
    )

    app.use(cookieParser())
    app.use(ErrorServer)
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // Routes
    app.use('/v1', APIs_V1)
    app.use('/v2', APIs_V2)
    app.use(errorHandlingMiddleware)

    // Start server
    serverInstance = app.listen(PORTS[index], env.APP_HOST, () => {
        console.log(
            `Server running at Host: ${env.APP_HOST} Port: ${PORTS[index]}`
        )
    })

    serverInstance.on('error', (err) => {
        if (err.code === 'EACCES' || err.code === 'EADDRINUSE') {
            console.warn(`Port ${PORTS[index]} unavailable, trying next...`)
            START_SERVER(index + 1) // thử port tiếp theo
        } else {
            console.error(err)
            process.exit(1)
        }
    })

    // Exit hook
    exitHook(() => {
        console.log('Server is shutting down...')
        if (serverInstance) {
            serverInstance.close(() => {
                console.log('HTTP server closed.')
            })
        }
        closeConnection()
        console.log('Disconnected from MySQL Database')
    })

    return serverInstance
}

// Kết nối DB trước khi start server
createConnection()
    .then(() => console.log('Connected to MySQL Database!'))
    .then(() => START_SERVER())
    .catch((error) => {
        console.error('Failed to start server:', error)
        process.exit(1)
    })

export default START_SERVER
