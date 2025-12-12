import { transactionService } from '~/services/transactionService'
import { StatusCodes } from 'http-status-codes'
import { broadcast } from '~/sockets/sseClient'
const addTransaction = async (req, res, next) => {
    try {
        const data = await transactionService.addTransactionService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Tạo giao dịch thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const addChatBotTransaction = async (req, res, next) => {
    try {
        const data = await transactionService.addChatBotTransactionService(
            req.body
        )

        broadcast({
            event: 'transaction_added',
            status: 'success',
            transaction: data,
            message: 'Giao dịch đã được thêm thành công!',
        })

        return res.status(StatusCodes.OK).json({
            message: 'Tạo giao dịch chatbot thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getTransactionByEmailAndSlug = async (req, res, next) => {
    try {
        const { email, slug } = req.query
        if (!email || !slug) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Thiếu email hoặc slug sản phẩm',
            })
        }
        const data =
            await transactionService.getTransactionByEmailAndSlugService(
                email,
                slug
            )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy giao dịch thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getTransactionById = async (req, res, next) => {
    try {
        const data = await transactionService.getTransactionByIdService(
            req.query.transactionId
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy giao dịch thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getListTransactions = async (req, res, next) => {
    try {
        const data = await transactionService.getListTransactionsService(
            req.body
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách giao dịch thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getTransactionsByUser = async (req, res, next) => {
    try {
        const data = await transactionService.getTransactionsByUserService(
            req.query.user_id
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách giao dịch theo người dùng thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getTransactionsByStatus = async (req, res, next) => {
    try {
        const data = await transactionService.getTransactionsByStatusService(
            req.query.status
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách giao dịch theo status thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getTransactionsByShipmentStatus = async (req, res, next) => {
    try {
        const data =
            await transactionService.getTransactionsByShipmentStatusService(
                req.body.shipment_status
            )
        return res.status(StatusCodes.OK).json({
            message:
                'Lấy danh sách giao dịch theo trạng thái giao hàng thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const updateTransaction = async (req, res, next) => {
    try {
        const data = await transactionService.updateTransactionService(
            req.query.transactionId,
            req.body
        )
        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật giao dịch thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deleteByUserAndTrackingNumber = async (req, res, next) => {
    try {
        const { tracking_number, user_id } = req.query

        if (!user_id || !tracking_number) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Thiếu user_id hoặc tracking_number',
            })
        }

        const data =
            await transactionService.deleteByUserAndTrackingNumberService(
                user_id,
                tracking_number
            )

        return res.status(StatusCodes.OK).json({ data })
    } catch (error) {
        next(error)
    }
}

const deleteTransaction = async (req, res, next) => {
    try {
        const data = await transactionService.deleteTransactionService(
            req.query.transactionId
        )
        return res.status(StatusCodes.OK).json({
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const transactionController = {
    addTransaction,
    addChatBotTransaction,
    getTransactionByEmailAndSlug,
    getListTransactions,
    getTransactionById,
    getTransactionsByShipmentStatus,
    getTransactionsByStatus,
    getTransactionsByUser,
    updateTransaction,
    deleteByUserAndTrackingNumber,
    deleteTransaction,
}
