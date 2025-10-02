import express from 'express'
import { paymentController } from '~/controllers/paymentController'
const Router = express.Router()

Router.route('/').post(paymentController.addPayment) 

Router.route('/').get(paymentController.getPaymentById)

Router.route('/getAll').get(paymentController.getAllPayments)

Router.route('/').patch(paymentController.updatePayment)

Router.route('/').delete(paymentController.deletePayment)

export default Router
