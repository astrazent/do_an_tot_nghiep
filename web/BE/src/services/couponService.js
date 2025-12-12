import { CouponsModel } from '~/models/couponModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createCouponService = async data => {
    const coupon = await CouponsModel.createCoupon(data)
    return coupon
}

const getCouponByIdService = async couponId => {
    const coupon = await CouponsModel.getCouponById(couponId)
    if (!coupon) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy coupon này')
    }
    return coupon
}

const getCouponByCodeService = async couponCode => {
    const coupon = await CouponsModel.getCouponByCode(couponCode)
    if (!coupon) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy coupon này')
    }
    return coupon
}

const getListCouponsService = async data => {
    const listCoupons = await CouponsModel.listCoupons(data.limit, data.offset)
    return listCoupons
}

const getCouponsByTypeService = async type => {
    const couponsByType = await CouponsModel.getCouponsByType(type)
    if (couponsByType.length === 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy coupon nào ứng với loại này'
        )
    }
    return couponsByType
}

const updateCouponService = async (couponId, data) => {
    const coupon = await CouponsModel.getCouponById(couponId)
    if (!coupon) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy coupon này')
    }

    const result = await CouponsModel.updateCoupon(couponId, data)
    return result
}

const deleteCouponService = async couponId => {
    const coupon = await CouponsModel.getCouponById(couponId)
    if (!coupon) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy coupon này')
    }

    await CouponsModel.deleteCoupon(couponId)
    return { message: 'Xóa coupon thành công' }
}

export const couponService = {
    createCouponService,
    getCouponByIdService,
    getCouponByCodeService,
    getListCouponsService,
    getCouponsByTypeService,
    updateCouponService,
    deleteCouponService,
}
