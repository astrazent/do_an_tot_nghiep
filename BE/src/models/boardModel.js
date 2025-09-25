/**
 * Chức năng: Đại diện cho cấu trúc dữ liệu (table/collection) và giao tiếp với database
 * Ví dụ: userModel.js, productModel.js, orderModel.js
 * Tạo file mới: Khi có entity mới cần lưu trữ/tra cứu trong database
 */
import { getConnection } from '../config/mysql.js'
import Joi from 'joi'
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Username không được để trống',
        'string.min': 'Username tối thiểu 3 ký tự',
        'string.max': 'Username tối đa 50 ký tự',
    }),
    password_hash: Joi.string().min(6).max(255).required().messages({
        'string.empty': 'Mật khẩu không được để trống',
        'string.min': 'Mật khẩu tối thiểu 6 ký tự',
        'string.max': 'Mật khẩu quá dài',
    }),
    email: Joi.string().email().max(100).required().messages({
        'string.email': 'Email không hợp lệ',
        'string.empty': 'Email không được để trống',
    }),
    phone: Joi.string().max(20).allow(null, '').messages({
        'string.max': 'Số điện thoại tối đa 20 ký tự',
    }),
    full_name: Joi.string().max(100).allow(null, '').messages({
        'string.max': 'Tên đầy đủ tối đa 100 ký tự',
    }),
    address: Joi.string().allow(null, '').messages({
        'string.base': 'Address phải là chuỗi',
    }),
    avatar: Joi.string().uri().allow(null, '').messages({
        'string.uri': 'Avatar phải là một URL hợp lệ',
    }),
    role_id: Joi.number().integer().positive().required().messages({
        'number.base': 'role_id phải là số',
        'number.positive': 'role_id phải lớn hơn 0',
        'any.required': 'role_id là bắt buộc',
    }),
    status: Joi.number().valid(0, 1).default(1).messages({
        'any.only': 'Status phải là 0 hoặc 1',
    }),
})

// --- Model ---
const UsersModel = {
    async createUser(data) {
        const { error, value } = USERS_COLLECTION_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO Users (username, password_hash, email, phone, full_name, address, avatar, role_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                value.username,
                value.password_hash,
                value.email,
                value.phone,
                value.full_name,
                value.address,
                value.avatar,
                value.role_id,
                value.status,
            ]
        )
        return { user_id: result.insertId, ...value }
    },

    async getUserById(user_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM Users WHERE user_id = ?`,
            [user_id]
        )
        return rows[0] || null
    },

    async updateUser(user_id, data) {
        const schema = USERS_COLLECTION_SCHEMA.fork(
            Object.keys(USERS_COLLECTION_SCHEMA.describe().keys),
            field => field.optional()
        )
        const { error, value } = schema.validate(data, { abortEarly: false })
        if (error) throw error

        const conn = getConnection()
        const fields = Object.keys(value)
        const values = Object.values(value)
        if (fields.length === 0) return null

        const setClause = fields.map(f => `${f} = ?`).join(', ')
        await conn.execute(`UPDATE Users SET ${setClause} WHERE user_id = ?`, [
            ...values,
            user_id,
        ])

        return this.getUserById(user_id)
    },

    async deleteUser(user_id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM Users WHERE user_id = ?`,
            [user_id]
        )
        return result.affectedRows > 0
    },

    async listUsers(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM Users ORDER BY user_id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },
}

export const boardModel = {
    BOARD_COLLECTION_NAME,
    BOARD_COLLECTION_SCHEMA,
    UsersModel
}
