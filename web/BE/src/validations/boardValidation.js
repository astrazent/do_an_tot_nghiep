import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_BOARD_SCHEMA = Joi.object({
    title: Joi.string().min(3).max(255).required().messages({
        'string.empty': 'Title không được để trống',
        'string.min': 'Title tối thiểu 3 ký tự',
        'string.max': 'Title tối đa 255 ký tự',
    }),
    slug: Joi.string().max(255).required().messages({
        'string.empty': 'Slug không được để trống',
        'string.max': 'Slug tối đa 255 ký tự',
    }),
})

const UPDATE_BOARD_SCHEMA = Joi.object({
    title: Joi.string().min(3).max(255).optional().messages({
        'string.empty': 'Title không được để trống',
        'string.min': 'Title tối thiểu 3 ký tự',
        'string.max': 'Title tối đa 255 ký tự',
    }),
    slug: Joi.string().max(255).optional().messages({
        'string.empty': 'Slug không được để trống',
        'string.max': 'Slug tối đa 255 ký tự',
    }),
})

function validateCreateBoard(req, res, next) {
    const { error, value } = CREATE_BOARD_SCHEMA.validate(req.body, {
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

function validateUpdateBoard(req, res, next) {
    const { error, value } = UPDATE_BOARD_SCHEMA.validate(req.body, {
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

export const boardValidation = {
    validateCreateBoard,
    validateUpdateBoard,
}
