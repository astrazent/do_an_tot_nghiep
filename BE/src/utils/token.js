import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
import { StatusCodes } from 'http-status-codes'
import ApiError from './ApiError'

export const generateAccessToken = user => {
    try {
        if (!env.JWT_SECRET) {
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Missing JWT_SECRET in environment'
            )
        }
        return jwt.sign(user, env.JWT_SECRET, { expiresIn: env.ACCESS_EXPIRES })
    } catch (err) {
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Failed to generate access token'
        )
    }
}

export const generateRefreshToken = user => {
    return jwt.sign(user, env.JWT_REFRESH_SECRET, {
        expiresIn: env.REFRESH_EXPIRES,
    })
}

export const verifyAccessToken = token => {
    return jwt.verify(token, env.JWT_SECRET)
}

export const verifyRefreshToken = token => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET)
}
