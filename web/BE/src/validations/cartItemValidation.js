import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CREATE_CART_ITEM_SCHEMA = Joi.object({
    qty_total: Joi.number().integer().default(1),
    price_total: Joi.number().precision(2).min(0).default(0),
    user_id: Joi.number().integer().allow(null),
    product_id: Joi.number().integer().allow(null),
})

const UPDATE_CART_ITEM_SCHEMA = Joi.object({
    qty_total: Joi.number().integer().min(1),
    price_total: Joi.number().precision(2).min(0),
})

function validateCreateCartItem(req, res, next) {
    const { error, value } = CREATE_CART_ITEM_SCHEMA.validate(req.body, {
        stripUnknown: true,
    })

    if (error) {
        console.warn(
            'Validation warning:',
            error.details.map(d => d.message)
        )
    }

    req.validated = value
    return next()
}

function validateUpdateCartItem(req, res, next) {
    const { error, value } = UPDATE_CART_ITEM_SCHEMA.validate(req.body, {
        stripUnknown: true,
    })

    if (error) {
        console.warn(
            'Validation warning:',
            error.details.map(d => d.message)
        )
    }

    req.validated = value
    return next()
}

export const cartItemValidation = {
    validateCreateCartItem,
    validateUpdateCartItem,
}
