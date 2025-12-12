import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const CART_ITEMS_TABLE_NAME = 'CartItems'

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

    async getCartItemById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${CART_ITEMS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async getCartItemByProductId(product_id, user_id = null) {
        const conn = getConnection()
        let query = `SELECT * FROM ${CART_ITEMS_TABLE_NAME} WHERE product_id = ?`
        const params = [product_id]

        if (user_id !== null) {
            query += ' AND user_id = ?'
            params.push(user_id)
        }

        query += ' ORDER BY id DESC LIMIT 1'

        const [rows] = await conn.execute(query, params)
        return rows[0] || null
    },
    async updateCartItemByUser(user_id, product_id, newQty, newPriceTotal) {
        if (!user_id || !product_id)
            throw new Error('user_id và product_id là bắt buộc')

        const conn = getConnection()

        const [result] = await conn.execute(
            `
        UPDATE ${CART_ITEMS_TABLE_NAME}
        SET qty_total = ?, price_total = ?, updated_at = NOW()
        WHERE user_id = ? AND product_id = ?
        `,
            [newQty, newPriceTotal, user_id, product_id]
        )

        if (result.affectedRows === 0) {
            return null
        }

        return { updated: true }
    },

    async deleteCartItem(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${CART_ITEMS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listCartItems(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${CART_ITEMS_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    async getCartItemsByUser(user_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `
        SELECT 
            ci.id AS cart_item_id,
            ci.qty_total,
            ci.price_total,
            p.id AS product_id,
            p.name,
            p.description,
            p.slug,
            p.price,
            p.origin_price,
            p.ocop_rating,
            pi.image_url AS main_image
        FROM ${CART_ITEMS_TABLE_NAME} ci
        JOIN Products p ON ci.product_id = p.id
        LEFT JOIN ProductImages pi 
            ON pi.product_id = p.id AND pi.is_main = 1
        WHERE ci.user_id = ?
        ORDER BY ci.id DESC
        `,
            [user_id]
        )
        return rows
    },

    async getCartItemsByProduct(product_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${CART_ITEMS_TABLE_NAME} WHERE product_id = ? ORDER BY id DESC`,
            [product_id]
        )
        return rows
    },

    async deleteCartItemsByUser(user_id) {
        if (!user_id) throw new Error('user_id là bắt buộc')

        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${CART_ITEMS_TABLE_NAME} WHERE user_id = ?`,
            [user_id]
        )
        return result.affectedRows > 0
    },
}

export { CART_ITEMS_TABLE_NAME, CART_ITEMS_SCHEMA, CartItemsModel }
