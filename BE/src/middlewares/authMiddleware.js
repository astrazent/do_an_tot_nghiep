import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { verifyAccessToken } from '~/utils/token.js'

export function verifyToken(req, res, next) {
    const token = req.cookies?.access_token
    if (!token) {
        return next(
            new ApiError(StatusCodes.UNAUTHORIZED, 'Không có access token.')
        )
    }

    try {
        const decoded = verifyAccessToken(token)
        req.user = decoded
        next()
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return next(
                new ApiError(
                    StatusCodes.UNAUTHORIZED,
                    'Token đã hết hạn. Vui lòng đăng nhập lại.'
                )
            )
        }

        if (err.name === 'JsonWebTokenError') {
            return next(
                new ApiError(
                    StatusCodes.FORBIDDEN,
                    'Token không hợp lệ. Vui lòng kiểm tra lại.'
                )
            )
        }

        next(
            new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Lỗi khi xác thực token.'
            )
        )
    }
}
