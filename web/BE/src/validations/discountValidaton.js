import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const DISCOUNTS_SCHEMA = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Name không được để trống',
        'string.min': 'Name tối thiểu 3 ký tự',
        'string.max': 'Name tối đa 100 ký tự',
    }),
    description: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Description tối đa 255 ký tự',
    }),
    value: Joi.number().precision(2).min(0).default(0).messages({
        'number.base': 'Value phải là số',
        'number.min': 'Value tối thiểu 0',
    }),
    min_price: Joi.number().precision(2).min(0).default(0).messages({
        'number.base': 'Min price phải là số',
        'number.min': 'Min price tối thiểu 0',
    }),
    start_date: Joi.date().default(() => new Date()),
    end_date: Joi.date().default(() => new Date()),
    status: Joi.number().integer().valid(0, 1).default(0).messages({
        'number.base': 'Status phải là số',
        'any.only': 'Status phải là 0 hoặc 1',
    }),
})

function validateDiscount(req, res, next) {
    const { error, value } = DISCOUNTS_SCHEMA.validate(req.body, {
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

export const discountValidation = { validateDiscount }
