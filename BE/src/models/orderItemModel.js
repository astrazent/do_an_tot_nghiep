import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const ORDER_ITEMS_TABLE_NAME = 'OrderItems'

// Schema validate dữ liệu order item
const ORDER_ITEMS_SCHEMA = Joi.object({
    qty_total: Joi.number().integer().min(1).required().messages({
        'number.base': 'Số lượng phải là số',
        'number.min': 'Số lượng tối thiểu là 1',
        'any.required': 'Số lượng là bắt buộc',
    }),
    amount_total: Joi.number().precision(2).min(0).required().messages({
        'number.base': 'Amount total phải là số',
        'number.min': 'Amount total tối thiểu là 0',
        'any.required': 'Amount total là bắt buộc',
    }),
    transaction_id: Joi.number().integer().required().messages({
        'number.base': 'Transaction ID phải là số',
        'any.required': 'Transaction ID là bắt buộc',
    }),
    product_id: Joi.number().integer().required().messages({
        'number.base': 'Product ID phải là số',
        'any.required': 'Product ID là bắt buộc',
    }),
})

const OrderItemsModel = {
    
    async createOrderItem(data) {
        const { error, value } = ORDER_ITEMS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${ORDER_ITEMS_TABLE_NAME} (qty_total, amount_total, transaction_id, product_id) VALUES (?, ?, ?, ?)`,
            [
                value.qty_total,
                value.amount_total,
                value.transaction_id,
                value.product_id,
            ]
        )

        return { id: result.insertId, ...value }
    },

    
    async getOrderItemById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${ORDER_ITEMS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    
    async updateOrderItem(id, data) {
        const schema = ORDER_ITEMS_SCHEMA.fork(
            Object.keys(ORDER_ITEMS_SCHEMA.describe().keys),
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
            `UPDATE ${ORDER_ITEMS_TABLE_NAME} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [...values, id]
        )

        return this.getOrderItemById(id)
    },

    
    async deleteOrderItem(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${ORDER_ITEMS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    
    async listOrderItems(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${ORDER_ITEMS_TABLE_NAME} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    
    async getItemsByTransaction(transaction_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${ORDER_ITEMS_TABLE_NAME} WHERE transaction_id = ? ORDER BY created_at ASC`,
            [transaction_id]
        )
        return rows
    },

    
    async getItemsByProduct(product_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${ORDER_ITEMS_TABLE_NAME} WHERE product_id = ? ORDER BY created_at ASC`,
            [product_id]
        )
        return rows
    },
}

export { ORDER_ITEMS_TABLE_NAME, ORDER_ITEMS_SCHEMA, OrderItemsModel }
