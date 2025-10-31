import { discountProductService } from "~/services/discountProductService"
import { StatusCodes } from 'http-status-codes'
import ErrorServer from '~/utils/ErrorServer'

const addDiscountProduct = async (req, res, next) => {
    try {
        const data = await discountProductService.addDiscountProductService(req.body)
        return res.status(StatusCodes.OK).json({
            message: "Liên kết mã giảm giá với sản phẩm thành công",
            data
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getDiscountProductById = async (req, res, next) => {
    try {
        const data = await discountProductService.getDiscountProductByIdService(req.query.discountProductId)
        return res.status(StatusCodes.OK).json({
            message: "Lấy liên kết thành công",
            data
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getListDiscountProduct = async (req, res, next) => {
    try {
        const data = await discountProductService.getListDiscountProductService(req.body)
        return res.status(StatusCodes.OK).json({
            message: "Lấy danh sách liên kết thành công",
            data
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const updateDiscountProduct = async (req, res, next) => {
    try {
        const data = await discountProductService.updateDiscountProductService(req.query.discountProductId,req.body)
        return res.status(StatusCodes.OK).json({
            message: "Cập nhật liên kết thành công",
            data
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const deleteDiscountProduct = async (req, res, next) => {
    try {
        const data = await discountProductService.deleteDiscountProductService(req.query.discountProductId)
        return res.status(StatusCodes.OK).json({
            data
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getProductsByDiscount = async (req, res, next) => {
    try {
        const data = await discountProductService.getProductsByDiscountService(req.query.discount_id)
        return res.status(StatusCodes.OK).json({
            message: "Lấy tất cả products của một discount thành công",
            data
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getDiscountsByProduct = async (req, res, next) => {
    try {
        const data = await discountProductService.getDiscountsByProductService(req.query.product_id)
        return res.status(StatusCodes.OK).json({
            message: "Lấy tất cả discounts của một product thành công",
            data
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

export const discountProductController = {
    addDiscountProduct,
    getDiscountProductById,
    getListDiscountProduct,
    getProductsByDiscount,
    getDiscountsByProduct,
    updateDiscountProduct,
    deleteDiscountProduct
}