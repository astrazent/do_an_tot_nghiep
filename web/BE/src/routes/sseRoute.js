import { Router } from 'express'
import { addClient, removeClient } from '~/sockets/sseClient'

const router = Router()

router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    res.flushHeaders()

    addClient(res)

    req.on('close', () => {
        removeClient(res)
        res.end()
    })
})

export default router
