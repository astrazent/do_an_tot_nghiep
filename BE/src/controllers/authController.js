import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'
import { tokenService } from '~/services/tokenService'
import { userService } from '../services/userService.js'
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '~/utils/token.js'
import { verifyGoogleToken } from '~/utils/providerAuth.js'

const register = async (req, res, next) => {
    try {
        const data = await userService.registerService(req.validated)
        return res.status(StatusCodes.CREATED).json({
            message: 'Đăng ký thành công',
            data,
        })
    } catch (error) {
        next(error)
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

/**
 * Hàm tạo Access Token, Refresh Token, lưu vào DB và set cookie
 * @param {object} res - Đối tượng response của Express
 * @param {object} req - Đối tượng request của Express
 * @param {object} user - Dữ liệu người dùng đã được xác thực (phải có id, username, email)
 * @param {string} successMessage - Tin nhắn trả về khi thành công
 */
const generateAndSetTokens = async (res, req, user, successMessage) => {
    // 1. Tạo payload cho token
    const userPayload = {
        user_id: user.id,
        username: user.username,
        email: user.email,
    }

    // 2. Tạo access và refresh token
    const accessToken = generateAccessToken(userPayload)
    const refreshToken = generateRefreshToken(userPayload)
    const refreshTokenExpires = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 ngày
    )

    // 3. Chuẩn bị dữ liệu để lưu vào DB
    const tokenData = {
        user_id: user.id,
        refresh_token: refreshToken,
        device_info: req.headers['user-agent'] || 'Unknown Device',
        ip_address: convertIP(req.ip), // Giữ lại hàm convertIP của bạn
        token_started_at: new Date(),
        token_expired_at: refreshTokenExpires,
        revoked_at: null,
    }
    await tokenService.createTokenService(tokenData)

    // 4. Set cookie cho client
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: env.BUILD_MODE === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 1 * 60 * 1000, // 2 phút
    })
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: env.BUILD_MODE === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    })

    // 5. Trả về response thành công
    return res.status(StatusCodes.OK).json({
        message: successMessage,
        data: user,
    })
}

const login = async (req, res, next) => {
    try {
        // Chỉ xác thực người dùng
        const user = await userService.loginService(req.validated)

        // Gọi hàm dùng chung để xử lý token và trả về response
        await generateAndSetTokens(res, req, user, 'Đăng nhập thành công')
    } catch (error) {
        next(error)
    }
}

export const loginGoogle = async (req, res, next) => {
    try {
        const { tokenId } = req.body
        if (!tokenId) {
            return next(
                new ApiError(StatusCodes.BAD_REQUEST, 'Thiếu token Google')
            )
        }

        // 1️⃣ Xác thực token Google bằng hàm chung
        const payload = await verifyGoogleToken(tokenId)
        if (!payload || !payload.email) {
            return next(
                new ApiError(
                    StatusCodes.UNAUTHORIZED,
                    'Google token không hợp lệ'
                )
            )
        }

        // 2️⃣ Kiểm tra user có tồn tại trong DB
        let user = await userService.findUserByEmailService(payload.email)
        // 3️⃣ Nếu chưa có user thì tạo mới
        if (!user) {
            user = await userService.registerGoogleUserService({
                email: payload.email,
                email_verified: payload.email_verified,
                full_name: payload.full_name || `${payload.first_name || ''} ${payload.last_name || ''}`.trim(),
                googleId: payload.googleId,
                avatar_url: payload.avatar_url || null
            })
        }

        // 4️⃣ Gọi hàm dùng chung để xử lý token và trả về response
        await generateAndSetTokens(
            res,
            req,
            user,
            'Đăng nhập Google thành công'
        )
    } catch (error) {
        next(error)
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
        next(error)
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
        if (storedToken.user_id !== decoded.user_id) {
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
        next(error)
    }
}

/**
 * Xác thực access token và trả về thông tin user
 */
export const validateToken = (req, res, next) => {
    try {
        const userPayload = {
            username: req.user.username,
            email: req.user.email,
        }
        res.status(StatusCodes.OK).json(userPayload)
    } catch (error) {
        next(error)
    }
}

export const authController = {
    validateToken,
    refreshToken,
    register,
    login,
    loginGoogle,
    logout,
}
