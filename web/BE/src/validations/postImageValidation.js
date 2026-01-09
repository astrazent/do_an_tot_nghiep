import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_POST_IMAGE_SCHEMA = Joi.object({
    is_main: Joi.number().integer().valid(0, 1).required().messages({
        'number.base': 'is_main phải là số',
        'any.only': 'is_main chỉ nhận 0 hoặc 1',
        'any.required': 'is_main là bắt buộc',
    }),
    display_order: Joi.number().integer().optional().messages({
        'number.base': 'display_order phải là số',
    }),
    image_url: Joi.string().max(255).required().messages({
        'string.empty': 'Image URL không được để trống',
        'string.max': 'Image URL tối đa 255 ký tự',
    }),
    post_id: Joi.number().integer().required().messages({
        'number.base': 'Post ID phải là số',
        'any.required': 'Post ID là bắt buộc',
    }),
})

const UPDATE_POST_IMAGE_SCHEMA = CREATE_POST_IMAGE_SCHEMA.fork(
    Object.keys(CREATE_POST_IMAGE_SCHEMA.describe().keys),
    f => f.optional()
)

function validateCreatePostImage(req, res, next) {
    const { error, value } = CREATE_POST_IMAGE_SCHEMA.validate(req.body, {
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

function validateUpdatePostImage(req, res, next) {
    const { error, value } = UPDATE_POST_IMAGE_SCHEMA.validate(req.body, {
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

export const postImageValidation = {
    validateCreatePostImage,
    validateUpdatePostImage,
}
