import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const USERS_TABLE_NAME = 'Users'

// Schema validate dữ liệu user
const USERS_SCHEMA = Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Username không được để trống',
        'string.min': 'Username tối thiểu 3 ký tự',
        'string.max': 'Username tối đa 50 ký tự',
    }),
    password_hash: Joi.string().min(6).max(255).allow('', null).messages({
        'string.min': 'Password tối thiểu 6 ký tự',
        'string.max': 'Password tối đa 255 ký tự',
    }),
    email: Joi.string().email().max(100).required().messages({
        'string.empty': 'Email không được để trống',
        'string.email': 'Email không hợp lệ',
        'string.max': 'Email tối đa 100 ký tự',
    }),
    phone: Joi.string().max(20).required().messages({
        'string.empty': 'Phone không được để trống',
        'string.max': 'Phone tối đa 20 ký tự',
    }),
    full_name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Full name không được để trống',
        'string.min': 'Full name tối thiểu 3 ký tự',
        'string.max': 'Full name tối đa 100 ký tự',
    }),
    address: Joi.string().max(255).required().messages({
        'string.empty': 'Address không được để trống',
        'string.max': 'Address tối đa 255 ký tự',
    }),
    city: Joi.string().max(100).required().messages({
        'string.empty': 'City không được để trống',
        'string.max': 'City tối đa 100 ký tự',
    }),
    district: Joi.string().max(100).required().messages({
        'string.empty': 'District không được để trống',
        'string.max': 'District tối đa 100 ký tự',
    }),
    ward: Joi.string().max(100).required().messages({
        'string.empty': 'Ward không được để trống',
        'string.max': 'Ward tối đa 100 ký tự',
    }),
    avatar_url: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Avatar URL tối đa 255 ký tự',
    }),
    status: Joi.number().integer().valid(0, 1).default(0).messages({
        'number.base': 'Status phải là số',
        'any.only': 'Status phải là 0 hoặc 1',
    }),
    role_id: Joi.number().integer().required().messages({
        'number.base': 'Role ID phải là số',
        'any.required': 'Role ID là bắt buộc',
    }),
})

const UsersModel = {
    // Tạo user mới
    async createUser(data) {
        const { error, value } = USERS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${USERS_TABLE_NAME} 
            (username, password_hash, email, phone, full_name, address, city, district, ward, avatar_url, status, role_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                value.username,
                value.password_hash,
                value.email,
                value.phone,
                value.full_name,
                value.address,
                value.city,
                value.district,
                value.ward,
                value.avatar_url,
                value.status,
                value.role_id,
            ]
        )

        return { id: result.insertId, ...value }
    },

    // Lấy user theo ID
    async getUserById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${USERS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    // Cập nhật user theo ID
    async updateUser(id, data) {
        const schema = USERS_SCHEMA.fork(
            Object.keys(USERS_SCHEMA.describe().keys),
            f => f.optional()
        )
        const { error, value } = schema.validate(data, { abortEarly: false })
        if (error) throw error

        const fields = Object.keys(value)
        const values = Object.values(value)
        if (!fields.length) return null

        const setClause = fields.map(f => `${f} = ?`).join(', ')
        const conn = getConnection()
        await conn.execute(
            `UPDATE ${USERS_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )

        return this.getUserById(id)
    },

    // Xóa user theo ID
    async deleteUser(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${USERS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    // Lấy danh sách user
    async listUsers(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${USERS_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    // Tìm user theo email hoặc username
    async findUserByEmailOrUsername(identifier) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${USERS_TABLE_NAME} WHERE email = ? OR username = ?`,
            [identifier, identifier]
        )
        return rows[0] || null
    },
}

export { USERS_TABLE_NAME, USERS_SCHEMA, UsersModel }
