import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const SHIPMENTS_TABLE_NAME = 'Shipments'

// Schema validate dữ liệu shipment
const SHIPMENTS_SCHEMA = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Name không được để trống',
        'string.min': 'Name tối thiểu 3 ký tự',
        'string.max': 'Name tối đa 100 ký tự',
    }),
    description: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Description tối đa 255 ký tự',
    }),
    base_fee: Joi.number().precision(2).min(0).default(0).messages({
        'number.base': 'Base fee phải là số',
        'number.min': 'Base fee tối thiểu 0',
    }),
    status: Joi.number().integer().valid(0, 1).default(1).messages({
        'number.base': 'Status phải là số',
        'any.only': 'Status chỉ nhận 0 hoặc 1',
    }),
})

const ShipmentsModel = {
    
    async createShipment(data) {
        const { error, value } = SHIPMENTS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${SHIPMENTS_TABLE_NAME} (name, description, base_fee, status) VALUES (?, ?, ?, ?)`,
            [value.name, value.description, value.base_fee, value.status]
        )

        return { id: result.insertId, ...value }
    },
    // Lấy shipment theo name
    async getShipmentByName(name) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${SHIPMENTS_TABLE_NAME} WHERE name = ? LIMIT 1`,
            [name]
        )
        return rows[0] || null
    },

    
    async getShipmentById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${SHIPMENTS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    
    async updateShipment(id, data) {
        const schema = SHIPMENTS_SCHEMA.fork(
            Object.keys(SHIPMENTS_SCHEMA.describe().keys),
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
            `UPDATE ${SHIPMENTS_TABLE_NAME} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [...values, id]
        )

        return this.getShipmentById(id)
    },

    
    async deleteShipment(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${SHIPMENTS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    // Lấy danh sách shipment
    async listShipments() {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${SHIPMENTS_TABLE_NAME} ORDER BY status DESC, id ASC`
        )
        return rows
    },

    
    async getActiveShipments() {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${SHIPMENTS_TABLE_NAME} WHERE status = 1 ORDER BY id ASC`
        )
        return rows
    },
}

export { SHIPMENTS_TABLE_NAME, SHIPMENTS_SCHEMA, ShipmentsModel }
