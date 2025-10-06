import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const ORDER_ITEMS_SCHEMA = Joi.object({
    qty_total: Joi.number().integer().min(1).required().messages({
        'number.base': 'Số lượng phải là số',
        'number.min': 'Số lượng tối thiểu là 1',
        'any.required': 'Số lượng là bắt buộc',
    }),
    amount_total: Joi.number().precision(2).min(0).required().messages({
        'number.base': 'Amount total phải là số',
        'number.min': 'Amount total tối thiểu là 0',
        'any.required': 'Amount total là bắt buộc',
    }),
    transaction_id: Joi.number().integer().required().messages({
        'number.base': 'Transaction ID phải là số',
        'any.required': 'Transaction ID là bắt buộc',
    }),
    product_id: Joi.number().integer().required().messages({
        'number.base': 'Product ID phải là số',
        'any.required': 'Product ID là bắt buộc',
    }),
})

function validateOrderItem(req, res, next) {
    const { error, value } = ORDER_ITEMS_SCHEMA.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    })

    if (error) {
        console.log(error)
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

export const orderItemValidation = { validateOrderItem }
