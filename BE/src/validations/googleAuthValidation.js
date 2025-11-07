import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const GOOGLE_LOGIN_SCHEMA = Joi.object({
    tokenId: Joi.string().required().messages({
        'string.empty': 'Token Google không được để trống',
        'any.required': 'Token Google bắt buộc',
    }),
})

function validateGoogleLogin(req, res, next) {
    const { error, value } = GOOGLE_LOGIN_SCHEMA.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    })

    if (error) {
        return next(
            new ApiError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                'Token Google không hợp lệ'
            )
        )
    }

    req.validated = value
    return next()
}

export const googleAuthValidation = { validateGoogleLogin }
