import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const TRANSACTIONS_SCHEMA = Joi.object({
    status: Joi.number().integer().min(0).max(5).required().messages({
        'number.base': 'Status phải là số',
        'number.min': 'Status tối thiểu 0',
        'number.max': 'Status tối đa 5',
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
    deli_city: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'Thành phố không được để trống',
        'string.min': 'Thành phố tối thiểu 2 ký tự',
        'string.max': 'Thành phố tối đa 100 ký tự',
    }),
    deli_district: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'Quận/Huyện không được để trống',
        'string.min': 'Quận/Huyện tối thiểu 2 ký tự',
        'string.max': 'Quận/Huyện tối đa 100 ký tự',
    }),
    deli_ward: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'Phường/Xã không được để trống',
        'string.min': 'Phường/Xã tối thiểu 2 ký tự',
        'string.max': 'Phường/Xã tối đa 100 ký tự',
    }),
    message: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Tin nhắn tối đa 255 ký tự',
    }),
    tracking_number: Joi.string().max(100).required().messages({
        'string.empty': 'Tracking number không được để trống',
        'string.max': 'Tracking number tối đa 100 ký tự',
    }),
    shipping_fee: Joi.number().precision(2).min(0).default(0).messages({
        'number.base': 'Shipping fee phải là số',
        'number.min': 'Shipping fee tối thiểu 0',
    }),
    shipment_status: Joi.string()
        .valid('pending', 'shipped', 'in_transit', 'delivered', 'returned')
        .default('pending')
        .messages({
            'any.only':
                'Shipment status chỉ được là pending, shipped, in_transit, delivered hoặc returned',
        }),
    amount: Joi.number().precision(2).min(0).default(0).messages({
        'number.base': 'Amount phải là số',
        'number.min': 'Amount tối thiểu 0',
    }),
    shipped_at: Joi.date().allow(null),
    delivered_at: Joi.date().allow(null),
    user_id: Joi.number().integer().required().messages({
        'number.base': 'User ID phải là số',
        'any.required': 'User ID là bắt buộc',
    }),
    payment_id: Joi.number().integer().required().messages({
        'number.base': 'Payment ID phải là số',
        'any.required': 'Payment ID là bắt buộc',
    }),
    shipment_id: Joi.number().integer().required().messages({
        'number.base': 'Shipment ID phải là số',
        'any.required': 'Shipment ID là bắt buộc',
    }),
})

function validateTransaction(req, res, next) {
    const { error, value } = TRANSACTIONS_SCHEMA.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    })

    if (error) {
        console.log(error)
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
