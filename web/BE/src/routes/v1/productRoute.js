import express from 'express'
import { productController } from '~/controllers/productController'
import { upload, uploadCloudinary } from '~/middlewares/uploadCloudinary'
const Router = express.Router()

Router.route('/').post(
    upload.array('images', 10),
    uploadCloudinary,
    productController.createProduct
)

Router.route('/').get(productController.getByIdProduct)

Router.route('/inventory_dashboard').get(productController.getInventoryDashboard)

Router.route('/sold_product_chart_by_year').get(productController.getSoldProductChartByYear)

Router.route('/product_stock_by_category').get(productController.getProductStockByCategory)

Router.route('/unsold_products_this_month').get(productController.getUnsoldProductsThisMonth)

Router.route('/top_5_customers').get(productController.getTop5Customers)

Router.route('/by_slug').get(productController.getBySlug)

Router.route('/hot_product').get(productController.getHotProduct)

Router.route('/related_by_slug').get(productController.getRelatedBySlug)

Router.route('/list_promotion').get(productController.getListPromotionProduct)

Router.route('/list').get(productController.getListProduct)

Router.route('/search_by_category').get(productController.getSearchByCategory)

Router.route('/search').get(productController.getSearchProduct)

Router.route('/:productId').patch(productController.updateProduct)

Router.route('/').delete(productController.deleteProduct)

export default Router
