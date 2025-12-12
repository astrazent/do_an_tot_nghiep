import express from 'express'
import { discountController } from '~/controllers/discountController'
import { discountValidation } from '~/validations/discountValidaton'
const Router = express.Router()

Router.route('/').post(
    discountValidation.validateDiscount,
    discountController.addDiscount
)

Router.route('/').get(discountController.getDiscountById)

Router.route('/getAll').get(discountController.getAllDiscount)

Router.route('/active').get(discountController.getActiveDiscount)

Router.route('/').patch(discountController.updateDiscount)

Router.route('/').delete(discountController.deleteDiscount)

export default Router
