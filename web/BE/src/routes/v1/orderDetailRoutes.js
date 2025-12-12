import express from 'express'
import { getOrderDetail } from '../../controllers/oderDetailController.js'

const router = express.Router()

router.get('/:id', getOrderDetail)

export default router
