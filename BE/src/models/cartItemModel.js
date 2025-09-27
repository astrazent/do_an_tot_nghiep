import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const CART_ITEMS_TABLE_NAME = 'CartItems'

// Schema validate dữ liệu cart item
const CART_ITEMS_SCHEMA = Joi.object({
    qty_total: Joi.number().integer().min(1).required().messages({
        'number.base': 'Qty total phải là số',
        'number.min': 'Qty total tối thiểu 1',
        'any.required': 'Qty total là bắt buộc',
    }),
    price_total: Joi.number().precision(2).min(0).default(0).messages({
        'number.base': 'Price total phải là số',
        'number.min': 'Price total tối thiểu 0',
    }),
    user_id: Joi.number().integer().required().messages({
        'number.base': 'User ID phải là số',
        'any.required': 'User ID là bắt buộc',
    }),
    product_id: Joi.number().integer().required().messages({
        'number.base': 'Product ID phải là số',
        'any.required': 'Product ID là bắt buộc',
    }),
})

const CartItemsModel = {
    // Tạo cart item mới
    async createCartItem(data) {
        const { error, value } = CART_ITEMS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${CART_ITEMS_TABLE_NAME} 
            (qty_total, price_total, user_id, product_id)
            VALUES (?, ?, ?, ?)`,
            [
                value.qty_total,
                value.price_total,
                value.user_id,
                value.product_id,
            ]
        )

        return { id: result.insertId, ...value }
    },

    // Lấy cart item theo ID
    async getCartItemById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${CART_ITEMS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    // Cập nhật cart item theo ID
    async updateCartItem(id, data) {
        const schema = CART_ITEMS_SCHEMA.fork(
            Object.keys(CART_ITEMS_SCHEMA.describe().keys),
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
            `UPDATE ${CART_ITEMS_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )

        return this.getCartItemById(id)
    },

    // Xóa cart item theo ID
    async deleteCartItem(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${CART_ITEMS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    // Lấy danh sách cart item
    async listCartItems(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${CART_ITEMS_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    // Lấy tất cả cart item của một user
    async getCartItemsByUser(user_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${CART_ITEMS_TABLE_NAME} WHERE user_id = ? ORDER BY id DESC`,
            [user_id]
        )
        return rows
    },

    // Lấy tất cả cart item của một product
    async getCartItemsByProduct(product_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${CART_ITEMS_TABLE_NAME} WHERE product_id = ? ORDER BY id DESC`,
            [product_id]
        )
        return rows
    },
}

export { CART_ITEMS_TABLE_NAME, CART_ITEMS_SCHEMA, CartItemsModel }
