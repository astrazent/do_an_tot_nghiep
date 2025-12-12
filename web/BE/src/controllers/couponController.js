import { couponService } from '~/services/couponService'
import { StatusCodes } from 'http-status-codes'

const createCoupon = async (req, res, next) => {
    try {
        const data = await couponService.createCouponService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Tạo coupon thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getCouponById = async (req, res, next) => {
    try {
        const data = await couponService.getCouponByIdService(
            req.query.couponId
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy coupon thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getCouponByCode = async (req, res, next) => {
    try {
        const data = await couponService.getCouponByCodeService(
            req.query.couponCode
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy coupon thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getListCoupons = async (req, res, next) => {
    try {
        const data = await couponService.getListCouponsService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách coupon thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getCouponsByType = async (req, res, next) => {
    try {
        const data = await couponService.getCouponsByTypeService(req.query.type)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách coupon theo loại thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const updateCoupon = async (req, res, next) => {
    try {
        const data = await couponService.updateCouponService(
            req.query.couponId,
            req.body
        )
        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật coupon thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deleteCoupon = async (req, res, next) => {
    try {
        const data = await couponService.deleteCouponService(req.query.couponId)
        return res.status(StatusCodes.OK).json({
            message: 'Xóa coupon thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const couponController = {
    createCoupon,
    getCouponById,
    getCouponByCode,
    getListCoupons,
    getCouponsByType,
    updateCoupon,
    deleteCoupon,
}
