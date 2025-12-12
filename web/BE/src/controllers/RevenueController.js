import { StatusCodes } from 'http-status-codes'
import { RevenueService } from '~/services/RevenueService'

const getRevenueAnalysisKPIs = async (req, res, next) => {
    try {
        const result = await RevenueService.getRevenueAnalysisKPIs(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy data thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const getYearRevenueAndOrders = async (req, res, next) => {
    try {
        const result = await RevenueService.getYearRevenueAndOrders(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy data thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const getNewVsReturningRevenue = async (req, res, next) => {
    try {
        const result = await RevenueService.getNewVsReturningRevenue(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy data thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const getRevenueByCategory = async (req, res, next) => {
    try {
        const result = await RevenueService.getRevenueByCategory(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy data thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const getProductRevenueList = async (req, res, next) => {
    try {
        const result = await RevenueService.getProductRevenueList(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy data thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const getRevenueByPaymentMethod = async (req, res, next) => {
    try {
        const result = await RevenueService.getRevenueByPaymentMethod(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy data thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const getRevenueByShipmentMethod = async (req, res, next) => {
    try {
        const result = await RevenueService.getRevenueByShipmentMethod(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy data thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

export const RevenueController = {
    getRevenueAnalysisKPIs,
    getYearRevenueAndOrders,
    getNewVsReturningRevenue,
    getRevenueByCategory,
    getProductRevenueList,
    getRevenueByPaymentMethod,
    getRevenueByShipmentMethod
}
