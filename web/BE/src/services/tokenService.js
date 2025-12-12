import { TokensModel } from '~/models/tokenModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createTokenService = async data => {
    const token = await TokensModel.createToken(data)
    return token
}

const getByTokenService = async tokenString => {
    const token = await TokensModel.findByToken(tokenString)
    if (!token) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Refresh token không tồn tại hoặc không hợp lệ.'
        )
    }
    return token
}

const getTokensByUserService = async userId => {
    const tokens = await TokensModel.findByUserId(userId)

    return tokens
}

const revokeTokenService = async tokenString => {
    const existingToken = await TokensModel.findByToken(tokenString)
    if (!existingToken) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Refresh token không tồn tại.'
        )
    }

    if (existingToken.is_revoked) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Token này đã được thu hồi trước đó.'
        )
    }

    await TokensModel.revokeToken(tokenString)
    return { message: 'Thu hồi token thành công.' }
}

const deleteTokenByIdService = async tokenId => {
    const deleted = await TokensModel.deleteToken(tokenId)
    if (!deleted) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy token với ID: ${tokenId}`
        )
    }
    return { message: 'Xóa token thành công.' }
}

const deleteAllTokensForUserService = async userId => {
    await TokensModel.deleteAllTokensByUserId(userId)
    return { message: `Đã xóa tất cả token cho người dùng ID: ${userId}.` }
}

export const tokenService = {
    createTokenService,
    getByTokenService,
    getTokensByUserService,
    revokeTokenService,
    deleteTokenByIdService,
    deleteAllTokensForUserService,
}
