import { CouponScopesModel } from '~/models/couponScopeModel.js'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createCouponScopeService = async data => {
    const couponScope = await CouponScopesModel.createCouponScope(data)
    return couponScope
}

const getCouponScopeByIdService = async id => {
    const couponScope = await CouponScopesModel.getCouponScopeById(id)
    if (!couponScope) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy coupon scope này'
        )
    }
    return couponScope
}

const getListCouponScopesService = async data => {
    const limit = data?.limit || 50
    const offset = data?.offset || 0
    const list = await CouponScopesModel.listCouponScopes(limit, offset)
    return list
}

const getCouponScopesByCouponIdService = async coupon_id => {
    const scopes = await CouponScopesModel.getCouponScopesByCouponId(coupon_id)
    if (scopes.length === 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Coupon này chưa có scope nào'
        )
    }
    return scopes
}

const updateCouponScopeService = async (id, data) => {
    const couponScope = await CouponScopesModel.getCouponScopeById(id)
    if (!couponScope) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy coupon scope này'
        )
    }

    const result = await CouponScopesModel.updateCouponScope(id, data)
    return result
}

const deleteCouponScopeService = async id => {
    const couponScope = await CouponScopesModel.getCouponScopeById(id)
    if (!couponScope) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy coupon scope này'
        )
    }

    await CouponScopesModel.deleteCouponScope(id)
    return { message: 'Xóa coupon scope thành công' }
}

export const couponScopeService = {
    createCouponScopeService,
    getCouponScopeByIdService,
    getListCouponScopesService,
    getCouponScopesByCouponIdService,
    updateCouponScopeService,
    deleteCouponScopeService,
}
