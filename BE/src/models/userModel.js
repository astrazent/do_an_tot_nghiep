import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const USERS_TABLE_NAME = 'Users'

// Schema validate dữ liệu user
const USERS_SCHEMA = Joi.object({
    username: Joi.string().min(3).max(50).allow(null).messages({
        'string.min': 'Username tối thiểu 3 ký tự',
        'string.max': 'Username tối đa 50 ký tự',
    }),

    password_hash: Joi.string().min(6).max(255).allow(null, '').messages({
        'string.min': 'Password tối thiểu 6 ký tự',
        'string.max': 'Password tối đa 255 ký tự',
    }),

    provider: Joi.string()
        .valid('local', 'google', 'facebook', 'github')
        .default('local')
        .messages({
            'any.only': 'Provider không hợp lệ',
        }),

    provider_id: Joi.string().max(255).allow(null).messages({
        'string.max': 'Provider ID tối đa 255 ký tự',
    }),

    email: Joi.string().email().max(100).allow(null).messages({
        'string.email': 'Email không hợp lệ',
        'string.max': 'Email tối đa 100 ký tự',
    }),

    email_verified: Joi.boolean().default(false), // thêm trường email_verified

    phone: Joi.string().max(20).allow(null).messages({
        'string.max': 'Phone tối đa 20 ký tự',
    }),

    full_name: Joi.string().min(3).max(100).allow(null).messages({
        'string.min': 'Full name tối thiểu 3 ký tự',
        'string.max': 'Full name tối đa 100 ký tự',
    }),

    gender: Joi.string()
        .valid('male', 'female', 'other')
        .default('other')
        .messages({
            'any.only': 'Gender phải là male, female hoặc other',
        }),

    address: Joi.string().max(255).allow(null).messages({
        'string.max': 'Address tối đa 255 ký tự',
    }),

    city: Joi.string().max(100).allow(null).messages({
        'string.max': 'City tối đa 100 ký tự',
    }),

    district: Joi.string().max(100).allow(null).messages({
        'string.max': 'District tối đa 100 ký tự',
    }),

    ward: Joi.string().max(100).allow(null).messages({
        'string.max': 'Ward tối đa 100 ký tự',
    }),

    avatar_url: Joi.string().max(255).allow(null, '').messages({
        'string.max': 'Avatar URL tối đa 255 ký tự',
    }),

    status: Joi.number().integer().valid(0, 1).default(0).messages({
        'number.base': 'Status phải là số',
        'any.only': 'Status phải là 0 hoặc 1',
    }),

    created_at: Joi.date().optional(),
    updated_at: Joi.date().optional(),
})
.when(Joi.object({ provider: Joi.valid('local') }).unknown(), {
    then: Joi.object({
        // Nếu là tài khoản local: có thể có password_hash, nhưng không được có provider_id
        provider_id: Joi.any().forbidden().messages({
            'any.unknown': 'Tài khoản local không được có provider_id',
        }),
    }),
})
.when(Joi.object({ provider: Joi.not('local') }).unknown(), {
    then: Joi.object({
        // Nếu là tài khoản mạng xã hội: có thể có provider_id, nhưng không được có password_hash
        password_hash: Joi.any().forbidden().messages({
            'any.unknown': 'Tài khoản mạng xã hội không có mật khẩu',
        }),
    }),
});

const UsersModel = {
    async createUser(data) {
        const { error, value } = USERS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error
        console.log('Creating user with data:', data);
        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${USERS_TABLE_NAME} 
        (username, password_hash, provider, provider_id, email, email_verified, phone, full_name, gender, address, city, district, ward, avatar_url, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                value.username || null,
                value.password_hash || null,
                value.provider || 'local',
                value.provider_id || null,
                value.email || null,
                value.email_verified ?? false, // thêm trường email_verified
                value.phone || null,
                value.full_name || null,
                value.gender || 'other',
                value.address || null,
                value.city || null,
                value.district || null,
                value.ward || null,
                value.avatar_url || null,
                value.status ?? 1,
            ]
        )

        return { id: result.insertId, ...value }
    },

    async getUserById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${USERS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async updateUser(id, data) {
        console.log(data);
        // Cho phép update tự do, không cần đầy đủ dữ liệu
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

    async deleteUser(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${USERS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listUsers(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${USERS_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    async findUserByPhone(phone) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${USERS_TABLE_NAME} WHERE phone = ? LIMIT 1`,
            [phone]
        )
        return rows[0] || null
    },

    async findUserByEmailOrUsername(identifier) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${USERS_TABLE_NAME} WHERE email = ? OR username = ? LIMIT 1`,
            [identifier, identifier]
        )
        return rows[0] || null
    },

    async findUserByProvider(provider, providerId) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${USERS_TABLE_NAME} WHERE provider = ? AND provider_id = ? LIMIT 1`,
            [provider, providerId]
        )
        return rows[0] || null
    },
}

export default UsersModel

export { USERS_TABLE_NAME, USERS_SCHEMA, UsersModel }
