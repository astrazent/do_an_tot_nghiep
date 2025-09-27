import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const DISCOUNT_PRODUCTS_TABLE_NAME = 'DiscountProducts'

// Schema validate dữ liệu discount-product
const DISCOUNT_PRODUCTS_SCHEMA = Joi.object({
    discount_id: Joi.number().integer().required().messages({
        'number.base': 'Discount ID phải là số',
        'any.required': 'Discount ID là bắt buộc',
    }),
    product_id: Joi.number().integer().required().messages({
        'number.base': 'Product ID phải là số',
        'any.required': 'Product ID là bắt buộc',
    }),
})

const DiscountProductsModel = {
    // Tạo liên kết discount-product
    async createLink(data) {
        const { error, value } = DISCOUNT_PRODUCTS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${DISCOUNT_PRODUCTS_TABLE_NAME} (discount_id, product_id) VALUES (?, ?)`,
            [value.discount_id, value.product_id]
        )

        return { id: result.insertId, ...value }
    },

    // Lấy liên kết theo ID
    async getLinkById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${DISCOUNT_PRODUCTS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    // Cập nhật liên kết theo ID
    async updateLink(id, data) {
        const schema = DISCOUNT_PRODUCTS_SCHEMA.fork(
            Object.keys(DISCOUNT_PRODUCTS_SCHEMA.describe().keys),
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
            `UPDATE ${DISCOUNT_PRODUCTS_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )

        return this.getLinkById(id)
    },

    // Xóa liên kết theo ID
    async deleteLink(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${DISCOUNT_PRODUCTS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    // Lấy danh sách liên kết
    async listLinks(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${DISCOUNT_PRODUCTS_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    // Lấy tất cả products của một discount
    async getProductsByDiscount(discount_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${DISCOUNT_PRODUCTS_TABLE_NAME} WHERE discount_id = ? ORDER BY id DESC`,
            [discount_id]
        )
        return rows
    },

    // Lấy tất cả discounts của một product
    async getDiscountsByProduct(product_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${DISCOUNT_PRODUCTS_TABLE_NAME} WHERE product_id = ? ORDER BY id DESC`,
            [product_id]
        )
        return rows
    },
}

export {
    DISCOUNT_PRODUCTS_TABLE_NAME,
    DISCOUNT_PRODUCTS_SCHEMA,
    DiscountProductsModel,
}
