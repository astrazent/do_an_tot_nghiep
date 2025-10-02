import { PaymentsModel } from '~/models/paymentModel.js'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const addPaymentService = async (method, status) => {
    if (!method || !status) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Thiếu thông tin phương thức thanh toán'
        )
    }
    const existingPayment = await PaymentsModel.getPaymentsByMethod(method)
    if (existingPayment) {
        throw new ApiError(
            StatusCodes.CONFLICT,
            'Phương thức thanh toán đã tồn tại'
        )
    }
    const newPayment = await PaymentsModel.createPayment({
        method,
        status,
    })
    return newPayment
}

const getPaymentByIdService = async (paymentId) => {
    const payment = await PaymentsModel.getPaymentById(paymentId)
    if (!payment) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy phương thức thanh toán'
        )
    }
    return payment
}

const getAllPaymentsService = async () => {
    const payments = await PaymentsModel.getAllPayments()
    return payments
}

const updatePaymentService = async (id, method, status) => {
    if (!id) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Thiếu ID phương thức thanh toán')
    }
    await PaymentsModel.updatePayment(id, { method, status })
    const updatedPayment = await PaymentsModel.getPaymentById(id)
    return updatedPayment
}

const deletePaymentService = async (paymentId) => {
    if (!paymentId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Thiếu ID phương thức thanh toán')
    }
    const existingPayment = await PaymentsModel.getPaymentById(paymentId)
    if (!existingPayment) {
        throw new ApiError( 
            StatusCodes.NOT_FOUND,
            'Không tìm thấy phương thức thanh toán'
        )
    }   
    await PaymentsModel.deletePayment(paymentId)
    return { message: 'Xóa phương thức thanh toán thành công' }
}

export const paymentService = {
    addPaymentService,
    getAllPaymentsService,
    updatePaymentService,
    getPaymentByIdService,
    deletePaymentService
}
