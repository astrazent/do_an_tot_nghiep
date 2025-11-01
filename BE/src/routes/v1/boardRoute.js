import express from 'express'
import { boardController } from '~/controllers/boardController'
const Router = express.Router()

Router.route('/').get(boardController.totalProductsSold) 

Router.route('/total_users').get(boardController.totalUsers)

Router.route('/total_inventory').get(boardController.totalInventory)

Router.route('/monthly_revenue').get(boardController.monthlyRevenue)

Router.route('/top_customers').get(boardController.topBuyingCustomers)

Router.route('/top_product').get(boardController.topBuyedProduct)

Router.route('/oder_count_by_status').get(boardController.OrderCountByStatus)

Router.route('/new_users_by_months').get(boardController.NewUsersByMonths)

Router.route('/revenue_by_category').get(boardController.RevenueByCategory)

Router.route('/revenue_by_paymentMethod').get(boardController.RevenueByPaymentMethod)

Router.route('/revenue_by_shipmentMethod').get(boardController.RevenueByShipmentMethod)

export default Router
