/**
 * Chức năng: xử lý logic cho request, gọi model thao tác dữ liệu, trả response về client
 * Tạo file mới:
 *   - Khi có entity riêng (User, Product, Order...) cần CRUD/logic xử lý riêng (userController.js, productController.js, orderController.js)
 *   - Khi có chức năng độc lập (Auth, Report, Dashboard...) không gắn trực tiếp với entity nào (authController.js)
 */
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
import ErrorServer from '~/utils/ErrorServer'

const totalProductsSold = async (req, res, next) => {
    try {
        const result = await boardService.totalProductsSold()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy tổng sản phẩm đã bán thành công',
            data: result,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const totalUsers = async (req, res, next) => {
    try {
        const result = await boardService.totalUsers()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy tổng người dùng thành công',
            data: result,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
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
        return ErrorServer(error, req, res, next)
    }
}

const monthlyRevenue = async (req, res, next) => {
    try {
        const result = await boardService.monthlyRevenue(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy doanh thu hàng tháng thành công',
            data: result,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const topBuyingCustomers = async (req, res, next) => {
    try {
        const result = await boardService.topBuyingCustomers()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy khách hàng mua nhiều nhất thành công',
            data: result,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const topBuyedProduct = async (req, res, next) => {
    try {
        const result = await boardService.topBuyedProduct()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy sản phẩm bán chạy nhất thành công',
            data: result,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const OrderCountByStatus = async (req, res, next) => {
    try {
        const result = await boardService.OrderCountByStatus()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy tổng đơn hàng theo trạng thái thành công',
            data: result,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
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
        return ErrorServer(error, req, res, next)
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
        return ErrorServer(error, req, res, next)
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
        return ErrorServer(error, req, res, next)
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
        return ErrorServer(error, req, res, next)
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
    RevenueByShipmentMethod
}
