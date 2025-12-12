import { discountService } from '~/services/discountService'
import { StatusCodes } from 'http-status-codes'

const addDiscount = async (req, res, next) => {
    try {
        const data = await discountService.addDiscountService(req.validated)
        return res.status(StatusCodes.OK).json({
            message: 'Tạo mã giảm giá thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getDiscountById = async (req, res, next) => {
    try {
        const data = await discountService.getDiscountByIdService(
            req.query.discountId
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy mã giảm giá thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getAllDiscount = async (req, res, next) => {
    try {
        const data = await discountService.getAllDiscountService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách mã giảm giá thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getActiveDiscount = async (req, res, next) => {
    try {
        const data = await discountService.getActiveDiscountService()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách mã giảm giá đang còn hoạt động thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const updateDiscount = async (req, res, next) => {
    try {
        const data = await discountService.updateDiscountService(
            req.query.discountId,
            req.body
        )
        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật mã giảm giá thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deleteDiscount = async (req, res, next) => {
    try {
        const data = await discountService.deleteDiscountService(
            req.query.discountId
        )
        return res.status(StatusCodes.OK).json({
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const discountController = {
    addDiscount,
    getActiveDiscount,
    getAllDiscount,
    getDiscountById,
    updateDiscount,
    deleteDiscount,
}
