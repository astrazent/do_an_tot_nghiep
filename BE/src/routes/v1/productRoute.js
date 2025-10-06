import express from 'express'
import { getProducts } from '../../controllers/productController.js'

const router = express.Router()

// Xem danh sách sản phẩm
router.get('/', getProducts)

export default router
