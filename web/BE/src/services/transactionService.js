import { TransactionsModel } from '~/models/transactionModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { ShipmentsModel } from '~/models/shipmentModel'
import { PaymentsModel } from '~/models/paymentModel'
import { CartItemsModel } from '~/models/cartItemModel'
import { UsersModel } from '~/models/userModel'
import { ProductsModel } from '~/models/productModel'

export const addTransactionService = async data => {
    const shipmentRecord = await ShipmentsModel.getShipmentByName(
        data.shipment_method
    )
    if (!shipmentRecord)
        throw new Error(
            `Không tìm thấy shipment với tên: ${data.shipment_method}`
        )

    const paymentRecords = await PaymentsModel.getPaymentsByMethod(
        data.payment_method
    )
    if (!paymentRecords || paymentRecords.length === 0)
        throw new Error(
            `Không tìm thấy payment với method: ${data.payment_method}`
        )

    const paymentRecord = paymentRecords[0]

    let items = []
    if (data.user_id) {
        const cartItems = await CartItemsModel.getCartItemsByUser(data.user_id)
        if (!cartItems || cartItems.length === 0)
            throw new Error(
                `Không có sản phẩm nào trong giỏ hàng của user_id=${data.user_id}`
            )
        items = cartItems.map(i => ({
            product_id: i.product_id,
            qty_total: i.qty_total,
            amount_total: i.price_total,
        }))
    } else if (Array.isArray(data.items) && data.items.length > 0) {
        items = data.items.map(i => ({
            product_id: i.product_id,
            qty_total: i.qty_total,
            amount_total: i.amount_total,
        }))
    }

    const transactionData = {
        user_id: data.user_id || null,
        payment_id: paymentRecord.id,
        shipment_id: shipmentRecord.id,
        status: data.status || 'pending',
        source: 'system',
        deli_name: data.deli_name,
        deli_phone: data.deli_phone,
        deli_email: data.deli_email || null,
        deli_address: data.deli_address,
        deli_city: data.deli_city,
        deli_district: data.deli_district,
        deli_ward: data.deli_ward,
        message: data.message || '',
        shipping_fee: data.shipping_fee || 0,
        payment_status: data.payment_status || 'pending',
        shipment_status: data.shipment_status || 'pending',
        amount: data.amount || 0,
        shipped_at: data.shipped_at || null,
        delivered_at: data.delivered_at || null,
        items,
    }

    return await TransactionsModel.createTransaction(transactionData)
}

export const addChatBotTransactionService = async data => {
    const shipmentRecord = await ShipmentsModel.getShipmentById(
        data.shipment_id
    )
    if (!shipmentRecord)
        throw new Error(`shipment_id không hợp lệ: ${data.shipment_id}`)
    const paymentRecord = await PaymentsModel.getPaymentById(data.payment_id)
    if (!paymentRecord)
        throw new Error(`payment_id không hợp lệ: ${data.payment_id}`)

    const transactionData = {
        user_id: data.user_id || null,
        payment_id: data.payment_id,
        shipment_id: data.shipment_id,
        status: 'pending',
        source: 'chatbot',
        deli_name: data.deli_name,
        deli_phone: data.deli_phone,
        deli_email: null,
        deli_address: data.deli_address,
        deli_city: null,
        deli_district: null,
        deli_ward: null,
        message: data.message || '',
        shipping_fee: data.shipping_fee,
        payment_status: data.payment_status || 'pending',
        shipment_status: 'pending',
        amount: data.amount,
        shipped_at: null,
        delivered_at: null,
        items: data.items,
    }

    return await TransactionsModel.createTransaction(transactionData)
}

const getTransactionByEmailAndSlugService = async (email, slug) => {
    const user = await UsersModel.findUserByEmailOrUsername(email)
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Người dùng không tồn tại')
    }

    const product = await ProductsModel.getProductBySlug(slug)
    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại')
    }

    const orderItem = await TransactionsModel.getTransactionByEmailAndSlug(
        user.id,
        product.id
    )

    if (!orderItem) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Người dùng chưa mua sản phẩm này'
        )
    }

    return orderItem
}

const getTransactionByIdService = async transactionId => {
    const transaction =
        await TransactionsModel.getTransactionById(transactionId)
    if (!transaction) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy giao dịch này'
        )
    }
    return transaction
}

const getListTransactionsService = async data => {
    const listTransaction = await TransactionsModel.listTransactions(
        data.limit,
        data.offset
    )
    return listTransaction
}

const getOrderStats = async () => {
    const result = await TransactionsModel.getOrderStats()
    return result
}

const getAverageProcessingTime = async () => {
    const result = await TransactionsModel.getAverageProcessingTime()
    return result
}

const getCancelRefundRate = async () => {
    const result = await TransactionsModel.getCancelRefundRate()
    return result
}

const getAverageProductRating = async () => {
    const result = await TransactionsModel.getAverageRating()
    return result
}

const getTransactionsByUserService = async user_id => {
    const transactionByUser =
        await TransactionsModel.getTransactionsByUser(user_id)
    if (transactionByUser.length == 0) {
        return []
    }
    return transactionByUser
}

const getOrderStatusOfTransaction = async () => {
    const data = await TransactionsModel.getTransactionStatusStats()
    if (!data) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy dữ liệu'
        )
    }
    return data
}

const getTransactionsByStatusService = async status => {
    const transactionByStatus =
        await TransactionsModel.getTransactionsByStatus(status)
    if (transactionByStatus.length == 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy giao dịch nào ứng với status này'
        )
    }
    return transactionByStatus
}

const getTransactionsByShipmentStatusService = async shipment_status => {
    const transactionByShipmentStatus =
        await TransactionsModel.getTransactionsByShipmentStatus(shipment_status)
    if (transactionByShipmentStatus.length == 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy giao dịch nào'
        )
    }
    return transactionByShipmentStatus
}

const updateTransactionService = async (transactionId, data) => {
    const transaction =
        await TransactionsModel.getTransactionById(transactionId)
    if (!transaction) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy giao dịch này'
        )
    }

    const result = await TransactionsModel.updateTransaction(
        transactionId,
        data
    )
    return result
}

const deleteByUserAndTrackingNumberService = async (
    user_id,
    tracking_number
) => {
    const deleted = await TransactionsModel.deleteByUserAndTrackingNumber(
        user_id,
        tracking_number
    )

    if (!deleted) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy giao dịch này'
        )
    }

    return { message: 'Xóa giao dịch thành công' }
}

const deleteTransactionService = async transactionId => {
    const transaction =
        await TransactionsModel.getTransactionById(transactionId)
    if (!transaction) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy giao dịch này'
        )
    }

    await TransactionsModel.deleteTransaction(transactionId)
    return { message: 'Xóa giao dịch thành công' }
}

export const transactionService = {
    addTransactionService,
    addChatBotTransactionService,
    getTransactionByEmailAndSlugService,
    getListTransactionsService,
    getTransactionByIdService,
    getTransactionsByShipmentStatusService,
    getTransactionsByStatusService,
    getTransactionsByUserService,
    updateTransactionService,
    deleteByUserAndTrackingNumberService,
    deleteTransactionService,
    getOrderStatusOfTransaction,
    getOrderStats,
    getAverageProcessingTime,
    getCancelRefundRate,
    getAverageProductRating
}
