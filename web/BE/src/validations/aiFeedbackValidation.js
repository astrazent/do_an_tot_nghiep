import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_FEEDBACK_SCHEMA = Joi.object({
    product_id: Joi.number().integer().required().messages({
        'number.base': 'Product ID phải là số',
        'any.required': 'Product ID là bắt buộc',
    }),
    voter_id: Joi.number().integer().allow(null).messages({
        'number.base': 'Voter ID phải là số',
    }),
    vote: Joi.number().integer().valid(0, 1).required().messages({
        'number.base': 'Vote phải là số',
        'any.required': 'Vote là bắt buộc',
        'any.only': 'Vote chỉ có thể là 0 (dislike) hoặc 1 (like)',
    }),
})

const UPDATE_FEEDBACK_SCHEMA = Joi.object({
    product_id: Joi.number().integer().optional().messages({
        'number.base': 'Product ID phải là số',
    }),
    voter_id: Joi.number().integer().allow(null).optional().messages({
        'number.base': 'Voter ID phải là số',
    }),
    vote: Joi.number().integer().valid(0, 1).optional().messages({
        'number.base': 'Vote phải là số',
        'any.only': 'Vote chỉ có thể là 0 (dislike) hoặc 1 (like)',
    }),
})

function validateCreateFeedback(req, res, next) {
    const { error, value } = CREATE_FEEDBACK_SCHEMA.validate(req.body, {
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

function validateUpdateFeedback(req, res, next) {
    const { error, value } = UPDATE_FEEDBACK_SCHEMA.validate(req.body, {
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

export const feedbackValidation = {
    validateCreateFeedback,
    validateUpdateFeedback,
}
