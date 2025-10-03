import express from 'express'
import { transactionController } from '~/controllers/transactionController'
const Router = express.Router()

Router.route('/').post(transactionController.addTransaction) 

Router.route('/').get(transactionController.getTransactionById) 

Router.route('/list').get(transactionController.getListTransactions)

Router.route('/by_user').get(transactionController.getTransactionsByUser)  

Router.route('/by_status').get(transactionController.getTransactionsByStatus) 

Router.route('/by_shipment_status').get(transactionController.getTransactionsByShipmentStatus) 

Router.route('/').patch(transactionController.updateTransaction) 

Router.route('/').delete(transactionController.deleteTransaction) 

export default Router