import { TokensModel } from '~/models/tokenModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

/**
 * Tạo một refresh token mới
 * @param {object} data - Dữ liệu token (user_id, refresh_token, ...)
 * @returns {Promise<object>} - Token đã được tạo
 */
const createTokenService = async data => {
    // Logic validate dữ liệu đã được xử lý trong Model bằng Joi
    const token = await TokensModel.createToken(data)
    return token
}

/**
 * Lấy thông tin token dựa trên chuỗi refresh token
 * @param {string} tokenString - Chuỗi refresh token
 * @returns {Promise<object>}
 */
const getByTokenService = async tokenString => {
    const token = await TokensModel.findByToken(tokenString)
    if (!token) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Refresh token không tồn tại hoặc không hợp lệ.')
    }
    return token
}

/**
 * Lấy danh sách tất cả các token hợp lệ của một người dùng
 * @param {number} userId - ID của người dùng
 * @returns {Promise<Array>}
 */
const getTokensByUserService = async userId => {
    const tokens = await TokensModel.findByUserId(userId)
    // Trả về một mảng rỗng là một kết quả hợp lệ, không cần ném lỗi NOT_FOUND
    return tokens
}

/**
 * Thu hồi một refresh token
 * @param {string} tokenString - Chuỗi refresh token cần thu hồi
 * @returns {Promise<{message: string}>}
 */
const revokeTokenService = async tokenString => {
    const existingToken = await TokensModel.findByToken(tokenString)
    if (!existingToken) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Refresh token không tồn tại.')
    }

    if (existingToken.is_revoked) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Token này đã được thu hồi trước đó.')
    }

    await TokensModel.revokeToken(tokenString)
    return { message: 'Thu hồi token thành công.' }
}

/**
 * Xóa một token cụ thể bằng ID của nó
 * @param {number} tokenId - ID của token
 * @returns {Promise<{message: string}>}
 */
const deleteTokenByIdService = async tokenId => {
    // Không cần kiểm tra tồn tại trước vì model.delete sẽ trả về số hàng bị ảnh hưởng
    const deleted = await TokensModel.deleteToken(tokenId)
    if (!deleted) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Không tìm thấy token với ID: ${tokenId}`)
    }
    return { message: 'Xóa token thành công.' }
}

/**
 * Xóa TẤT CẢ các token của một người dùng (dùng cho chức năng "đăng xuất khỏi tất cả thiết bị")
 * @param {number} userId - ID của người dùng
 * @returns {Promise<{message: string}>}
 */
const deleteAllTokensForUserService = async (userId) => {
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