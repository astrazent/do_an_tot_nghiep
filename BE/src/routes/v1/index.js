import express from 'express'
import adminRoutes from './adminRoute.js'
import authRoutes from './authRoute.js'
import cartItemRoutes from './cartItemRoute.js'
import categoryRoutes from './categoryRoute.js'
import paymentRoutes from './paymentRoute.js'
import shipmentRoutes from './shipmentRoute.js'
import discountRoutes from './discountRoute.js'
import discountProductRoutes from './discountProductRoute.js'
import transactionRoutes from './transactionRoute.js'
import orderItemRoutes from './oderItemRoute.js'
import { StatusCodes } from 'http-status-codes'
import orderDetailRoutes from './orderDetailRoutes.js'
import couponRoute from './couponRoute.js'
import commentRoutes from './commentRoute.js'
import aiFeedbackRoutes from './aiFeedbackRoute.js'
import commentReactionRoute from './commentReactionRoute.js'
import aiRoutes from './aiRoute.js'
import postRoutes from './postRoute.js'
import productRoutes from './productRoute.js'
import userRoutes from './userRoute.js'
import postTypeRoute from './postTypeRoute.js'
import postCategoryRoutes from './postCategoryRoute.js'
import sliderRoute from './sliderRoute.js'
import couponScope from './couponScope.js'
import marketingRoutes from './marketingAIRouter.js'
import boardRoutes from './boardRoute.js'
import RevenueRoutes from './revenueAdminRoute.js'

const Router = express.Router()

Router.get('/ping', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

Router.use('/auth', authRoutes)
Router.use('/user', userRoutes)
Router.use('/admin', adminRoutes)
Router.use('/cart', cartItemRoutes)
Router.use('/category', categoryRoutes)
Router.use('/payment', paymentRoutes)
Router.use('/shipment', shipmentRoutes)
Router.use('/discount', discountRoutes)
Router.use('/discount_product', discountProductRoutes)
Router.use('/transaction', transactionRoutes)
Router.use('/order_item', orderItemRoutes)
Router.use('/orders', orderDetailRoutes)
Router.use('/coupon', couponRoute)
Router.use('/coupon_scope', couponScope)
Router.use('/comments', commentRoutes)
Router.use('/ai_feedback', aiFeedbackRoutes)
Router.use('/reactions', commentReactionRoute)
Router.use('/ai', aiRoutes)
Router.use('/products', productRoutes)
Router.use('/post', postRoutes)
Router.use('/post_type', postTypeRoute)
Router.use('/post_category', postCategoryRoutes)
Router.use('/marketing', marketingRoutes)
Router.use('/boards', boardRoutes)
Router.use('/revenue', RevenueRoutes)
// Router.use('/columns', columnRoutes)
// Router.use('/cards', cardRoutes)

Router.use('/slider', sliderRoute)
export const APIs_V1 = Router
