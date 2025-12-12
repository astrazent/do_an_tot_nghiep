import { couponScopeService } from '~/services/couponScopeService.js'
import { StatusCodes } from 'http-status-codes'

const createCouponScope = async (req, res, next) => {
    try {
        const data = await couponScopeService.createCouponScopeService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Tạo coupon scope thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getCouponScopeById = async (req, res, next) => {
    try {
        const data = await couponScopeService.getCouponScopeByIdService(
            req.query.id
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy coupon scope thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getListCouponScopes = async (req, res, next) => {
    try {
        const data = await couponScopeService.getListCouponScopesService(
            req.body
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách coupon scope thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getCouponScopesByCouponId = async (req, res, next) => {
    try {
        const data = await couponScopeService.getCouponScopesByCouponIdService(
            req.query.coupon_id
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách coupon scope theo coupon thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const updateCouponScope = async (req, res, next) => {
    try {
        const data = await couponScopeService.updateCouponScopeService(
            req.query.id,
            req.body
        )
        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật coupon scope thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deleteCouponScope = async (req, res, next) => {
    try {
        const data = await couponScopeService.deleteCouponScopeService(
            req.query.id
        )
        return res.status(StatusCodes.OK).json({
            message: 'Xóa coupon scope thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const couponScopeController = {
    createCouponScope,
    getCouponScopeById,
    getListCouponScopes,
    getCouponScopesByCouponId,
    updateCouponScope,
    deleteCouponScope,
}
