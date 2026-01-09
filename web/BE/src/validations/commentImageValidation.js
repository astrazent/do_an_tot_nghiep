import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_COMMENT_IMAGE_SCHEMA = Joi.object({
    comment_id: Joi.number().integer().required().messages({
        'number.base': 'Comment ID phải là số',
        'any.required': 'Comment ID là bắt buộc',
    }),
    image_url: Joi.string().max(255).required().messages({
        'string.empty': 'Image URL không được để trống',
        'string.max': 'Image URL tối đa 255 ký tự',
    }),
})

const UPDATE_COMMENT_IMAGE_SCHEMA = Joi.object({
    comment_id: Joi.number().integer().optional().messages({
        'number.base': 'Comment ID phải là số',
    }),
    image_url: Joi.string().max(255).optional().messages({
        'string.empty': 'Image URL không được để trống',
        'string.max': 'Image URL tối đa 255 ký tự',
    }),
})

function validateCreateCommentImage(req, res, next) {
    const { error, value } = CREATE_COMMENT_IMAGE_SCHEMA.validate(req.body, {
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

function validateUpdateCommentImage(req, res, next) {
    const { error, value } = UPDATE_COMMENT_IMAGE_SCHEMA.validate(req.body, {
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

export const commentImageValidation = {
    validateCreateCommentImage,
    validateUpdateCommentImage,
}
