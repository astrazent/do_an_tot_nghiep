import express from 'express'
import { productController } from '~/controllers/productController'
const Router = express.Router()

Router.route('/').post(productController.createProduct) 

Router.route('/').get(productController.getByIdProduct)

Router.route('/category').get(productController.getByCategory)

Router.route('/list').get(productController.getListProduct)

Router.route('/search').get(productController.searchProduct)

Router.route('/').patch(productController.updateProduct)

Router.route('/').delete(productController.deleteProduct)


export default Router
