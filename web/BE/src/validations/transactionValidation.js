import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const TRANSACTIONS_SCHEMA = Joi.object({
    status: Joi.string()
        .valid('pending', 'confirmed', 'canceled', 'refunded', 'completed')
        .required()
        .messages({
            'string.base': 'Status phải là chuỗi',
            'any.only':
                'Status chỉ được là pending, confirmed, canceled, refunded, completed',
            'any.required': 'Status là bắt buộc',
        }),

    deli_name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Tên người nhận không được để trống',
        'string.min': 'Tên người nhận tối thiểu 3 ký tự',
        'string.max': 'Tên người nhận tối đa 100 ký tự',
    }),

    deli_phone: Joi.string().min(5).max(20).required().messages({
        'string.empty': 'Số điện thoại không được để trống',
        'string.min': 'Số điện thoại tối thiểu 5 ký tự',
        'string.max': 'Số điện thoại tối đa 20 ký tự',
    }),

    deli_address: Joi.string().min(5).max(255).required().messages({
        'string.empty': 'Địa chỉ không được để trống',
        'string.min': 'Địa chỉ tối thiểu 5 ký tự',
        'string.max': 'Địa chỉ tối đa 255 ký tự',
    }),

    deli_email: Joi.string().trim().email().allow(null, ''),

    deli_city: Joi.string().min(2).max(100).required(),
    deli_district: Joi.string().min(2).max(100).required(),
    deli_ward: Joi.string().min(2).max(100).required(),

    message: Joi.string().max(255).allow('', null),

    tracking_number: Joi.string().max(100).allow('', null),

    shipping_fee: Joi.number().precision(2).min(0).required(),

    shipment_status: Joi.string()
        .valid('pending', 'shipped', 'in_transit', 'delivered', 'returned')
        .required(),

    amount: Joi.number().precision(2).min(0).required(),

    shipped_at: Joi.date().allow(null),
    delivered_at: Joi.date().allow(null),

    user_id: Joi.number().integer().allow(null),
    payment_id: Joi.number().integer().allow(null),
    shipment_id: Joi.number().integer().allow(null),
    items: Joi.array()
        .items(
            Joi.object({
                product_id: Joi.number().integer().required(),
                qty_total: Joi.number().integer().min(1).required(),
                amount_total: Joi.number().precision(2).min(0).required(),
            })
        )
        .optional()
        .messages({
            'array.base': 'Items phải là một mảng nếu có',
        }),
})

function validateTransaction(req, res, next) {
    const { error, value } = TRANSACTIONS_SCHEMA.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    })

    if (error) {
        return next(
            new ApiError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                'Định dạng không hợp lệ'
            )
        )
    }

    req.validated = value
    return next()
}

export const transactionValidation = { validateTransaction }
