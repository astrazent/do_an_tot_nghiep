import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const PAYMENTS_TABLE_NAME = 'Payments'

const PAYMENTS_SCHEMA = Joi.object({
    method: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Method không được để trống',
        'string.min': 'Method tối thiểu 3 ký tự',
        'string.max': 'Method tối đa 50 ký tự',
    }),
    status: Joi.number().integer().valid(0, 1, 2).required().messages({
        'number.base': 'Status phải là số',
        'any.only': 'Status phải là 0, 1 hoặc 2',
        'any.required': 'Status là bắt buộc',
    }),
    icon_url: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Icon URL tối đa 255 ký tự',
    }),
})

const PaymentsModel = {
    async getAllPayments(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${PAYMENTS_TABLE_NAME} 
            WHERE status = 1 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    async getActivePayments() {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${PAYMENTS_TABLE_NAME} WHERE status = 1 ORDER BY created_at DESC`
        )
        return rows
    },

    async createPayment(data) {
        const { error, value } = PAYMENTS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${PAYMENTS_TABLE_NAME} (method, status, icon_url) VALUES (?, ?, ?)`,
            [value.method, value.status, value.icon_url]
        )

        return { id: result.insertId, ...value }
    },

    async getPaymentById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${PAYMENTS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async updatePayment(id, data) {
        const schema = PAYMENTS_SCHEMA.fork(
            Object.keys(PAYMENTS_SCHEMA.describe().keys),
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
            `UPDATE ${PAYMENTS_TABLE_NAME} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [...values, id]
        )

        return this.getPaymentById(id)
    },

    async deletePayment(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${PAYMENTS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listPayments(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${PAYMENTS_TABLE_NAME} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    async getPaymentsByMethod(method) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${PAYMENTS_TABLE_NAME} 
            WHERE LOWER(REPLACE(method, ' ', '')) = LOWER(REPLACE(?, ' ', '')) 
            ORDER BY created_at DESC`,
            [method]
        )
        return rows
    },

    async getPaymentsByStatus(status) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${PAYMENTS_TABLE_NAME} WHERE status = ? ORDER BY created_at DESC`,
            [status]
        )
        return rows
    },
}

export { PAYMENTS_TABLE_NAME, PAYMENTS_SCHEMA, PaymentsModel }
