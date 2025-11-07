import express from 'express'
import { productController } from '~/controllers/productController'
const Router = express.Router()

Router.route('/').post(productController.createProduct) 

Router.route('/').get(productController.getByIdProduct)

Router.route('/by_slug').get(productController.getBySlug)

Router.route('/hot_product').get(productController.getHotProduct)

Router.route('/related_by_slug').get(productController.getRelatedBySlug)

Router.route('/list_promotion').get(productController.getListPromotionProduct)

Router.route('/list').get(productController.getListProduct)

Router.route('/search_by_category').get(productController.getSearchByCategory)

Router.route('/search').get(productController.getSearchProduct)

Router.route('/').patch(productController.updateProduct)

Router.route('/').delete(productController.deleteProduct)


export default Router
