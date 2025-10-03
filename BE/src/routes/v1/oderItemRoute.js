import express from 'express'
import { orderItemController } from '~/controllers/orderItemController'
const Router = express.Router()

Router.route('/').post(orderItemController.addOrderItem) 

Router.route('/').get(orderItemController.getOrderItemById) 

Router.route('/list').get(orderItemController.getListOrderItems)

Router.route('/by_transaction').get(orderItemController.getItemsByTransaction)  

Router.route('/by_product').get(orderItemController.getItemsByProduct) 

Router.route('/').patch(orderItemController.updateOrderItem) 

Router.route('/').delete(orderItemController.deleteOrderItem) 

export default Router