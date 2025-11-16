import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const DISCOUNT_PRODUCTS_SCHEMA = Joi.object({
    discount_id: Joi.number().integer().required().messages({
        'number.base': 'Discount ID phải là số',
        'any.required': 'Discount ID là bắt buộc',
    }),
    product_id: Joi.number().integer().required().messages({
        'number.base': 'Product ID phải là số',
        'any.required': 'Product ID là bắt buộc',
    }),
})

function validateDiscountProduct(req, res, next) {
    const { error, value } = DISCOUNT_PRODUCTS_SCHEMA.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    })

    if (error) {
        return next(
            new ApiError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                'Định dạng không hợp lệ'
            )
        )
    }

    req.validated = value
    return next()
}

export const discountProductValidation = { validateDiscountProduct }
