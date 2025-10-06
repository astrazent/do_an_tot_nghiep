// controllers/orderController.js
import { getOrderById } from '../services/orderDetailService.js'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

export async function getOrderDetail(req, res, next) {
    const id = req.params.id
    console.log('Received request for order_id:', id)

    try {
        const transaction = await getOrderById(id)

        if (!transaction) {
            console.log('Order not found for id:', id)
            next(new ApiError(StatusCodes.NOT_FOUND, 'Order not found'))
        }

        res.json(transaction)
    } catch (err) {
        console.error('Error fetching order:', err)
        next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error'))
    }
}
