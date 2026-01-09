import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_COUPON_SCHEMA = Joi.object({
    code: Joi.string().max(50).required().messages({
        'string.empty': 'Code không được để trống',
        'string.max': 'Code tối đa 50 ký tự',
    }),
    description: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Description tối đa 255 ký tự',
    }),
    type: Joi.number().integer().valid(0, 1).required().messages({
        'number.base': 'Type phải là số',
        'any.required': 'Type là bắt buộc',
        'any.only':
            'Type chỉ có thể là 0 (giảm phí ship) hoặc 1 (giảm giá sản phẩm)',
    }),
    value: Joi.number().precision(2).min(0).required().messages({
        'number.base': 'Value phải là số',
        'number.min': 'Value tối thiểu 0',
        'any.required': 'Value là bắt buộc',
    }),
    measure: Joi.number().integer().valid(0, 1).required().messages({
        'any.only': 'Measure chỉ có thể là 0 (VND) hoặc 1 (%)',
        'any.required': 'Measure là bắt buộc',
    }),
    max_value: Joi.number().precision(2).min(0).allow(null).messages({
        'number.base': 'Max value phải là số',
        'number.min': 'Max value tối thiểu 0',
    }),
    expire_date: Joi.date().allow(null).messages({
        'date.base': 'Expire date không hợp lệ',
    }),
})

const UPDATE_COUPON_SCHEMA = CREATE_COUPON_SCHEMA.fork(
    Object.keys(CREATE_COUPON_SCHEMA.describe().keys),
    f => f.optional()
)

function validateCreateCoupon(req, res, next) {
    const { error, value } = CREATE_COUPON_SCHEMA.validate(req.body, {
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

function validateUpdateCoupon(req, res, next) {
    const { error, value } = UPDATE_COUPON_SCHEMA.validate(req.body, {
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

export const couponValidation = {
    validateCreateCoupon,
    validateUpdateCoupon,
}
