import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const TRANSACTIONS_TABLE_NAME = 'Transactions'

// Schema validate dữ liệu transaction
const TRANSACTIONS_SCHEMA = Joi.object({
    status: Joi.number().integer().min(0).max(5).required().messages({
        'number.base': 'Status phải là số',
        'number.min': 'Status tối thiểu 0',
        'number.max': 'Status tối đa 5',
        'any.required': 'Status là bắt buộc',
    }),
    deli_name: Joi.string().min(3).max(100).required(),
    deli_phone: Joi.string().min(5).max(20).required(),
    deli_address: Joi.string().min(5).max(255).required(),
    deli_city: Joi.string().min(2).max(100).required(),
    deli_district: Joi.string().min(2).max(100).required(),
    deli_ward: Joi.string().min(2).max(100).required(),
    message: Joi.string().max(255).allow('', null),
    tracking_number: Joi.string().max(100).required(),
    shipping_fee: Joi.number().precision(2).min(0).default(0),
    shipment_status: Joi.string()
        .valid('pending', 'shipped', 'in_transit', 'delivered', 'returned')
        .default('pending'),
    amount: Joi.number().precision(2).min(0).default(0),
    shipped_at: Joi.date().allow(null),
    delivered_at: Joi.date().allow(null),
    user_id: Joi.number().integer().required(),
    payment_id: Joi.number().integer().required(),
    shipment_id: Joi.number().integer().required(),
})

const TransactionsModel = {
    
    async createTransaction(data) {
        const { error, value } = TRANSACTIONS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${TRANSACTIONS_TABLE_NAME} 
            (status, deli_name, deli_phone, deli_address, deli_city, deli_district, deli_ward, message, tracking_number, shipping_fee, shipment_status, amount, shipped_at, delivered_at, user_id, payment_id, shipment_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                value.status,
                value.deli_name,
                value.deli_phone,
                value.deli_address,
                value.deli_city,
                value.deli_district,
                value.deli_ward,
                value.message,
                value.tracking_number,
                value.shipping_fee,
                value.shipment_status,
                value.amount,
                value.shipped_at,
                value.delivered_at,
                value.user_id,
                value.payment_id,
                value.shipment_id,
            ]
        )

        return { id: result.insertId, ...value }
    },

    
    async getTransactionById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${TRANSACTIONS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    
    async updateTransaction(id, data) {
        const schema = TRANSACTIONS_SCHEMA.fork(
            Object.keys(TRANSACTIONS_SCHEMA.describe().keys),
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
            `UPDATE ${TRANSACTIONS_TABLE_NAME} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [...values, id]
        )

        return this.getTransactionById(id)
    },

    
    async deleteTransaction(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${TRANSACTIONS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    
    async listTransactions(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${TRANSACTIONS_TABLE_NAME} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    
    async getTransactionsByUser(user_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${TRANSACTIONS_TABLE_NAME} WHERE user_id = ? ORDER BY created_at DESC`,
            [user_id]
        )
        return rows
    },

    
    async getTransactionsByStatus(status) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${TRANSACTIONS_TABLE_NAME} WHERE status = ? ORDER BY created_at DESC`,
            [status]
        )
        return rows
    },

    
    async getTransactionsByShipmentStatus(shipment_status) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${TRANSACTIONS_TABLE_NAME} WHERE shipment_status = ? ORDER BY created_at DESC`,
            [shipment_status]
        )
        return rows
    },
}

export { TRANSACTIONS_TABLE_NAME, TRANSACTIONS_SCHEMA, TransactionsModel }
