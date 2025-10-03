import { transactionService } from "~/services/transactionService"
import { StatusCodes } from 'http-status-codes'

const addTransaction = async (req, res, next) => {
    try {
        const data = await transactionService.addTransactionService(req.body)
        return res.status(StatusCodes.OK).json({
            message: "Tạo giao dịch thành công",
            data
        })
    } catch (error) {
        return next(error)
    }
}

const getTransactionById = async (req, res, next) => {
    try {
        const data = await transactionService.getTransactionByIdService(req.query.transactionId)
        return res.status(StatusCodes.OK).json({
            message: "Lấy giao dịch thành công",
            data
        })
    } catch (error) {
        return next(error)
    }
}

const getListTransactions = async (req, res, next) => {
    try {
        const data = await transactionService.getListTransactionsService(req.body)
        return res.status(StatusCodes.OK).json({
            message: "Lấy danh sách giao dịch thành công",
            data
        })
    } catch (error) {
        return next(error)
    }
}

const getTransactionsByUser = async (req, res, next) => {
    try {
        const data = await transactionService.getTransactionsByUserService(req.query.user_id)
        return res.status(StatusCodes.OK).json({
            message: "Lấy danh sách giao dịch theo người dùng thành công",
            data
        })
    } catch (error) {
        return next(error)
    }
}

const getTransactionsByStatus = async (req, res, next) => {
    try {
        const data = await transactionService.getTransactionsByStatusService(req.query.status)
        return res.status(StatusCodes.OK).json({
            message: "Lấy danh sách giao dịch theo status thành công",
            data
        })
    } catch (error) {
        return next(error)
    }
}

const getTransactionsByShipmentStatus = async (req, res, next) => {
    try {
        const data = await transactionService.getTransactionsByShipmentStatusService(req.body.shipment_status)
        return res.status(StatusCodes.OK).json({
            message: "Lấy danh sách giao dịch theo trạng thái giao hàng thành công",
            data
        })
    } catch (error) {
        return next(error)
    }
}

const updateTransaction = async (req, res, next) => {
    try {
        const data = await transactionService.updateTransactionService(req.query.transactionId, req.body)
        return res.status(StatusCodes.OK).json({
            message: "Cập nhật giao dịch thành công",
            data
        })
    } catch (error) {
        return next(error)
    }
}

const deleteTransaction = async (req, res, next) => {
    try {
        const data = await transactionService.deleteTransactionService(req.query.transactionId)
        return res.status(StatusCodes.OK).json({
            data
        })
    } catch (error) {
        return next(error)
    }
}


export const transactionController = {
    addTransaction,
    getListTransactions,
    getTransactionById,
    getTransactionsByShipmentStatus,
    getTransactionsByStatus,
    getTransactionsByUser,
    updateTransaction,
    deleteTransaction
}