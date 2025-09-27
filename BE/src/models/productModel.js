import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const PRODUCTS_TABLE_NAME = 'Products'

// Schema validate dữ liệu product
const PRODUCTS_SCHEMA = Joi.object({
    name: Joi.string().min(3).max(200).required().messages({
        'string.empty': 'Name không được để trống',
        'string.min': 'Name tối thiểu 3 ký tự',
        'string.max': 'Name tối đa 200 ký tự',
    }),
    description: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Description tối đa 255 ký tự',
    }),
    origin_price: Joi.number().precision(2).min(0).default(0).messages({
        'number.base': 'Origin price phải là số',
        'number.min': 'Origin price tối thiểu 0',
    }),
    price: Joi.number().precision(2).min(0).default(0).messages({
        'number.base': 'Price phải là số',
        'number.min': 'Price tối thiểu 0',
    }),
    buyed: Joi.number().integer().min(0).default(0),
    rate_point_total: Joi.number().integer().min(0).default(0),
    rate_count: Joi.number().integer().min(0).default(0),
    stock_qty: Joi.number().integer().min(0).default(0),
    low_stock_threshold: Joi.number().integer().min(0).default(0),
    last_restock_at: Joi.date().default(() => new Date(), 'current timestamp'),
    status: Joi.number().integer().valid(0, 1).default(1),
    category_id: Joi.number().integer().required().messages({
        'number.base': 'Category ID phải là số',
        'any.required': 'Category ID là bắt buộc',
    }),
})

const ProductsModel = {
    // Tạo product mới
    async createProduct(data) {
        const { error, value } = PRODUCTS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${PRODUCTS_TABLE_NAME} 
            (name, description, origin_price, price, buyed, rate_point_total, rate_count, stock_qty, low_stock_threshold, last_restock_at, status, category_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                value.name,
                value.description,
                value.origin_price,
                value.price,
                value.buyed,
                value.rate_point_total,
                value.rate_count,
                value.stock_qty,
                value.low_stock_threshold,
                value.last_restock_at,
                value.status,
                value.category_id,
            ]
        )

        return { id: result.insertId, ...value }
    },

    // Lấy product theo ID
    async getProductById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${PRODUCTS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    // Cập nhật product theo ID
    async updateProduct(id, data) {
        const schema = PRODUCTS_SCHEMA.fork(
            Object.keys(PRODUCTS_SCHEMA.describe().keys),
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
            `UPDATE ${PRODUCTS_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )

        return this.getProductById(id)
    },

    // Xóa product theo ID
    async deleteProduct(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${PRODUCTS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    // Lấy danh sách product
    async listProducts(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${PRODUCTS_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    // Lấy sản phẩm theo category
    async getProductsByCategory(category_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${PRODUCTS_TABLE_NAME} WHERE category_id = ? ORDER BY id DESC`,
            [category_id]
        )
        return rows
    },
}

export { PRODUCTS_TABLE_NAME, PRODUCTS_SCHEMA, ProductsModel }
