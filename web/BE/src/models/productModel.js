import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const PRODUCTS_TABLE = 'Products'
const CATEGORIES_TABLE = 'Categories'
const ORDER_ITEMS_TABLE = 'OrderItems'
const PRODUCT_IMAGES_TABLE = 'ProductImages'
const DISCOUNT_PRODUCTS_TABLE = 'DiscountProducts'
const DISCOUNTS_TABLE = 'Discounts'

const calculateProductPrice = item => {
    if (!item) return item

    const originPrice = Number(item.origin_price) || 0
    if (originPrice === 0) return item

    const calculatedDiscountAmount = Number(item.discount_amount_calc) || 0

    if (calculatedDiscountAmount > 0) {
        item.price = Math.max(0, originPrice - calculatedDiscountAmount)

        item.discount_value = calculatedDiscountAmount
    } else {
        const discountValue = Number(item.discount_value) || 0
        let finalPrice = originPrice

        if (discountValue > 0) {
            if (discountValue > 100) {
                finalPrice = originPrice - discountValue
            } else if (discountValue >= 1 && discountValue <= 100) {
                finalPrice = originPrice - (originPrice * discountValue) / 100
            }
        }
        item.price = Math.max(0, finalPrice)
    }

    return item
}

const DISCOUNT_JOIN_QUERY = `
    LEFT JOIN ${DISCOUNT_PRODUCTS_TABLE} dp ON dp.product_id = p.id
    LEFT JOIN ${DISCOUNTS_TABLE} d ON d.id = dp.discount_id 
        AND d.status = 1 
        AND d.start_date <= NOW() 
        AND d.end_date >= NOW()
`

