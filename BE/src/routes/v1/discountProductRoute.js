import express from 'express'
import { discountProductController } from '~/controllers/discountProductController'
const Router = express.Router()

Router.route('/').post(discountProductController.addDiscountProduct) 

Router.route('/').get(discountProductController.getDiscountProductById) 

Router.route('/list').get(discountProductController.getListDiscountProduct) 

Router.route('/').patch(discountProductController.updateDiscountProduct) 

Router.route('/').delete(discountProductController.deleteDiscountProduct) 

Router.route('/product_by_discount').get(discountProductController.getProductsByDiscount) 

Router.route('/discount_by_product').get(discountProductController.getDiscountsByProduct) 

export default Router
