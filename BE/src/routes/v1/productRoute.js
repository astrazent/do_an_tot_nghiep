import express from 'express'
import { getProductsDetail } from '../../controllers/productController.js'

const router = express.Router()

// Xem danh sách sản phẩm
router.get('/:slug', getProductsDetail)

export default router
