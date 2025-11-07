import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { logger } from '~/utils/logger'

export const errorHandlingMiddleware = (err, req, res, next) => {
    if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

    const responseError = {
        statusCode: err.statusCode,
        message: err.message || StatusCodes[err.statusCode],
        stack: err.stack
    }

    // 🔥 Log chi tiết lỗi (luôn log, dù ở môi trường nào)
    logger.error(`${err.message}\n${err.stack}`)
    if (env.BUILD_MODE === 'production') {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi server không xác định'
        })
    }
    return res.status(responseError.statusCode).json(responseError)
}
