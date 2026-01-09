import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_POST_SCHEMA = Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
        'string.empty': 'Title không được để trống',
        'string.min': 'Title tối thiểu 3 ký tự',
        'string.max': 'Title tối đa 200 ký tự',
    }),
    slug: Joi.string().max(200).allow('', null).messages({
        'string.max': 'Slug tối đa 200 ký tự',
    }),
    content: Joi.string().required().messages({
        'string.empty': 'Content không được để trống',
    }),
    author_name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Author name không được để trống',
        'string.min': 'Author name tối thiểu 3 ký tự',
        'string.max': 'Author name tối đa 100 ký tự',
    }),
    description: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Description tối đa 255 ký tự',
    }),
    status: Joi.number().integer().valid(0, 1).default(1).messages({
        'number.base': 'Status phải là số',
        'any.only': 'Status phải là 0 hoặc 1',
    }),
    post_type_id: Joi.number().integer().required().messages({
        'number.base': 'Post Type ID phải là số',
        'any.required': 'Post Type ID là bắt buộc',
    }),
    published_at: Joi.date().allow(null),
    admin_id: Joi.number().integer().required().messages({
        'number.base': 'Admin ID phải là số',
        'any.required': 'Admin ID là bắt buộc',
    }),
})

const UPDATE_POST_SCHEMA = CREATE_POST_SCHEMA.fork(
    Object.keys(CREATE_POST_SCHEMA.describe().keys),
    field => field.optional()
)

function validateCreatePost(req, res, next) {
    const { error, value } = CREATE_POST_SCHEMA.validate(req.body, {
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

function validateUpdatePost(req, res, next) {
    const { error, value } = UPDATE_POST_SCHEMA.validate(req.body, {
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

export const postValidation = {
    validateCreatePost,
    validateUpdatePost,
}
