import express from 'express'
import { orderItemController } from '~/controllers/orderItemController'
import { orderItemValidation } from '~/validations/orderItemValidation'
const Router = express.Router()

Router.route('/').post(
    orderItemValidation.validateOrderItem,
    orderItemController.addOrderItem
)

Router.route('/').get(orderItemController.getOrderItemById)

Router.route('/list').get(orderItemController.getListOrderItems)

Router.route('/by_transaction').get(orderItemController.getItemsByTransaction)

Router.route('/by_product').get(orderItemController.getItemsByProduct)

Router.route('/').patch(orderItemController.updateOrderItem)

Router.route('/').delete(orderItemController.deleteOrderItem)

export default Router
