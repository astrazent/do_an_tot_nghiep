import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_CATEGORY_SCHEMA = Joi.object({
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
    parent_id: Joi.number().integer().allow(null).messages({
        'number.base': 'Parent ID phải là số hoặc null',
    }),
})

const UPDATE_CATEGORY_SCHEMA = CREATE_CATEGORY_SCHEMA.fork(
    ['name', 'slug', 'description', 'parent_id'],
    field => field.optional()
)

function validateCreateCategory(req, res, next) {
    const { error, value } = CREATE_CATEGORY_SCHEMA.validate(req.body, {
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

function validateUpdateCategory(req, res, next) {
    const { error, value } = UPDATE_CATEGORY_SCHEMA.validate(req.body, {
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

export const categoryValidation = {
    validateCreateCategory,
    validateUpdateCategory,
}
