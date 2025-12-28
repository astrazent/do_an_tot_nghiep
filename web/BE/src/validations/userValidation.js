import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const REGISTER_SCHEMA = Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Username không được để trống',
        'string.min': 'Username tối thiểu 3 ký tự',
        'string.max': 'Username tối đa 50 ký tự',
    }),
    password: Joi.string().min(6).max(255).required().messages({
        'string.empty': 'Password không được để trống',
        'string.min': 'Password tối thiểu 6 ký tự',
        'string.max': 'Password tối đa 255 ký tự',
    }),
    email: Joi.string().email().max(100).required().messages({
        'string.empty': 'Email không được để trống',
        'string.email': 'Email không hợp lệ',
        'string.max': 'Email tối đa 100 ký tự',
    }),
    phone: Joi.string().max(20).required().messages({
        'string.empty': 'Phone không được để trống',
        'string.max': 'Phone tối đa 20 ký tự',
    }),
    full_name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Full name không được để trống',
        'string.min': 'Full name tối thiểu 3 ký tự',
        'string.max': 'Full name tối đa 100 ký tự',
    }),
})

const LOGIN_SCHEMA = Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Username không được để trống',
        'string.min': 'Username tối thiểu 3 ký tự',
        'string.max': 'Username tối đa 50 ký tự',
    }),
    password: Joi.string().min(6).max(255).required().messages({
        'string.empty': 'Password không được để trống',
        'string.min': 'Password tối thiểu 6 ký tự',
        'string.max': 'Password tối đa 255 ký tự',
    }),
})

function validateRegister(req, res, next) {
    const { error, value } = REGISTER_SCHEMA.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    })

    if (error) {
        const message = error.details
            .map(detail => detail.message)
            .join(', ')

        return next(
            new ApiError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                message
            )
        )
    }

    req.validated = value
    return next()
}

function validateLogin(req, res, next) {
    const { error, value } = LOGIN_SCHEMA.validate(req.body, {
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

export const userValidation = { validateRegister, validateLogin }
