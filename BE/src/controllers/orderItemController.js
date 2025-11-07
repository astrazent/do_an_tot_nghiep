import { orderItemService } from '~/services/orderItemService'
import { StatusCodes } from 'http-status-codes'

const addOrderItem = async (req, res, next) => {
    try {
        const data = await orderItemService.addOrderItemService(req.body)
        return res.status(StatusCodes.OK).json({
            message: "Tạo orderItem thành công",
            data
        })
    } catch (error) {
        next(error)
    }
}

const getOrderItemById = async (req, res, next) => {
    try {
        const data = await orderItemService.getOrderItemByIdService(req.query.orderItemId)
        return res.status(StatusCodes.OK).json({
            message: "Lấy oderItem thành công",
            data
        })
    } catch (error) {
        next(error)
    }
}

const getListOrderItems = async (req, res, next) => {
    try {
        const data = await orderItemService.getListOrderItemsService(req.body)
        return res.status(StatusCodes.OK).json({
            message: "Lấy danh sách oderItem thành công",
            data
        })
    } catch (error) {
        next(error)
    }
}

const getItemsByTransaction = async (req, res, next) => {
    try {
        const data = await orderItemService.getItemsByTransactionService(req.query.transaction_id)
        return res.status(StatusCodes.OK).json({
            message: "Lấy danh sách oderItem theo giao dịch thành công",
            data
        })
    } catch (error) {
        next(error)
    }
}
const getItemsByProduct = async (req, res, next) => {
    try {
        const data = await orderItemService.getItemsByProductService(req.query.product_id)
        return res.status(StatusCodes.OK).json({
            message: "Lấy danh sách orderItem theo sản phẩm thành công",
            data
        })
    } catch (error) {
        next(error)
    }
}
const updateOrderItem = async (req, res, next) => {
    try {
        const data = await orderItemService.updateOrderItemService(req.query.orderItemId, req.body)
        return res.status(StatusCodes.OK).json({
            message: "Cập nhật orderItem thành công",
            data
        })
    } catch (error) {
        next(error)
    }
}
const deleteOrderItem = async (req, res, next) => {
    try {
        const data = await orderItemService.deleteOrderItemService(req.query.orderItemId)
        return res.status(StatusCodes.OK).json({
            data
        })
    } catch (error) {
        next(error)
    }
}
export const orderItemController = {
    addOrderItem,
    getItemsByProduct,
    getItemsByTransaction,
    getListOrderItems,
    getOrderItemById,
    updateOrderItem,
    deleteOrderItem
}