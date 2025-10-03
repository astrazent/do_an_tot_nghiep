import express from 'express'
import { discountController } from '~/controllers/discountController'
const Router = express.Router()

Router.route('/').post(discountController.addDiscount) 

Router.route('/').get(discountController.getDiscountById)

Router.route('/getAll').get(discountController.getAllDiscount)

Router.route('/active').get(discountController.getActiveDiscount)

Router.route('/').patch(discountController.updateDiscount)

Router.route('/').delete(discountController.deleteDiscount)

export default Router
