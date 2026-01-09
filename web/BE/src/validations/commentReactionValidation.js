import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_COMMENT_REACTION_SCHEMA = Joi.object({
    user_id: Joi.number().integer().required().messages({
        'number.base': 'User ID phải là số',
        'any.required': 'User ID là bắt buộc',
    }),
    product_id: Joi.number().integer().required().messages({
        'number.base': 'Product ID phải là số',
        'any.required': 'Product ID là bắt buộc',
    }),
    comment_id: Joi.number().integer().required().messages({
        'number.base': 'Comment ID phải là số',
        'any.required': 'Comment ID là bắt buộc',
    }),
    reaction: Joi.string().valid('like', 'dislike').required().messages({
        'any.only': 'Reaction chỉ được là like hoặc dislike',
        'any.required': 'Reaction là bắt buộc',
    }),
})

const UPDATE_COMMENT_REACTION_SCHEMA = Joi.object({
    user_id: Joi.number().integer().optional().messages({
        'number.base': 'User ID phải là số',
    }),
    product_id: Joi.number().integer().optional().messages({
        'number.base': 'Product ID phải là số',
    }),
    comment_id: Joi.number().integer().optional().messages({
        'number.base': 'Comment ID phải là số',
    }),
    reaction: Joi.string().valid('like', 'dislike').optional().messages({
        'any.only': 'Reaction chỉ được là like hoặc dislike',
    }),
})

function validateCreateCommentReaction(req, res, next) {
    const { error, value } = CREATE_COMMENT_REACTION_SCHEMA.validate(req.body, {
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

function validateUpdateCommentReaction(req, res, next) {
    const { error, value } = UPDATE_COMMENT_REACTION_SCHEMA.validate(req.body, {
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

export const commentReactionValidation = {
    validateCreateCommentReaction,
    validateUpdateCommentReaction,
}
