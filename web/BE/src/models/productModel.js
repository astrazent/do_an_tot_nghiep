import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const PRODUCTS_TABLE = 'Products'
const CATEGORIES_TABLE = 'Categories'
const ORDER_ITEMS_TABLE = 'OrderItems'
const PRODUCT_IMAGES_TABLE = 'ProductImages'
const DISCOUNT_PRODUCTS_TABLE = 'DiscountProducts'
const DISCOUNTS_TABLE = 'Discounts'

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
            `SELECT * FROM ${PRODUCTS_TABLE} WHERE id = ? LIMIT 1`,
            [id]
        )
        return rows.length ? rows[0] : null
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
        SELECT p.*
        FROM ${PRODUCTS_TABLE} p
        INNER JOIN ${CATEGORIES_TABLE} c ON p.category_id = c.id
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

        switch (sort) {
            case 'ocop-3':
                query += ` ORDER BY 
                CASE 
                    WHEN p.ocop_rating = 3 THEN 1
                    WHEN p.ocop_rating = 4 THEN 2
                    ELSE 3
                END, p.id DESC`
                break
            case 'ocop-4':
                query += ` ORDER BY 
                CASE 
                    WHEN p.ocop_rating = 4 THEN 1
                    ELSE 2
                END, p.id DESC`
                break
            case 'price-asc':
                query += ` ORDER BY p.price ASC`
                break
            case 'price-desc':
                query += ` ORDER BY p.price DESC`
                break
            case 'rating-asc':
                query += ` ORDER BY 
                (CASE WHEN p.rate_count > 0 THEN p.rate_point_total / p.rate_count ELSE 0 END) ASC,
                p.rate_count ASC`
                break
            case 'rating-desc':
                query += ` ORDER BY 
                (CASE WHEN p.rate_count > 0 THEN p.rate_point_total / p.rate_count ELSE 0 END) DESC,
                p.rate_count DESC`
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
        return rows
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

            d.name AS discount_name,
            d.description AS discount_description,
            d.value AS discount_value,
            d.start_date AS discount_start_date,
            d.end_date AS discount_end_date,
            d.status AS discount_status

        FROM ${PRODUCTS_TABLE} p
        LEFT JOIN ${CATEGORIES_TABLE} c ON p.category_id = c.id
        LEFT JOIN ${PRODUCT_IMAGES_TABLE} pi 
            ON pi.product_id = p.id AND pi.is_main = 1
        LEFT JOIN ${DISCOUNT_PRODUCTS_TABLE} dp 
            ON dp.product_id = p.id
        LEFT JOIN ${DISCOUNTS_TABLE} d 
            ON dp.discount_id = d.id

        LIMIT ? OFFSET ?
    `
        const params = [limit, offset]
        const [rows] = await conn.execute(query, params)
        return rows
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
        SELECT p.*
        FROM ${PRODUCTS_TABLE} p
        INNER JOIN ${CATEGORIES_TABLE} c ON p.category_id = c.id
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

        switch (sort) {
            case 'ocop-3':
                query += `
                ORDER BY 
                CASE 
                    WHEN p.ocop_rating = 3 THEN 1
                    WHEN p.ocop_rating = 4 THEN 2
                    ELSE 3
                END, p.id DESC
            `
                break
            case 'ocop-4':
                query += `
                ORDER BY 
                CASE 
                    WHEN p.ocop_rating = 4 THEN 1
                    ELSE 2
                END, p.id DESC
            `
                break
            case 'price-asc':
                query += ` ORDER BY p.price ASC`
                break
            case 'price-desc':
                query += ` ORDER BY p.price DESC`
                break
            case 'rating-asc':
                query += `
                ORDER BY 
                (CASE WHEN p.rate_count > 0 THEN p.rate_point_total / p.rate_count ELSE 0 END) ASC,
                p.rate_count ASC
            `
                break
            case 'rating-desc':
                query += `
                ORDER BY 
                (CASE WHEN p.rate_count > 0 THEN p.rate_point_total / p.rate_count ELSE 0 END) DESC,
                p.rate_count DESC
            `
                break
            case 'newest':
            default:
                query += ` ORDER BY p.created_at DESC`
                break
        }

        query += ` LIMIT ? OFFSET ?`
        params.push(limit, offset)

        const [rows] = await conn.execute(query, params)
        return rows
    },

    async getProductBySlug(slug) {
        if (!slug) return null
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${PRODUCTS_TABLE} WHERE slug = ? LIMIT 1`,
            [slug]
        )
        return rows.length ? rows[0] : null
    },

    async getSearchProduct(slug, limit = 10) {
        if (!slug) return []

        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT name, slug, id
            FROM ${PRODUCTS_TABLE}
            WHERE name LIKE CONCAT('%', ?, '%')
            COLLATE utf8mb4_unicode_ci
            ORDER BY rate_point_total DESC
            LIMIT ?`,
            [slug, Number(limit)]
        )

        return rows
    },

    async getSearchByCategory(categorySlug, keyword, limit = 10, offset = 0) {
        if (!categorySlug) return []

        const conn = getConnection()

        const [catRows] = await conn.execute(
            `SELECT id FROM Categories WHERE slug = ?`,
            [categorySlug]
        )

        if (catRows.length === 0) return []

        const categoryId = catRows[0].id

        const [rows] = await conn.execute(
            `SELECT *
        FROM Products
        WHERE category_id = ?
        AND name LIKE CONCAT('%', ?, '%')
        COLLATE utf8mb4_unicode_ci
        ORDER BY rate_point_total DESC
        LIMIT ? OFFSET ?`,
            [categoryId, keyword, Number(limit), Number(offset)]
        )

        return rows
    },

    async getHotProduct(limit = 6) {
        const conn = getConnection()
        try {
            const halfLimit = Math.floor(limit / 2)
            const [hotProducts] = await conn.execute(
                `SELECT 
                p.*, 
                SUM(oi.qty_total) AS total_sold
            FROM ${PRODUCTS_TABLE} p
            LEFT JOIN ${ORDER_ITEMS_TABLE} oi ON p.id = oi.product_id
            GROUP BY p.id
            ORDER BY total_sold DESC
            LIMIT ?`,
                [halfLimit]
            )
            const [occopProducts] = await conn.execute(
                `SELECT *
                FROM ${PRODUCTS_TABLE}
                WHERE ocop_rating IS NOT NULL
                LIMIT ?`,
                [limit - halfLimit]
            )
            return { hotProducts, occopProducts }
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
                `SELECT * FROM ${PRODUCTS_TABLE} 
                WHERE category_id = ? AND slug != ?
                ORDER BY created_at DESC
                LIMIT ?`,
                [product.category_id, slug, limit]
            )

            const [coBoughtRows] = await conn.execute(
                `SELECT DISTINCT p.*
                FROM ${ORDER_ITEMS_TABLE} oi1
                INNER JOIN ${ORDER_ITEMS_TABLE} oi2 
                    ON oi1.transaction_id = oi2.transaction_id 
                    AND oi2.product_id != oi1.product_id
                INNER JOIN ${PRODUCTS_TABLE} p 
                    ON p.id = oi2.product_id
                INNER JOIN ${PRODUCTS_TABLE} target 
                    ON target.id = oi1.product_id
                WHERE target.slug = ?
                LIMIT ?`,
                [slug, limit]
            )

            return { sameCategory: categoryRows, coBought: coBoughtRows }
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm liên quan:', error)
            throw error
        }
    },

    async getInventoryDashboard() {
        const conn = getConnection()

        // Tổng số sản phẩm
        const [[totalProducts]] = await conn.execute(
            `SELECT COUNT(*) AS total FROM Products`
        )

        // Tổng tồn kho (số sản phẩm có tồn kho > 0)
        const [[totalInStock]] = await conn.execute(
            `SELECT COALESCE(SUM(stock_qty), 0) AS total FROM Products`
        )

        // Số sản phẩm dưới ngưỡng cảnh báo
        const [[lowStock]] = await conn.execute(
            `SELECT COUNT(*) AS total 
         FROM Products 
         WHERE stock_qty < low_stock_threshold`
        )

        // Tổng giá trị kho
        const [[inventoryValue]] = await conn.execute(
            `SELECT SUM(stock_qty * import_price) AS total_value 
         FROM Products`
        )

        return {
            totalProducts: totalProducts.total || 0,
            totalInStock: totalInStock.total || 0,
            lowStock: lowStock.total || 0,
            inventoryValue: inventoryValue.total_value || 0,
        }
    },

    async getSoldProductChartByYear(year) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        SELECT 
            DATE_FORMAT(t.created_at, '%m') AS month,
            SUM(oi.qty_total) AS total_sold
        FROM OrderItems oi
        JOIN Transactions t ON t.id = oi.transaction_id
        WHERE t.status = 'completed'
          AND YEAR(t.created_at) = ?
        GROUP BY month
        ORDER BY month;
        `,
            [year]
        )

        return rows
    },

    async getProductStockByCategory() {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        SELECT 
            c.name AS category_name,
            COALESCE(SUM(p.stock_qty), 0) AS total_stock
        FROM Categories c
        LEFT JOIN Products p ON p.category_id = c.id
        GROUP BY c.id, c.name
        HAVING total_stock > 0
        ORDER BY total_stock DESC;
        `
        )

        // Tính tổng số lượng sản phẩm trong kho để ra phần trăm
        const grandTotal = rows.reduce(
            (sum, row) => sum + Number(row.total_stock),
            0
        )

        const result = rows.map(row => ({
            category_name: row.category_name,
            total_stock: Number(row.total_stock),
            percentage:
                grandTotal > 0
                    ? Math.round((Number(row.total_stock) / grandTotal) * 100)
                    : 0,
        }))

        return result
    },

    async getUnsoldProductsThisMonth() {
        const conn = getConnection()

        const [rows] = await conn.execute(`
        SELECT 
            p.id,
            p.name,
            p.stock_qty AS stock,
            p.price,
            c.name AS category_name,
            -- Ngày bán cuối cùng từ TOÀN BỘ LỊCH SỬ (không filter tháng)
            COALESCE(MAX(t_all.created_at), NULL) AS last_sold_date
        FROM Products p
        LEFT JOIN Categories c ON c.id = p.category_id
        -- Subquery: Kiểm tra sản phẩm CÓ BÁN trong tháng này không
        LEFT JOIN (
            SELECT DISTINCT oi.product_id
            FROM OrderItems oi
            JOIN Transactions t ON t.id = oi.transaction_id 
                AND t.status = 'completed'
                AND YEAR(t.created_at) = YEAR(CURDATE())
                AND MONTH(t.created_at) = MONTH(CURDATE())
        ) recent_sales ON recent_sales.product_id = p.id
        -- LEFT JOIN lấy ngày bán cuối từ toàn bộ (cho "Chưa từng bán" = NULL)
        LEFT JOIN OrderItems oi_all ON oi_all.product_id = p.id
        LEFT JOIN Transactions t_all ON t_all.id = oi_all.transaction_id 
            AND t_all.status = 'completed'
        WHERE p.stock_qty > 0  -- Còn hàng trong kho
          AND recent_sales.product_id IS NULL  -- KHÔNG có đơn trong tháng này
        GROUP BY p.id, p.name, p.stock_qty, p.price, c.name
        ORDER BY p.stock_qty DESC, p.name ASC  -- Tồn nhiều nhất lên đầu
    `)

        // Tính số ngày chưa bán (từ last_sold_date toàn bộ lịch sử)
        const result = rows.map(row => {
            let daysUnsold = 0
            let lastSoldDateStr = null

            if (row.last_sold_date) {
                const lastSold = new Date(row.last_sold_date)
                daysUnsold = Math.ceil(
                    (new Date() - lastSold) / (1000 * 60 * 60 * 24)
                )
                lastSoldDateStr = lastSold.toLocaleDateString('vi-VN')
            } else {
                // Chưa từng bán → tính từ ngày tạo sản phẩm
                const createdAt = new Date(row.created_at || Date.now())
                daysUnsold = Math.ceil(
                    (new Date() - createdAt) / (1000 * 60 * 60 * 24)
                )
                lastSoldDateStr = 'Chưa từng bán'
            }

            return {
                id: row.id,
                name: row.name,
                category: row.category_name || 'Chưa phân loại',
                stock: Number(row.stock),
                price: Number(row.price),
                lastSoldDate: lastSoldDateStr,
                daysUnsold: daysUnsold,
            }
        })

        return result
    },
    async getTop5Customers() {
        const conn = getConnection()

        const [rows] = await conn.execute(`
        SELECT 
            u.id,
            u.full_name AS name,
            COALESCE(SUM(oi.qty_total), 0) AS total_quantity
        FROM Users u
        LEFT JOIN Transactions t ON t.user_id = u.id 
            AND t.status = 'completed'
        LEFT JOIN OrderItems oi ON oi.transaction_id = t.id
        WHERE u.full_name IS NOT NULL 
          AND u.full_name != ''
          AND u.email NOT LIKE '%@admin.com'  -- loại bỏ tài khoản admin/test nếu cần
        GROUP BY u.id, u.full_name
        HAVING total_quantity > 0
        ORDER BY total_quantity DESC
        LIMIT 5
    `)

        return rows.map(row => ({
            id: row.id,
            name: row.name || 'Khách lẻ',
            value: Number(row.total_quantity),
        }))
    },
}

export { PRODUCTS_TABLE, PRODUCTS_SCHEMA, ProductsModel }
