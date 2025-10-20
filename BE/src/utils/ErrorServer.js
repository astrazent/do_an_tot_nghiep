import ApiError from './ApiError.js'

// Hàm xử lý logic lỗi chung
function handleError(err, req, res) {
    console.error('🔥 ErrorHandler:', err)

    const statusCode = err.statusCode || 500
    const message = err.message || 'Lỗi server nội bộ'

    res.status(statusCode).json({
        status: statusCode,
        message,
    })
}

// Middleware Express để xử lý lỗi
export default function ErrorServer(err, req, res, next) {
    if (err instanceof ApiError || err.isOperational) {
        return handleError(err, req, res)
    }

    return res.status(500).json({
        status: '500',
        message: 'Lỗi server không xác định',
    })
}
