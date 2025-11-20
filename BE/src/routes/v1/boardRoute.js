import express from 'express'
import { boardController } from '~/controllers/boardController'
const Router = express.Router()

Router.route('/total_products_sold').get(boardController.totalProductsSold) 

Router.route('/total_users').get(boardController.totalUsers)

Router.route('/total_inventory').get(boardController.totalInventory)

Router.route('/monthly_revenue').get(boardController.monthlyRevenue)

Router.route('/year_revenue').get(boardController.yearRevenue)

Router.route('/top_customers').get(boardController.topBuyingCustomers)

Router.route('/top_product').get(boardController.topBuyedProduct)

Router.route('/oder_count_by_status').get(boardController.OrderCountByStatus)

Router.route('/new_users_by_months').get(boardController.NewUsersByMonths)

Router.route('/revenue_by_category').get(boardController.RevenueByCategory)

Router.route('/revenue_by_paymentMethod').get(boardController.RevenueByPaymentMethod)

Router.route('/revenue_by_shipmentMethod').get(boardController.RevenueByShipmentMethod)

Router.route('/returning_customer_rate').get(boardController.getReturningCustomerRate)

Router.route('/customer_conversion_rate').get(boardController.getCustomerConversionRate)

Router.route('/order_conversion_rate').get(boardController.getOrderConversionRate)

Router.route('/cancel_refund_rate').get(boardController.getCancelRefundRate)

Router.route('/financial_data').get(boardController.FinancialData)

Router.route('/revenue_by_location').get(boardController.getRevenueByLocation)

export default Router
