import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const TOKENS_TABLE_NAME = 'Tokens'

// Schema validate dữ liệu token
const TOKEN_SCHEMA = Joi.object({
    user_id: Joi.number().integer().positive().required().messages({
        'number.base': 'User ID phải là một số',
        'number.integer': 'User ID phải là số nguyên',
        'number.positive': 'User ID phải là số dương',
        'any.required': 'User ID không được để trống',
    }),
    refresh_token: Joi.string().max(1024).required().messages({
        'string.empty': 'Refresh token không được để trống',
        'string.max': 'Refresh token tối đa 512 ký tự',
    }),
    device_info: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Thông tin thiết bị tối đa 255 ký tự',
    }),
    ip_address: Joi.string().ip().allow('', null).messages({
        'string.ip': 'Địa chỉ IP không hợp lệ',
    }),
    token_started_at: Joi.date().required().messages({
        'any.required': 'Thời gian bắt đầu token không được để trống',
    }),
    token_expired_at: Joi.date().required().messages({
        'any.required': 'Thời gian hết hạn token không được để trống',
    }),
    is_revoked: Joi.boolean().default(false),
    revoked_at: Joi.date().allow(null),
})

const TokensModel = {
    /**
     * Tạo một refresh token mới và lưu vào DB
     * @param {object} data - Dữ liệu token
     * @returns {Promise<object>} - Token đã được tạo
     */
    async createToken(data) {
        const { error, value } = TOKEN_SCHEMA.validate(data, { abortEarly: false })
        if (error) throw error
        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${TOKENS_TABLE_NAME}
            (user_id, refresh_token, device_info, ip_address, token_started_at, token_expired_at, is_revoked, revoked_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                value.user_id,
                value.refresh_token,
                value.device_info,
                value.ip_address,
                value.token_started_at,
                value.token_expired_at,
                value.is_revoked,
                value.revoked_at,
            ]
        )
        return { id: result.insertId, ...value }
    },

    /**
     * Tìm một token bằng chuỗi refresh token
     * @param {string} token - Chuỗi refresh token
     * @returns {Promise<object|null>}
     */
    async findByToken(token) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${TOKENS_TABLE_NAME} WHERE refresh_token = ?`,
            [token]
        )
        return rows[0] || null
    },
    
    /**
     * Tìm tất cả các token của một người dùng
     * @param {number} userId - ID của người dùng
     * @returns {Promise<Array>}
     */
    async findByUserId(userId) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${TOKENS_TABLE_NAME} WHERE user_id = ? AND is_revoked = FALSE`,
            [userId]
        )
        return rows
    },

    /**
     * Thu hồi một token (cập nhật is_revoked = TRUE)
     * @param {string} token - Chuỗi refresh token
     * @returns {Promise<object|null>} - Token đã được cập nhật
     */
    async revokeToken(token) {
        const conn = getConnection()
        await conn.execute(
            `UPDATE ${TOKENS_TABLE_NAME} SET is_revoked = ?, revoked_at = CURRENT_TIMESTAMP WHERE refresh_token = ?`,
            [true, token]
        )
        return this.findByToken(token)
    },

    /**
     * Xóa một token khỏi DB
     * @param {number} id - ID của token
     * @returns {Promise<boolean>}
     */
    async deleteToken(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${TOKENS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    /**
     * Xóa tất cả các token của một người dùng
     * @param {number} userId - ID của người dùng
     * @returns {Promise<boolean>}
     */
    async deleteAllTokensByUserId(userId) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${TOKENS_TABLE_NAME} WHERE user_id = ?`,
            [userId]
        )
        return result.affectedRows > 0
    },
}

export { TOKENS_TABLE_NAME, TOKEN_SCHEMA, TokensModel }