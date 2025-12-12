import express from 'express'
import { transactionController } from '~/controllers/transactionController'
import { transactionValidation } from '~/validations/transactionValidation'
const Router = express.Router()

Router.route('/').post(
    transactionValidation.validateTransaction,
    transactionController.addTransaction
)

Router.route('/chatbot').post(
    transactionValidation.validateTransaction,
    transactionController.addChatBotTransaction
)

Router.route('/by_email_slug').get(
    transactionController.getTransactionByEmailAndSlug
)

Router.route('/').get(transactionController.getTransactionById)

Router.route('/list').get(transactionController.getListTransactions)

Router.route('/by_user').get(transactionController.getTransactionsByUser)

Router.route('/by_status').get(transactionController.getTransactionsByStatus)

Router.route('/by_shipment_status').get(
    transactionController.getTransactionsByShipmentStatus
)

Router.route('/').patch(transactionController.updateTransaction)

Router.route('/by_user_tracking_number').delete(
    transactionController.deleteByUserAndTrackingNumber
)

Router.route('/').delete(transactionController.deleteTransaction)

export default Router
