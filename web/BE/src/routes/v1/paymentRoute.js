import express from 'express'
import { paymentController } from '~/controllers/paymentController'
import { paymentValidation } from '~/validations/paymentValidation'
const Router = express.Router()

Router.route('/').post(
    paymentValidation.validatePayment,
    paymentController.addPayment
)

Router.route('/').get(paymentController.getPaymentById)

Router.route('/by_method').get(paymentController.getPaymentByMethod)

Router.route('/list').get(paymentController.getAllPayments)

Router.route('/active').get(paymentController.getActivePayment)

Router.route('/').patch(paymentController.updatePayment)

Router.route('/').delete(paymentController.deletePayment)

Router.route('/vnpay/create_payment').post(paymentController.createVnpayUrl)

Router.route('/vnpay/return').get(paymentController.handleVnpayReturn)

export default Router
