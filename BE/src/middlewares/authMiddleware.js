import jwt from 'jsonwebtoken'
import { env } from '~/config/environment.js'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'

export function verifyToken(req, res, next) {
    const token = req.cookies?.token
    if (!token) {
        return next(
            new ApiError(
                StatusCodes.UNAUTHORIZED,
                'Người dùng chưa xác thực. Vui lòng đăng nhập lại.'
            )
        )
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        // 🧩 Phân loại lỗi rõ ràng
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

        // ⚙️ Các lỗi khác không xác định
        next(
            new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Lỗi khi xác thực token.'
            )
        )
    }
}
