import { paymentService } from '~/services/paymentService.js'
import { StatusCodes } from 'http-status-codes'
import ErrorServer from '~/utils/ErrorServer'

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
        return ErrorServer(error, req, res, next)
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
        return ErrorServer(error, req, res, next)
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
        return ErrorServer(error, req, res, next)
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
        return ErrorServer(error, req, res, next)
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
        return ErrorServer(error, req, res, next)
    }
}

const deletePayment = async (req, res, next) => {
    try {
        const data = await paymentService.deletePaymentService(req.query.paymentId)
        return res.status(StatusCodes.OK).json({
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
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