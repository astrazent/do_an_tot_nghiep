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
    slug: Joi.string(),
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
    last_restock_at: Joi.date().default(() => new Date()),
    status: Joi.number().integer().valid(0, 1).default(1),
    ocop_rating: Joi.number().integer().default(0),
    category_id: Joi.number().integer().required().messages({
        'number.base': 'Category ID phải là số',
        'any.required': 'Category ID là bắt buộc',
    }),
})

const ProductsModel = {
    async createProduct(data) {
        const { error, value } = PRODUCTS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${PRODUCTS_TABLE_NAME} 
            (name, slug, description, origin_price, price, buyed, rate_point_total, rate_count, stock_qty, low_stock_threshold, last_restock_at, status, ocop_rating, category_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                value.name,
                value.slug,
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
                value.ocop_rating,
                value.category_id,
            ]
        )
        return { id: result.insertId, ...value }
    },

    async getProductById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${PRODUCTS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

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

    async deleteProduct(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${PRODUCTS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listProducts(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${PRODUCTS_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    async getProductBySlug(slug) {
        if (!slug) return null

        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${PRODUCTS_TABLE_NAME}
        WHERE slug = ?
        LIMIT 1`,
            [slug]
        )

        return rows.length ? rows[0] : null
    },
    async getProductsByCategorySlug(categorySlug) {
        if (!categorySlug) return []

        const conn = getConnection()

        const [rows] = await conn.execute(
            `SELECT p.*
            FROM Products p
            JOIN Categories c ON p.category_id = c.id
            WHERE c.slug = ?
            ORDER BY p.id DESC`,
            [categorySlug]
        )

        return rows // trả về mảng sản phẩm, rỗng nếu không có
    },
    async getRelatedBySlug(slug, limit = 10) {
        if (!slug) return { sameCategory: [], coBought: [] }

        const conn = getConnection()

        try {
            // 1️⃣ Lấy sản phẩm hiện tại
            const [productRows] = await conn.execute(
                `SELECT * FROM Products WHERE slug = ? LIMIT 1`,
                [slug]
            )
            if (!productRows.length) return { sameCategory: [], coBought: [] }
            const product = productRows[0]

            // 2️⃣ Lấy các sản phẩm cùng category (ngoại trừ sản phẩm hiện tại)
            const [categoryRows] = await conn.execute(
                `SELECT * FROM Products 
                WHERE category_id = ? AND slug != ?
                ORDER BY created_at DESC
                LIMIT ?`,
                [product.category_id, slug, limit]
            )

            // 3️⃣ Lấy các sản phẩm được mua cùng với sản phẩm này
            const [coBoughtRows] = await conn.execute(
                `SELECT DISTINCT p.*
                FROM OrderItems oi1
                INNER JOIN OrderItems oi2 
                    ON oi1.transaction_id = oi2.transaction_id 
                    AND oi2.product_id != oi1.product_id
                INNER JOIN Products p 
                    ON p.id = oi2.product_id
                INNER JOIN Products target 
                    ON target.id = oi1.product_id
                WHERE target.slug = ?
                LIMIT ?`,
                [slug, limit]
            )

            return {
                sameCategory: categoryRows,
                coBought: coBoughtRows,
            }
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm liên quan:', error)
            throw error
        }
    },
}

export { PRODUCTS_TABLE_NAME, PRODUCTS_SCHEMA, ProductsModel }
