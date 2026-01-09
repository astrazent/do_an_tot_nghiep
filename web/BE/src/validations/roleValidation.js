import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_ROLE_SCHEMA = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Name không được để trống',
        'string.min': 'Name tối thiểu 3 ký tự',
        'string.max': 'Name tối đa 50 ký tự',
    }),
    description: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Description tối đa 255 ký tự',
    }),
})

const UPDATE_ROLE_SCHEMA = CREATE_ROLE_SCHEMA.fork(
    Object.keys(CREATE_ROLE_SCHEMA.describe().keys),
    field => field.optional()
)

function validateCreateRole(req, res, next) {
    const { error, value } = CREATE_ROLE_SCHEMA.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    })

    if (error) {
        return next(
            new ApiError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                'Dữ liệu role không hợp lệ'
            )
        )
    }

    req.validated = value
    return next()
}

function validateUpdateRole(req, res, next) {
    const { error, value } = UPDATE_ROLE_SCHEMA.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    })

    if (error) {
        return next(
            new ApiError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                'Dữ liệu cập nhật role không hợp lệ'
            )
        )
    }

    req.validated = value
    return next()
}

export const roleValidation = {
    validateCreateRole,
    validateUpdateRole,
}
