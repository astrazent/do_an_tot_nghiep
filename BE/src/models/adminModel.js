import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const ADMINS_TABLE_NAME = 'Admins'

// Schema validate dữ liệu admin
const ADMINS_SCHEMA = Joi.object({
    username: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Username không được để trống',
        'string.min': 'Username tối thiểu 3 ký tự',
        'string.max': 'Username tối đa 100 ký tự',
    }),
    email: Joi.string().email().max(100).required().messages({
        'string.empty': 'Email không được để trống',
        'string.email': 'Email không hợp lệ',
        'string.max': 'Email tối đa 100 ký tự',
    }),
    full_name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Full name không được để trống',
        'string.min': 'Full name tối thiểu 3 ký tự',
        'string.max': 'Full name tối đa 100 ký tự',
    }),
    password_hash: Joi.string().min(6).max(255).required().messages({
        'string.empty': 'Password không được để trống',
        'string.min': 'Password tối thiểu 6 ký tự',
        'string.max': 'Password tối đa 255 ký tự',
    }),
    level: Joi.number().integer().min(0).max(99).required().messages({
        'number.base': 'Level phải là số',
        'number.min': 'Level tối thiểu 0',
        'number.max': 'Level tối đa 99',
    }),
    description: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Description tối đa 255 ký tự',
    }),
    role_id: Joi.number().integer().required().messages({
        'number.base': 'Role ID phải là số',
        'any.required': 'Role ID là bắt buộc',
    }),
})

const AdminsModel = {
    
    async createAdmin(data) {
        const { error, value } = ADMINS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${ADMINS_TABLE_NAME} (username, email, full_name, password_hash, level, description, role_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                value.username,
                value.email,
                value.full_name,
                value.password_hash,
                value.level,
                value.description,
                value.role_id,
            ]
        )

        return { id: result.insertId, ...value }
    },

    
    async getAdminById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${ADMINS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    
    async updateAdmin(id, data) {
        const schema = ADMINS_SCHEMA.fork(
            Object.keys(ADMINS_SCHEMA.describe().keys),
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
            `UPDATE ${ADMINS_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )

        return this.getAdminById(id)
    },

    
    async deleteAdmin(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${ADMINS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    
    async listAdmins(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${ADMINS_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },
}

export { ADMINS_TABLE_NAME, ADMINS_SCHEMA, AdminsModel }
