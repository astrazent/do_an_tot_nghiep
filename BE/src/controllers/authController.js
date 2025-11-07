import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'
import ErrorServer from '~/utils/ErrorServer'
import { tokenService } from '~/services/tokenService'
import { userService } from '../services/userService.js'
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '~/utils/token.js'

const register = async (req, res, next) => {
    try {
        const data = await userService.registerService(req.validated)
        return res.status(StatusCodes.CREATED).json({
            message: 'Đăng ký thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}
export const convertIP = rawIp => {
    if (!rawIp) return null

    // Xử lý IPv6 dạng ::ffff:127.0.0.1 → 127.0.0.1
    const ipv4Match = rawIp.match(/::ffff:(\d+\.\d+\.\d+\.\d+)/)
    if (ipv4Match) return ipv4Match[1]

    // Chuyển IPv6 loopback ::1 → 127.0.0.1
    if (rawIp === '::1') return '127.0.0.1'

    // Nếu có port như 127.0.0.1:12345 → cắt bỏ phần port
    if (rawIp.includes(':') && rawIp.split(':').length === 2) {
        return rawIp.split(':')[0]
    }

    return rawIp
}
const login = async (req, res, next) => {
    try {
        const data = await userService.loginService(req.validated)
        const userPayload = {
            user_id: data.id,
            username: data.username,
            email: data.email,
            phone: data.phone,
            full_name: data.full_name,
            gender: data.gender,
            address: data.address,
            city: data.city,
            district: data.district,
            ward: data.ward,
            avatar_url: data.avatar_url,
            status: data.status,
            created_at: data.created_at,
            updated_at: data.updated_at,
        }
        const accessToken = generateAccessToken(userPayload)
        const refreshToken = generateRefreshToken(userPayload)
        const refreshTokenExpires = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        )
        const tokenData = {
            user_id: data.id,
            refresh_token: refreshToken,
            device_info: req.headers['user-agent'] || 'Unknown Device', // Lấy thông tin trình duyệt/thiết bị
            ip_address: convertIP(req.ip), // Lấy địa chỉ IP từ request
            token_started_at: new Date(),
            token_expired_at: refreshTokenExpires,
            revoked_at: null,
        }
        await tokenService.createTokenService(tokenData)
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: env.BUILD_MODE === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 2 * 60 * 1000, // 2 phút
        })
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: env.BUILD_MODE === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        })

        return res.status(StatusCodes.OK).json({
            message: 'Đăng nhập thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

export const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refresh_token

        // Xóa cookie ở mọi trường hợp
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: env.BUILD_MODE === 'production',
            sameSite: env.BUILD_MODE === 'production' ? 'none' : 'lax',
            path: '/',
        })
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: env.BUILD_MODE === 'production',
            sameSite: env.BUILD_MODE === 'production' ? 'none' : 'lax',
            path: '/',
        })

        // Nếu có refresh token thì tiến hành thu hồi trong DB
        if (refreshToken) {
            await tokenService.revokeTokenService(refreshToken)
            return res
                .status(StatusCodes.OK)
                .json({ message: 'Đăng xuất thành công.' })
        }

        // Nếu không có token thì chỉ coi như đã đăng xuất
        return res
            .status(StatusCodes.OK)
            .json({ message: 'Người dùng đã đăng xuất.' })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

/**
 * Làm mới access token bằng refresh token
 */
export const refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies?.refresh_token
        if (!token) {
            return next(
                new ApiError(
                    StatusCodes.UNAUTHORIZED,
                    'Không có refresh token.'
                )
            )
        }

        // 1️⃣ Giải mã refresh token
        const decoded = verifyRefreshToken(token)

        // 2️⃣ Kiểm tra token trong DB
        const storedToken = await tokenService.getByTokenService(token)
        if (!storedToken) {
            return next(
                new ApiError(
                    StatusCodes.FORBIDDEN,
                    'Refresh token không tồn tại trong hệ thống.'
                )
            )
        }

        // 3️⃣ Check token bị thu hồi
        if (storedToken.is_revoked) {
            return next(
                new ApiError(
                    StatusCodes.FORBIDDEN,
                    'Refresh token đã bị thu hồi.'
                )
            )
        }

        // 4️⃣ Check token hết hạn
        if (new Date(storedToken.token_expired_at) < new Date()) {
            return next(
                new ApiError(StatusCodes.FORBIDDEN, 'Refresh token đã hết hạn.')
            )
        }
        // 6️⃣ Kiểm tra user ID trong token
        if (storedToken.user_id !== decoded.userId) {
            return next(
                new ApiError(
                    StatusCodes.FORBIDDEN,
                    'Refresh token không hợp lệ.'
                )
            )
        }

        // 7️⃣ Tạo payload cấp lại access token mới
        const userPayload = {
            user_id: decoded.user_id,
            username: decoded.username,
            email: decoded.email,
            phone: decoded.phone,
            full_name: decoded.full_name,
            gender: decoded.gender,
            address: decoded.address,
            city: decoded.city,
            district: decoded.district,
            ward: decoded.ward,
            avatar_url: decoded.avatar_url,
            status: decoded.status,
            created_at: decoded.created_at,
            updated_at: decoded.updated_at,
        }

        // 8️⃣ Cấp lại access token mới
        const newAccessToken = generateAccessToken(userPayload)

        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: env.BUILD_MODE === 'production',
            sameSite: env.BUILD_MODE === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 2 * 60 * 1000, // 2 phút
        })

        return res.status(StatusCodes.OK).json({
            message: 'Làm mới token thành công',
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

/**
 * Xác thực access token và trả về thông tin user
 */
export const validateToken = (req, res, next) => {
    try {
        const userPayload = {
            user_id: req.user.user_id,
            username: req.user.username,
            email: req.user.email,
            phone: req.user.phone,
            full_name: req.user.full_name,
            gender: req.user.gender,
            address: req.user.address,
            city: req.user.city,
            district: req.user.district,
            ward: req.user.ward,
            avatar_url: req.user.avatar_url,
            status: req.user.status,
            created_at: req.user.created_at,
            updated_at: req.user.updated_at,
        }
        console.log(userPayload)
        res.status(StatusCodes.OK).json(userPayload)
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

export const authController = {
    validateToken,
    refreshToken,
    register,
    login,
    logout,
}
