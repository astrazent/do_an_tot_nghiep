import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const ROLES_TABLE_NAME = 'Roles'

// Schema validate dữ liệu role
const ROLES_SCHEMA = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Name không được để trống',
        'string.min': 'Name tối thiểu 3 ký tự',
        'string.max': 'Name tối đa 50 ký tự',
    }),
    description: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Description tối đa 255 ký tự',
    }),
})

const RolesModel = {
    // Tạo role mới
    async createRole(data) {
        const { error, value } = ROLES_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${ROLES_TABLE_NAME} (name, description) VALUES (?, ?)`,
            [value.name, value.description]
        )

        return { id: result.insertId, ...value }
    },

    // Lấy role theo ID
    async getRoleById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${ROLES_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    // Cập nhật role theo ID
    async updateRole(id, data) {
        const schema = ROLES_SCHEMA.fork(
            Object.keys(ROLES_SCHEMA.describe().keys),
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
            `UPDATE ${ROLES_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )

        return this.getRoleById(id)
    },

    // Xóa role theo ID
    async deleteRole(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${ROLES_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    // Lấy danh sách role
    async listRoles(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${ROLES_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },
}

export { ROLES_TABLE_NAME, ROLES_SCHEMA, RolesModel }
