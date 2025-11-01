/**
 * Chức năng: Chứa các business logic (nghiệp vụ chính), tách riêng khỏi controller
 * Tạo file mới:
 *   - Khi có entity cần xử lý logic phức tạp (UserService.js, ProductService.js, OrderService.js)
 *   - Khi có chức năng chung cần tái sử dụng nhiều nơi (AuthService.js, ReportService.js)
 */

import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { BoardsModel } from '~/models/boardModel'
const totalProductsSold = async () => {
    const result = await BoardsModel.getTotalProductsSold()
    return result
}

const totalUsers = async () => {
    const result = await BoardsModel.getTotalUsers()
    return result
}

const totalInventory = async () => {
    const result = await BoardsModel.getTotalStock()
    return result
}

const monthlyRevenue = async (data) => {
    const result = await BoardsModel.getMonthlyRevenue(data)
    return result
}

const topBuyingCustomers = async () => {
    const result = await BoardsModel.getTopCustomers()
    return result
}

const topBuyedProduct = async () => {
    const result = await BoardsModel.getBestSellingProduct()
    return result
}

const OrderCountByStatus = async () => {
    const result = await BoardsModel.getOrderCountByStatus()
    return result
}

const NewUsersByMonths = async () => {
    const result = await BoardsModel.getNewUsersByMonths()
    return result
}

const RevenueByCategory = async () => {
    const result = await BoardsModel.getRevenueByCategory()
    return result
}

const RevenueByPaymentMethod = async () => {
    const result = await BoardsModel.getRevenueByPaymentMethod()
    return result
}

const RevenueByShipmentMethod = async () => {
    const result = await BoardsModel.getRevenueByShipmentMethod()
    return result
}

export const boardService = {
    totalProductsSold,
    totalUsers,
    totalInventory,
    monthlyRevenue,
    topBuyingCustomers,
    topBuyedProduct,
    OrderCountByStatus,
    NewUsersByMonths,
    RevenueByCategory,
    RevenueByPaymentMethod,
    RevenueByShipmentMethod,
}
