import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const PAYMENTS_SCHEMA = Joi.object({
    method: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Method không được để trống',
        'string.min': 'Method tối thiểu 3 ký tự',
        'string.max': 'Method tối đa 50 ký tự',
    }),
    status: Joi.number().integer().valid(0, 1, 2).required().messages({
        'number.base': 'Status phải là số',
        'any.only': 'Status phải là 0, 1 hoặc 2',
        'any.required': 'Status là bắt buộc',
    }),
})

function validatePayment(req, res, next) {
    const { error, value } = PAYMENTS_SCHEMA.validate(req.body, {
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

export const paymentValidation = { validatePayment }
