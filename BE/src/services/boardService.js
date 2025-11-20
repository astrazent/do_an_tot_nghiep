/**
 * Chức năng: Chứa các business logic (nghiệp vụ chính), tách riêng khỏi controller
 * Tạo file mới:
 *   - Khi có entity cần xử lý logic phức tạp (UserService.js, ProductService.js, OrderService.js)
 *   - Khi có chức năng chung cần tái sử dụng nhiều nơi (AuthService.js, ReportService.js)
 */

import { BoardsModel } from '~/models/boardModel'
const totalProductsSold = async (date) => {
    const result = await BoardsModel.getTotalProductsSold(date)
    return result
}

const totalUsers = async (date) => {
    const result = await BoardsModel.getTotalUsers(date)
    return result
}

const totalInventory = async () => {
    const result = await BoardsModel.getTotalStock()
    return result
}

const monthlyRevenue = async (date) => {
    const result = await BoardsModel.getMonthlyRevenue(date)
    return result
}

const yearRevenue = async () => {
    const result = await BoardsModel.getYearRevenue()
    return result
}

const FinancialData = async (date) => {
    const result = await BoardsModel.getFinancialData(date)
    return result
}

const topBuyingCustomers = async (date) => {
    const result = await BoardsModel.getTopCustomers(date)
    return result
}

const topBuyedProduct = async (date) => {
    const result = await BoardsModel.getBestSellingProduct(date)
    return result
}

const OrderCountByStatus = async (date) => {
    const result = await BoardsModel.getOrderCountByStatus(date)
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

const getReturningCustomerRate = async (date) => {
    const result = await BoardsModel.getReturningCustomerRate(date)
    return result
}

const getCustomerConversionRate = async (date) => {
    const result = await BoardsModel.getCustomerConversionRate(date)
    return result
}

const getOrderConversionRate = async (date) => {
    const result = await BoardsModel.getOrderConversionRate(date)
    return result
}

const getCancelRefundRate = async (date) => {
    const result = await BoardsModel.getCancelRefundRate(date)
    return result
}

const getRevenueByLocation = async (date) => {
    const result = await BoardsModel.getRevenueByLocation(date)
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
    yearRevenue,
    FinancialData,
    getReturningCustomerRate,
    getCustomerConversionRate,
    getOrderConversionRate,
    getCancelRefundRate,
    getRevenueByLocation
}
