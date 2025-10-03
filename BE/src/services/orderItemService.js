import { OrderItemsModel } from '~/models/orderItemModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const addOrderItemService = async data => {
    const orderItem = await OrderItemsModel.createOrderItem(data)
    return orderItem
}

const getOrderItemByIdService = async orderItemId => {
    const orderItem = await OrderItemsModel.getOrderItemById(orderItemId)
    if(!orderItem) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy orderItem này'
        )
    }
    return orderItem
}

const getListOrderItemsService = async data => {
    const listOrderItems = await OrderItemsModel.listOrderItems(data.limit, data.offset)
    return listOrderItems
}

const getItemsByTransactionService = async transaction_id => {
    const listItemsByTransaction = await OrderItemsModel.getItemsByTransaction(transaction_id)
    if(listItemsByTransaction.length == 0){
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy orderItem nào theo giao dich này'
        )
    }
    return listItemsByTransaction
}

const getItemsByProductService = async product_id => {
    const listItemsByProduct = await OrderItemsModel.getItemsByProduct(product_id)
    if(listItemsByProduct.length == 0){
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy orderItem nào theo sản phẩm này'
        )
    }
    return listItemsByProduct
}

const updateOrderItemService = async (orderItemId, data) => {
    const orderItem = await OrderItemsModel.getOrderItemById(orderItemId)
    if(!orderItem) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy orderItem này'
        )
    }

    const result = await OrderItemsModel.updateOrderItem(orderItemId, data)
    return result
}

const deleteOrderItemService = async orderItemId => {
    const orderItem = await OrderItemsModel.getOrderItemById(orderItemId)
    if(!orderItem) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy orderItem này'
        )
    }

    await OrderItemsModel.deleteOrderItem(orderItemId)
    return {message: "Xóa orderItem thành công"}
}

export const orderItemService = {
    addOrderItemService,
    getItemsByProductService,
    getItemsByTransactionService,
    getListOrderItemsService,
    getOrderItemByIdService,
    updateOrderItemService,
    deleteOrderItemService
}