const DISCOUNT_CALC_SELECT = `
    MAX(
        CASE 
            WHEN d.value > 100 THEN d.value 
            WHEN d.value > 0 AND d.value <= 100 THEN (p.origin_price * d.value / 100)
            ELSE 0 
        END
    ) AS discount_amount_calc
`

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
            `INSERT INTO ${PRODUCTS_TABLE} 
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
        if (!id) return null
        const conn = getConnection()

        const [rows] = await conn.execute(
            `SELECT p.*, ${DISCOUNT_CALC_SELECT}
            FROM ${PRODUCTS_TABLE} p
            ${DISCOUNT_JOIN_QUERY}
            WHERE p.id = ? 
            GROUP BY p.id
            LIMIT 1`,
            [id]
        )
        return rows.length ? calculateProductPrice(rows[0]) : null
    },

    async getProductsByIds(ids) {
        if (!Array.isArray(ids) || !ids.length) return []
        const conn = getConnection()
        const placeholders = ids.map(() => '?').join(',')

        const [rows] = await conn.execute(
            `SELECT p.*, ${DISCOUNT_CALC_SELECT}
            FROM ${PRODUCTS_TABLE} p
            ${DISCOUNT_JOIN_QUERY}
            WHERE p.id IN (${placeholders})
            GROUP BY p.id`,
            ids
        )
        return rows.map(calculateProductPrice)
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
            `UPDATE ${PRODUCTS_TABLE} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )

        return this.getProductById(id)
    },

    async deleteProduct(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${PRODUCTS_TABLE} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listProducts(
        limit = 50,
        offset = 0,
        slug = 'all',
        sort = 'newest',
        minPrice = null,
        maxPrice = null
    ) {
        const conn = getConnection()

        let query = `
        SELECT p.*, ${DISCOUNT_CALC_SELECT}
        FROM ${PRODUCTS_TABLE} p
        INNER JOIN ${CATEGORIES_TABLE} c ON p.category_id = c.id
        ${DISCOUNT_JOIN_QUERY}
        `
        const params = []
        const whereClauses = []

        if (slug !== 'all') {
            whereClauses.push(`c.slug = ?`)
            params.push(slug)
        }

        if (minPrice !== null) {
            whereClauses.push(`p.price >= ?`)
            params.push(minPrice)
        }
        if (maxPrice !== null) {
            whereClauses.push(`p.price <= ?`)
            params.push(maxPrice)
        }

        if (whereClauses.length > 0) {
            query += ` WHERE ` + whereClauses.join(' AND ')
        }

        query += ` GROUP BY p.id `

        switch (sort) {
            case 'ocop-3':
                query += ` ORDER BY CASE WHEN p.ocop_rating = 3 THEN 1 WHEN p.ocop_rating = 4 THEN 2 ELSE 3 END, p.id DESC`
                break
            case 'ocop-4':
                query += ` ORDER BY CASE WHEN p.ocop_rating = 4 THEN 1 ELSE 2 END, p.id DESC`
                break
            case 'price-asc':
                query += ` ORDER BY p.price ASC`
                break
            case 'price-desc':
                query += ` ORDER BY p.price DESC`
                break
            case 'rating-asc':
                query += ` ORDER BY (CASE WHEN p.rate_count > 0 THEN p.rate_point_total / p.rate_count ELSE 0 END) ASC, p.rate_count ASC`
                break
            case 'rating-desc':
                query += ` ORDER BY (CASE WHEN p.rate_count > 0 THEN p.rate_point_total / p.rate_count ELSE 0 END) DESC, p.rate_count DESC`
                break
            case 'promotion':
                query += ` AND p.origin_price != 0 ORDER BY p.updated_at DESC`
                break
            case 'newest':
            default:
                query += ` ORDER BY p.created_at DESC`
                break
        }

        query += ` LIMIT ? OFFSET ?`
        params.push(limit, offset)

        const [rows] = await conn.execute(query, params)
        return rows.map(calculateProductPrice)
    },

    async getListProductChatBot({ limit = 150, offset = 0 } = {}) {
        const conn = getConnection()

        const query = `
        SELECT
            p.id AS id,
            p.name AS product_name,
            p.slug AS product_slug,
            p.description AS product_description,
            p.origin_price,
            p.price,
            p.import_price,
            p.buyed,
            p.rate_point_total,
            p.rate_count,
            p.stock_qty,
            p.low_stock_threshold,
            p.last_restock_at,
            p.status AS product_status,
            p.ocop_rating,

            c.name AS category_name,
            c.description AS category_description,

            pi.image_url AS main_image_url,
            
            ${DISCOUNT_CALC_SELECT},
            MAX(d.name) AS discount_name, -- Lấy tượng trưng 1 tên discount
            MAX(d.end_date) AS discount_end_date

        FROM ${PRODUCTS_TABLE} p
        LEFT JOIN ${CATEGORIES_TABLE} c ON p.category_id = c.id
        LEFT JOIN ${PRODUCT_IMAGES_TABLE} pi 
            ON pi.product_id = p.id AND pi.is_main = 1
        ${DISCOUNT_JOIN_QUERY}

        GROUP BY p.id
        LIMIT ? OFFSET ?
    `
        const params = [limit, offset]
        const [rows] = await conn.execute(query, params)

        return rows.map(calculateProductPrice)
    },

    async listPromotionProducts({
        limit = 50,
        offset = 0,
        sort = 'newest',
        minPrice = null,
        maxPrice = null,
    } = {}) {
        const conn = getConnection()
        let query = `
            SELECT p.*, ${DISCOUNT_CALC_SELECT}
            FROM ${PRODUCTS_TABLE} p
            INNER JOIN ${CATEGORIES_TABLE} c ON p.category_id = c.id
            ${DISCOUNT_JOIN_QUERY}
            WHERE p.origin_price != 0
        `
        const params = []

        if (minPrice !== null) {
            query += ` AND p.price >= ?`
            params.push(minPrice)
        }
        if (maxPrice !== null) {
            query += ` AND p.price <= ?`
            params.push(maxPrice)
        }

        query += ` GROUP BY p.id `

        switch (sort) {
            case 'ocop-3':
                query += ` ORDER BY CASE WHEN p.ocop_rating = 3 THEN 1 WHEN p.ocop_rating = 4 THEN 2 ELSE 3 END, p.id DESC`
                break
            case 'ocop-4':
                query += ` ORDER BY CASE WHEN p.ocop_rating = 4 THEN 1 ELSE 2 END, p.id DESC`
                break
            case 'price-asc':
                query += ` ORDER BY p.price ASC`
                break
            case 'price-desc':
                query += ` ORDER BY p.price DESC`
                break
            case 'rating-asc':
                query += ` ORDER BY (CASE WHEN p.rate_count > 0 THEN p.rate_point_total / p.rate_count ELSE 0 END) ASC, p.rate_count ASC`
                break
            case 'rating-desc':
                query += ` ORDER BY (CASE WHEN p.rate_count > 0 THEN p.rate_point_total / p.rate_count ELSE 0 END) DESC, p.rate_count DESC`
                break
            case 'newest':
            default:
                query += ` ORDER BY p.created_at DESC`
                break
        }

        query += ` LIMIT ? OFFSET ?`
        params.push(limit, offset)

        const [rows] = await conn.execute(query, params)
        return rows.map(calculateProductPrice)
    },

    async getProductBySlug(slug) {
        if (!slug) return null
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT p.*, ${DISCOUNT_CALC_SELECT}
            FROM ${PRODUCTS_TABLE} p 
            ${DISCOUNT_JOIN_QUERY}
            WHERE p.slug = ? 
            GROUP BY p.id
            LIMIT 1`,
            [slug]
        )
        return rows.length ? calculateProductPrice(rows[0]) : null
    },

    async getSearchProduct(slug, limit = 10) {
        if (!slug) return []

        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT p.name, p.slug, p.id, p.origin_price, p.price, pi.image_url, ${DISCOUNT_CALC_SELECT}
            FROM ${PRODUCTS_TABLE} p
            LEFT JOIN ${PRODUCT_IMAGES_TABLE} pi ON pi.product_id = p.id AND pi.is_main = 1
            ${DISCOUNT_JOIN_QUERY}
            WHERE p.name LIKE CONCAT('%', ?, '%')
            COLLATE utf8mb4_unicode_ci
            GROUP BY p.id
            ORDER BY p.rate_point_total DESC
            LIMIT ?`,
            [slug, Number(limit)]
        )

        return rows.map(calculateProductPrice)
    },

    async getSearchByCategory(categorySlug, keyword, limit = 10, offset = 0) {
        const conn = getConnection()

        let baseQuery = `
            SELECT p.*, ${DISCOUNT_CALC_SELECT}
            FROM ${PRODUCTS_TABLE} p
            ${DISCOUNT_JOIN_QUERY}
        `
        let whereConditions = [
            `p.name LIKE CONCAT('%', ?, '%') COLLATE utf8mb4_unicode_ci`,
        ]
        let params = [keyword]

        if (categorySlug && categorySlug !== 'all') {
            const [catRows] = await conn.execute(
                `SELECT id FROM ${CATEGORIES_TABLE} WHERE slug = ?`,
                [categorySlug]
            )

            if (catRows.length === 0) return []
            const categoryId = catRows[0].id

            whereConditions.push(`p.category_id = ?`)
            params.push(categoryId)
        }

        const finalQuery = `
            ${baseQuery}
            WHERE ${whereConditions.join(' AND ')}
            GROUP BY p.id
            ORDER BY p.rate_point_total DESC
            LIMIT ? OFFSET ?
        `
        params.push(Number(limit), Number(offset))

        const [rows] = await conn.execute(finalQuery, params)
        return rows.map(calculateProductPrice)
    },

    async getHotProduct(limit = 6) {
        const conn = getConnection()
        try {
            const halfLimit = Math.floor(limit / 2)

            const [hotProducts] = await conn.execute(
                `SELECT 
                    p.*, 
                    SUM(oi.qty_total) AS total_sold,
                    ${DISCOUNT_CALC_SELECT}
                FROM ${PRODUCTS_TABLE} p
                LEFT JOIN ${ORDER_ITEMS_TABLE} oi ON p.id = oi.product_id
                ${DISCOUNT_JOIN_QUERY}
                GROUP BY p.id
                ORDER BY total_sold DESC
                LIMIT ?`,
                [halfLimit]
            )

            const [occopProducts] = await conn.execute(
                `SELECT p.*, ${DISCOUNT_CALC_SELECT}
                FROM ${PRODUCTS_TABLE} p
                ${DISCOUNT_JOIN_QUERY}
                WHERE p.ocop_rating IS NOT NULL
                GROUP BY p.id
                LIMIT ?`,
                [limit - halfLimit]
            )

            return {
                hotProducts: hotProducts.map(calculateProductPrice),
                occopProducts: occopProducts.map(calculateProductPrice),
            }
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm sidebar:', error)
            throw error
        }
    },

    async getRelatedBySlug(slug, limit = 10) {
        if (!slug) return { sameCategory: [], coBought: [] }
        const conn = getConnection()
        try {
            const [productRows] = await conn.execute(
                `SELECT * FROM ${PRODUCTS_TABLE} WHERE slug = ? LIMIT 1`,
                [slug]
            )
            if (!productRows.length) return { sameCategory: [], coBought: [] }
            const product = productRows[0]

            const [categoryRows] = await conn.execute(
                `SELECT p.*, ${DISCOUNT_CALC_SELECT}
                FROM ${PRODUCTS_TABLE} p
                ${DISCOUNT_JOIN_QUERY}
                WHERE p.category_id = ? AND p.slug != ?
                GROUP BY p.id
                ORDER BY p.created_at DESC
                LIMIT ?`,
                [product.category_id, slug, limit]
            )

            const [coBoughtRows] = await conn.execute(
                `SELECT DISTINCT p.*, ${DISCOUNT_CALC_SELECT}
                FROM ${ORDER_ITEMS_TABLE} oi1
                INNER JOIN ${ORDER_ITEMS_TABLE} oi2 
                    ON oi1.transaction_id = oi2.transaction_id 
                    AND oi2.product_id != oi1.product_id
                INNER JOIN ${PRODUCTS_TABLE} p 
                    ON p.id = oi2.product_id
                INNER JOIN ${PRODUCTS_TABLE} target 
                    ON target.id = oi1.product_id
                ${DISCOUNT_JOIN_QUERY}
                WHERE target.slug = ?
                GROUP BY p.id
                LIMIT ?`,
                [slug, limit]
            )

            return {
                sameCategory: categoryRows.map(calculateProductPrice),
                coBought: coBoughtRows.map(calculateProductPrice),
            }
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm liên quan:', error)
            throw error
        }
    },
}

export { PRODUCTS_TABLE, PRODUCTS_SCHEMA, ProductsModel }
