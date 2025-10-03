/**
 * Folder routes/v1:
 * Chức năng:
 *  - Chứa định nghĩa các endpoint API phiên bản 1
 *  - Mapping URL -> controller tương ứng
 * Tạo file mới: mỗi entity/chức năng có file route riêng (userRoutes.js, productRoutes.js, orderRoutes.js...)
 */
import express from 'express'
import boardRoutes from './boardRoute.js'
import authRoutes from './authRoute.js'
import cartItemRoutes from './cartItemRoute.js'
import paymentRoutes from './paymentRoute.js'
import shipmentRoutes from "./shipmentRoute.js"
import discountRoutes from "./discountRoute.js"
import { StatusCodes } from 'http-status-codes'
// import columnRoutes from './columnRoute.js'
// import cardRoutes from './cardRoute.js'

const Router = express.Router()

// Check APIs v1 status
Router.get('/ping', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

/**
 * Tổng hợp tất cả routes v1
 */
Router.use('/boards', boardRoutes)
Router.use('/auth', authRoutes)
Router.use('/cart', cartItemRoutes)
Router.use('/payment', paymentRoutes)
Router.use('/shipment', shipmentRoutes)
Router.use('/discount', discountRoutes)
// Router.use('/columns', columnRoutes)
// Router.use('/cards', cardRoutes)

export const APIs_V1 = Router
