import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_COMMENT_SCHEMA = Joi.object({
    rate: Joi.number().integer().min(1).max(5).required().messages({
        'number.base': 'Rate phải là số',
        'number.min': 'Rate tối thiểu 1',
        'number.max': 'Rate tối đa 5',
        'any.required': 'Rate là bắt buộc',
    }),
    content: Joi.string().min(1).required().messages({
        'string.empty': 'Content không được để trống',
        'any.required': 'Content là bắt buộc',
    }),
    product_id: Joi.number().integer().required().messages({
        'number.base': 'Product ID phải là số',
        'any.required': 'Product ID là bắt buộc',
    }),
    user_id: Joi.number().integer().required().messages({
        'number.base': 'User ID phải là số',
        'any.required': 'User ID là bắt buộc',
    }),
    likes: Joi.number().integer().min(0).default(0).messages({
        'number.base': 'Likes phải là số',
        'number.min': 'Likes không thể âm',
    }),
    dislikes: Joi.number().integer().min(0).default(0).messages({
        'number.base': 'Dislikes phải là số',
        'number.min': 'Dislikes không thể âm',
    }),
    images: Joi.array()
        .items(
            Joi.string().uri().messages({
                'string.uri': 'Mỗi phần tử trong images phải là URL hợp lệ',
                'string.base': 'Mỗi phần tử trong images phải là chuỗi',
            })
        )
        .default([]),
})

const UPDATE_COMMENT_SCHEMA = CREATE_COMMENT_SCHEMA.fork(
    Object.keys(CREATE_COMMENT_SCHEMA.describe().keys),
    field => field.optional()
).keys({
    newImages: Joi.array()
        .items(
            Joi.string().uri().messages({
                'string.uri': 'Mỗi phần tử trong newImages phải là URL hợp lệ',
                'string.base': 'Mỗi phần tử trong newImages phải là chuỗi',
            })
        )
        .default([]),
    keep_image_ids: Joi.array()
        .items(
            Joi.number().integer().messages({
                'number.base': 'Mỗi phần tử trong keep_image_ids phải là số',
            })
        )
        .default([]),
})

function validateCreateComment(req, res, next) {
    const { error, value } = CREATE_COMMENT_SCHEMA.validate(req.body, {
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

function validateUpdateComment(req, res, next) {
    const { error, value } = UPDATE_COMMENT_SCHEMA.validate(req.body, {
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

export const commentValidation = {
    validateCreateComment,
    validateUpdateComment,
}
