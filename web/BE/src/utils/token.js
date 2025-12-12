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
        return jwt.sign(user, env.JWT_SECRET, {
            expiresIn: env.ACCESS_EXPIRES,
            algorithm: env.ALGORITHM,
        })
    } catch (err) {
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Failed to generate access token'
        )
    }
}

export const generateRefreshToken = user => {
    if (!env.JWT_REFRESH_SECRET) {
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Missing JWT_REFRESH_SECRET in environment'
        )
    }

    return jwt.sign(user, env.JWT_REFRESH_SECRET, {
        expiresIn: env.REFRESH_EXPIRES,
        algorithm: env.ALGORITHM,
    })
}

export const verifyAccessToken = token => {
    return jwt.verify(token, env.JWT_SECRET, {
        algorithms: [env.ALGORITHM],
    })
}

export const verifyRefreshToken = token => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET, {
        algorithms: [env.ALGORITHM],
    })
}
