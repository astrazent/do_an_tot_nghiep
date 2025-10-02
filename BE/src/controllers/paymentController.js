import { paymentService } from '~/services/paymentService.js'
import { StatusCodes } from 'http-status-codes'

const addPayment = async (req, res, next) => {
    try {
        const data = await paymentService.addPaymentService(
            req.body.method,
            req.body.status
        )
        return res.status(StatusCodes.OK).json({
            message: 'Thêm phương thức thanh toán thành công',
            data,
        })
    } catch (error) {
        return next(error)
    }
}

const getAllPayments = async (req, res, next) => {
    try {
        const data = await paymentService.getAllPaymentsService()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy tất cả phương thức thanh toán thành công',
            data,
        })
    } catch (error) {
        return next(error)
    }
}

const updatePayment = async (req, res, next) => {
    try {
        const data = await paymentService.updatePaymentService(
            req.body.id,
            req.body.method,
            req.body.status
        )
        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật phương thức thanh toán thành công',
            data,
        })
    } catch (error) {
        return next(error)
    }
}

const getPaymentById = async (req, res, next) => {
    try {
        const data = await paymentService.getPaymentByIdService(req.query.paymentId)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy phương thức thanh toán thành công',
            data,
        })
    } catch (error) {
        return next(error)
    }
}

const getActivePayment = async (req, res, next) => {
    try {
        const data = await paymentService.getActivePaymentService()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy phương thức thanh toán đang hoạt động thành công',
            data,
        })
    } catch (error) {
        return next(error)
    }
}

const deletePayment = async (req, res, next) => {
    try {
        const data = await paymentService.deletePaymentService(req.query.paymentId)
        return res.status(StatusCodes.OK).json({
            data,
        })
    } catch (error) {
        return next(error)
    }
}
export const paymentController = {
    addPayment,
    getAllPayments,
    updatePayment,
    getPaymentById,
    deletePayment,
    getActivePayment
}