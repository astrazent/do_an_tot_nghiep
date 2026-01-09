import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_PRODUCT_SCHEMA = Joi.object({
    name: Joi.string().min(3).max(200).required().messages({
        'string.empty': 'Name không được để trống',
        'string.min': 'Name tối thiểu 3 ký tự',
        'string.max': 'Name tối đa 200 ký tự',
    }),
    slug: Joi.string().allow('', null),
    description: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Description tối đa 255 ký tự',
    }),
    origin_price: Joi.number().precision(2).min(0).default(0).messages({
        'number.base': 'Origin price phải là số',
        'number.min': 'Origin price tối thiểu 0',
    }),
    price: Joi.number().precision(2).min(0).default(0).messages({
        'number.base': 'Price phải là số',
        'number.min': 'Price tối thiểu 0',
    }),
    buyed: Joi.number().integer().min(0).default(0),
    rate_point_total: Joi.number().integer().min(0).default(0),
    rate_count: Joi.number().integer().min(0).default(0),
    stock_qty: Joi.number().integer().min(0).default(0),
    low_stock_threshold: Joi.number().integer().min(0).default(0),
    last_restock_at: Joi.date().default(() => new Date()),
    status: Joi.number().integer().valid(0, 1).default(1),
    ocop_rating: Joi.number().integer().default(0),
    category_id: Joi.number().integer().required().messages({
        'number.base': 'Category ID phải là số',
        'any.required': 'Category ID là bắt buộc',
    }),
})

const UPDATE_PRODUCT_SCHEMA = CREATE_PRODUCT_SCHEMA.fork(
    Object.keys(CREATE_PRODUCT_SCHEMA.describe().keys),
    field => field.optional()
)

function validateCreateProduct(req, res, next) {
    const { error, value } = CREATE_PRODUCT_SCHEMA.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    })

    if (error) {
        return next(
            new ApiError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                'Dữ liệu sản phẩm không hợp lệ'
            )
        )
    }

    req.validated = value
    return next()
}

function validateUpdateProduct(req, res, next) {
    const { error, value } = UPDATE_PRODUCT_SCHEMA.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    })

    if (error) {
        return next(
            new ApiError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                'Dữ liệu cập nhật sản phẩm không hợp lệ'
            )
        )
    }

    req.validated = value
    return next()
}

export const productValidation = {
    validateCreateProduct,
    validateUpdateProduct,
}
