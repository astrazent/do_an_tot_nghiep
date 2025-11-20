/**
 * Chức năng: xử lý logic cho request, gọi model thao tác dữ liệu, trả response về client
 * Tạo file mới:
 *   - Khi có entity riêng (User, Product, Order...) cần CRUD/logic xử lý riêng (userController.js, productController.js, orderController.js)
 *   - Khi có chức năng độc lập (Auth, Report, Dashboard...) không gắn trực tiếp với entity nào (authController.js)
 */
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const totalProductsSold = async (req, res, next) => {
    try {
        const result = await boardService.totalProductsSold(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy tổng sản phẩm đã bán thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const totalUsers = async (req, res, next) => {
    try {
        const result = await boardService.totalUsers(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy tổng người dùng thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const totalInventory = async (req, res, next) => {
    try {
        const result = await boardService.totalInventory()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy tổng tồn kho thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const monthlyRevenue = async (req, res, next) => {
    try {
        const result = await boardService.monthlyRevenue(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy doanh thu hàng tháng thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const yearRevenue = async (req, res, next) => {
    try {
        const result = await boardService.yearRevenue()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy doanh thu theo năm nay thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const FinancialData = async (req, res, next) => {
    try {
        const result = await boardService.FinancialData(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy data thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const topBuyingCustomers = async (req, res, next) => {
    try {
        const result = await boardService.topBuyingCustomers(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy khách hàng mua nhiều nhất thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const topBuyedProduct = async (req, res, next) => {
    try {
        const result = await boardService.topBuyedProduct(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy sản phẩm bán chạy nhất thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const OrderCountByStatus = async (req, res, next) => {
    try {
        const result = await boardService.OrderCountByStatus(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy tổng đơn hàng theo trạng thái thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const NewUsersByMonths = async (req, res, next) => {
    try {
        const result = await boardService.NewUsersByMonths()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy người dùng mới theo 7 tháng gần nhất thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const RevenueByCategory = async (req, res, next) => {
    try {
        const result = await boardService.RevenueByCategory()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy doanh thu theo danh mục thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const RevenueByPaymentMethod = async (req, res, next) => {
    try {
        const result = await boardService.RevenueByPaymentMethod()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy doanh thu theo phương thức thanh toán thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const RevenueByShipmentMethod = async (req, res, next) => {
    try {
        const result = await boardService.RevenueByShipmentMethod()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy doanh thu theo phương thức vận chuyển thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const getReturningCustomerRate = async (req, res, next) => {
    try {
        const result = await boardService.getReturningCustomerRate(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy tỷ lệ khách quay lại thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const getCustomerConversionRate = async (req, res, next) => {
    try {
        const result = await boardService.getReturningCustomerRate(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy tỷ lệ chuyển đổi khách hàng thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const getOrderConversionRate = async (req, res, next) => {
    try {
        const result = await boardService.getOrderConversionRate(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy tỷ lệ chuyển đổi đơn hàng thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const getCancelRefundRate = async (req, res, next) => {
    try {
        const result = await boardService.getCancelRefundRate(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy tỷ lệ huỷ / trả hàng thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const getRevenueByLocation = async (req, res, next) => {
    try {
        const result = await boardService.getRevenueByLocation(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy doanh thu theo khu vực thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}


export const boardController = {
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
