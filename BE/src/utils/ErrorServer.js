/* Hàm để trả về lỗi server nếu lỗi không nằm trong file server */
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const ErrorServer = (err, next) => {
    if (err instanceof ApiError || err.isOperational) return ErrorService(err,next)
    return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi server'))
}

export default ErrorServer
