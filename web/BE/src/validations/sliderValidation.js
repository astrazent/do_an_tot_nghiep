import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_SLIDER_SCHEMA = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Tên slider không được để trống',
        'string.min': 'Tên slider tối thiểu 3 ký tự',
        'string.max': 'Tên slider tối đa 100 ký tự',
    }),
    description: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Description tối đa 255 ký tự',
    }),
    image_url: Joi.string().max(255).required().messages({
        'string.empty': 'Image URL không được để trống',
        'string.max': 'Image URL tối đa 255 ký tự',
    }),
    link_url: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Link URL tối đa 255 ký tự',
    }),
    sort_order: Joi.number().integer().default(0),
    status: Joi.number().integer().valid(0, 1).default(1),
    start_date: Joi.date().allow(null),
    end_date: Joi.date().allow(null),
})

const UPDATE_SLIDER_SCHEMA = CREATE_SLIDER_SCHEMA.fork(
    Object.keys(CREATE_SLIDER_SCHEMA.describe().keys),
    field => field.optional()
)

function validateCreateSlider(req, res, next) {
    const { error, value } = CREATE_SLIDER_SCHEMA.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    })

    if (error) {
        return next(
            new ApiError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                'Dữ liệu slider không hợp lệ'
            )
        )
    }

    req.validated = value
    return next()
}

function validateUpdateSlider(req, res, next) {
    const { error, value } = UPDATE_SLIDER_SCHEMA.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    })

    if (error) {
        return next(
            new ApiError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                'Dữ liệu cập nhật slider không hợp lệ'
            )
        )
    }

    req.validated = value
    return next()
}

export const sliderValidation = {
    validateCreateSlider,
    validateUpdateSlider,
}
