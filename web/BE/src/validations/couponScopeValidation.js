import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_COUPON_SCOPE_SCHEMA = Joi.object({
    coupon_id: Joi.number().integer().required().messages({
        'number.base': 'Coupon ID phải là số',
        'any.required': 'Coupon ID là bắt buộc',
    }),
    scope_type: Joi.number().integer().valid(0, 1, 2).required().messages({
        'any.only':
            'scope_type chỉ có thể là 0 (Toàn shop), 1 (Theo thể loại), 2 (Theo sản phẩm)',
        'any.required': 'scope_type là bắt buộc',
    }),
    product_id: Joi.number().integer().allow(null).messages({
        'number.base': 'Product ID phải là số',
    }),
})

const UPDATE_COUPON_SCOPE_SCHEMA = CREATE_COUPON_SCOPE_SCHEMA.fork(
    Object.keys(CREATE_COUPON_SCOPE_SCHEMA.describe().keys),
    f => f.optional()
)

function validateCreateCouponScope(req, res, next) {
    const { error, value } = CREATE_COUPON_SCOPE_SCHEMA.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    })

    if (error) {
        return next(
            new ApiError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                'Định dạng dữ liệu không hợp lệ'
            )
        )
    }

    req.validated = value
    return next()
}

function validateUpdateCouponScope(req, res, next) {
    const { error, value } = UPDATE_COUPON_SCOPE_SCHEMA.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    })

    if (error) {
        return next(
            new ApiError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                'Định dạng dữ liệu không hợp lệ'
            )
        )
    }

    req.validated = value
    return next()
}

export const couponScopeValidation = {
    validateCreateCouponScope,
    validateUpdateCouponScope,
}
