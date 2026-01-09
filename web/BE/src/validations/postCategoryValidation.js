import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_POST_CATEGORY_SCHEMA = Joi.object({
    post_id: Joi.number().integer().required().messages({
        'number.base': 'Post ID phải là số',
        'any.required': 'Post ID là bắt buộc',
    }),
    category_id: Joi.number().integer().required().messages({
        'number.base': 'Category ID phải là số',
        'any.required': 'Category ID là bắt buộc',
    }),
})

const UPDATE_POST_CATEGORY_SCHEMA = CREATE_POST_CATEGORY_SCHEMA.fork(
    ['post_id', 'category_id'],
    field => field.optional()
)

function validateCreatePostCategory(req, res, next) {
    const { error, value } = CREATE_POST_CATEGORY_SCHEMA.validate(req.body, {
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

function validateUpdatePostCategory(req, res, next) {
    const { error, value } = UPDATE_POST_CATEGORY_SCHEMA.validate(req.body, {
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

export const postCategoryValidation = {
    validateCreatePostCategory,
    validateUpdatePostCategory,
}
