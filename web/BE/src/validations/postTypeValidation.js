import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_POST_TYPE_SCHEMA = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Name không được để trống',
        'string.min': 'Name tối thiểu 3 ký tự',
        'string.max': 'Name tối đa 100 ký tự',
    }),
    slug: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Slug tối đa 255 ký tự',
    }),
    description: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Description tối đa 255 ký tự',
    }),
})

const UPDATE_POST_TYPE_SCHEMA = CREATE_POST_TYPE_SCHEMA.fork(
    Object.keys(CREATE_POST_TYPE_SCHEMA.describe().keys),
    f => f.optional()
)

function validateCreatePostType(req, res, next) {
    const { error, value } = CREATE_POST_TYPE_SCHEMA.validate(req.body, {
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

function validateUpdatePostType(req, res, next) {
    const { error, value } = UPDATE_POST_TYPE_SCHEMA.validate(req.body, {
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

export const postTypeValidation = {
    validateCreatePostType,
    validateUpdatePostType,
}
