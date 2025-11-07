import express from 'express'
import { paymentController } from '~/controllers/paymentController'
import { paymentValidation } from '~/validations/paymentValidation'
const Router = express.Router()

Router.route('/').post(paymentValidation.validatePayment, paymentController.addPayment) 

Router.route('/').get(paymentController.getPaymentById)

Router.route('/getAll').get(paymentController.getAllPayments)

Router.route('/active').get(paymentController.getActivePayment)

Router.route('/').patch(paymentController.updatePayment)

Router.route('/').delete(paymentController.deletePayment)

export default Router
