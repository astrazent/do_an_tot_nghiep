import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_ADMIN_SCHEMA = Joi.object({
    username: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Username không được để trống',
        'string.min': 'Username tối thiểu 3 ký tự',
        'string.max': 'Username tối đa 100 ký tự',
    }),
    email: Joi.string().email().max(100).required().messages({
        'string.empty': 'Email không được để trống',
        'string.email': 'Email không hợp lệ',
        'string.max': 'Email tối đa 100 ký tự',
    }),
    full_name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Full name không được để trống',
        'string.min': 'Full name tối thiểu 3 ký tự',
        'string.max': 'Full name tối đa 100 ký tự',
    }),
    password_hash: Joi.string().min(6).max(255).required().messages({
        'string.empty': 'Password không được để trống',
        'string.min': 'Password tối thiểu 6 ký tự',
        'string.max': 'Password tối đa 255 ký tự',
    }),
    level: Joi.number().integer().min(0).max(99).required().messages({
        'number.base': 'Level phải là số',
        'number.min': 'Level tối thiểu 0',
        'number.max': 'Level tối đa 99',
    }),
    description: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Description tối đa 255 ký tự',
    }),
    role_id: Joi.number().integer().required().messages({
        'number.base': 'Role ID phải là số',
        'any.required': 'Role ID là bắt buộc',
    }),
})

const LOGIN_ADMIN_SCHEMA = Joi.object({
    username: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Username không được để trống',
        'string.min': 'Username tối thiểu 3 ký tự',
        'string.max': 'Username tối đa 100 ký tự',
    }),
    password_hash: Joi.string().min(6).max(255).required().messages({
        'string.empty': 'Password không được để trống',
        'string.min': 'Password tối thiểu 6 ký tự',
        'string.max': 'Password tối đa 255 ký tự',
    }),
})

function validateCreateAdmin(req, res, next) {
    const { error, value } = CREATE_ADMIN_SCHEMA.validate(req.body, {
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

function validateLoginAdmin(req, res, next) {
    const { error, value } = LOGIN_ADMIN_SCHEMA.validate(req.body, {
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

export const adminValidation = {
    validateCreateAdmin,
    validateLoginAdmin,
}
