import express from 'express'
import { RevenueController } from '~/controllers/RevenueController'
const Router = express.Router()

Router.route('/revenue_analysis_KPIs').get(RevenueController.getRevenueAnalysisKPIs) 

Router.route('/year_revenue_and_orders').get(RevenueController.getYearRevenueAndOrders) 

Router.route('/customer_new_vs_returning_revenue').get(RevenueController.getNewVsReturningRevenue) 

Router.route('/revenue_by_category').get(RevenueController.getRevenueByCategory) 

Router.route('/product_revenue_list').get(RevenueController.getProductRevenueList) 

Router.route('/revenue_by_payment_method').get(RevenueController.getRevenueByPaymentMethod) 

Router.route('/revenue_by_shipment_method').get(RevenueController.getRevenueByShipmentMethod) 

export default Router