import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_PRODUCT_IMAGE_SCHEMA = Joi.object({
    is_main: Joi.number().integer().valid(0, 1).required().messages({
        'number.base': 'is_main phải là số',
        'any.only': 'is_main chỉ nhận 0 hoặc 1',
        'any.required': 'is_main là bắt buộc',
    }),
    image_url: Joi.string().max(255).required().messages({
        'string.empty': 'Image URL không được để trống',
        'string.max': 'Image URL tối đa 255 ký tự',
    }),
    product_id: Joi.number().integer().required().messages({
        'number.base': 'Product ID phải là số',
        'any.required': 'Product ID là bắt buộc',
    }),
    alt_text: Joi.string().max(100).allow(null, '').messages({
        'string.max': 'Alt text tối đa 100 ký tự',
    }),
})

const UPDATE_PRODUCT_IMAGE_SCHEMA = CREATE_PRODUCT_IMAGE_SCHEMA.fork(
    Object.keys(CREATE_PRODUCT_IMAGE_SCHEMA.describe().keys),
    field => field.optional()
)

function validateCreateProductImage(req, res, next) {
    const { error, value } = CREATE_PRODUCT_IMAGE_SCHEMA.validate(req.body, {
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

function validateUpdateProductImage(req, res, next) {
    const { error, value } = UPDATE_PRODUCT_IMAGE_SCHEMA.validate(req.body, {
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

export const productImageValidation = {
    validateCreateProductImage,
    validateUpdateProductImage,
}
