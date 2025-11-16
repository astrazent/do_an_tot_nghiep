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

    const ipv4Match = rawIp.match(/::ffff:(\d+\.\d+\.\d+\.\d+)/)
    if (ipv4Match) return ipv4Match[1]

    if (rawIp === '::1') return '127.0.0.1'

    if (rawIp.includes(':') && rawIp.split(':').length === 2) {
        return rawIp.split(':')[0]
    }

    return rawIp
}

const generateAndSetTokens = async (res, req, user, successMessage) => {
    const userPayload = {
        user_id: user.id,
        username: user.username,
        email: user.email,
    }

    const accessToken = generateAccessToken(userPayload)
    const refreshToken = generateRefreshToken(userPayload)
    const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const tokenData = {
        user_id: user.id,
        refresh_token: refreshToken,
        device_info: req.headers['user-agent'] || 'Unknown Device',
        ip_address: convertIP(req.ip),
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
        maxAge: 1 * 60 * 1000,
    })
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: env.BUILD_MODE === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(StatusCodes.OK).json({
        message: successMessage,
        data: user,
    })
}

const login = async (req, res, next) => {
    try {
        const user = await userService.loginService(req.validated)

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

        const payload = await verifyGoogleToken(tokenId)
        if (!payload || !payload.email) {
            return next(
                new ApiError(
                    StatusCodes.UNAUTHORIZED,
                    'Google token không hợp lệ'
                )
            )
        }

<<<<<<< HEAD

        // 2️⃣ Kiểm tra user có tồn tại trong DB
=======
>>>>>>> 90c0ef4009c16de0e32287b149daba0b9a7ba6f6
        let user = await userService.findUserByEmailService(payload.email)

        if (!user) {
            user = await userService.registerGoogleUserService({
                email: payload.email,
                email_verified: payload.email_verified,
                full_name:
                    payload.full_name ||
                    `${payload.first_name || ''} ${payload.last_name || ''}`.trim(),
                googleId: payload.googleId,
                avatar_url: payload.avatar_url || null,
            })
        }

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

        if (refreshToken) {
            await tokenService.revokeTokenService(refreshToken)
            return res
                .status(StatusCodes.OK)
                .json({ message: 'Đăng xuất thành công.' })
        }

        return res
            .status(StatusCodes.OK)
            .json({ message: 'Người dùng đã đăng xuất.' })
    } catch (error) {
        next(error)
    }
}

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

        const decoded = verifyRefreshToken(token)

        const storedToken = await tokenService.getByTokenService(token)
        if (!storedToken) {
            return next(
                new ApiError(
                    StatusCodes.FORBIDDEN,
                    'Refresh token không tồn tại trong hệ thống.'
                )
            )
        }

        if (storedToken.is_revoked) {
            return next(
                new ApiError(
                    StatusCodes.FORBIDDEN,
                    'Refresh token đã bị thu hồi.'
                )
            )
        }

        if (new Date(storedToken.token_expired_at) < new Date()) {
            return next(
                new ApiError(StatusCodes.FORBIDDEN, 'Refresh token đã hết hạn.')
            )
        }

        if (storedToken.user_id !== decoded.user_id) {
            return next(
                new ApiError(
                    StatusCodes.FORBIDDEN,
                    'Refresh token không hợp lệ.'
                )
            )
        }

        const userPayload = {
            user_id: decoded.user_id,
            username: decoded.username,
            email: decoded.email,
        }

        const newAccessToken = generateAccessToken(userPayload)

        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: env.BUILD_MODE === 'production',
            sameSite: env.BUILD_MODE === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 2 * 60 * 1000,
        })

        return res.status(StatusCodes.OK).json({
            message: 'Làm mới token thành công',
        })
    } catch (error) {
        next(error)
    }
}

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
