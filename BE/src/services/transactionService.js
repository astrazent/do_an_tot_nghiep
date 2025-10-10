import { TransactionsModel } from '~/models/transactionModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const addTransactionService = async data => {
    const transaction = await TransactionsModel.createTransaction(data)
    return transaction
}

const getTransactionByIdService = async transactionId => {
    const transaction = await TransactionsModel.getTransactionById(transactionId)
    if(!transaction) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy giao dịch này'
        )
    }
    return transaction
}

const getListTransactionsService = async data => {
    const listTransaction = await TransactionsModel.listTransactions(data.limit, data.offset)
    return listTransaction
}

const getTransactionsByUserService = async user_id => {
    const transactionByUser = await TransactionsModel.getTransactionsByUser(user_id)
    if(transactionByUser.length == 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Người dùng nào chưa có giao dịch nào'
        )
    }
    return transactionByUser
}

const getTransactionsByStatusService = async status => {
    const transactionByStatus = await TransactionsModel.getTransactionsByStatus(status)
    if(transactionByStatus.length == 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy giao dịch nào ứng với status này'
        )
    }
    return transactionByStatus
}

const getTransactionsByShipmentStatusService = async shipment_status => {
    const transactionByShipmentStatus = await TransactionsModel.getTransactionsByShipmentStatus(shipment_status)
    if(transactionByShipmentStatus.length == 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy giao dịch nào'
        )
    }
    return transactionByShipmentStatus
}

const updateTransactionService = async (transactionId, data) => {
    const transaction = await TransactionsModel.getTransactionById(transactionId)
    if(!transaction) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy giao dịch này'
        )
    }

    const result = await TransactionsModel.updateTransaction(transactionId, data)
    return result
}

const deleteTransactionService = async transactionId => {
    const transaction = await TransactionsModel.getTransactionById(transactionId)
    if(!transaction) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy giao dịch này'
        )
    }

    await TransactionsModel.deleteTransaction(transactionId)
    return { message: "Xóa giao dịch thành công" }
}

export const transactionService = {
    addTransactionService,
    getListTransactionsService,
    getTransactionByIdService,
    getTransactionsByShipmentStatusService,
    getTransactionsByStatusService,
    getTransactionsByUserService,
    updateTransactionService,
    deleteTransactionService
}