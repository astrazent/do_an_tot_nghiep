import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const BOARDS_TABLE_NAME = 'Boards'

// Schema validate dữ liệu board
const BOARDS_SCHEMA = Joi.object({
    title: Joi.string().min(3).max(255).required().messages({
        'string.empty': 'Title không được để trống',
        'string.min': 'Title tối thiểu 3 ký tự',
        'string.max': 'Title tối đa 255 ký tự',
    }),
    slug: Joi.string().max(255).required().messages({
        'string.empty': 'Slug không được để trống',
        'string.max': 'Slug tối đa 255 ký tự',
    }),
})

const BoardsModel = {
    async getTotalProductsSold({ startDate, endDate }) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `
            SELECT COALESCE(SUM(oi.qty_total), 0) AS total_sold
            FROM OrderItems oi
            JOIN Transactions t ON oi.transaction_id = t.id
            WHERE t.created_at BETWEEN ? AND ?
            `,
            [startDate, endDate]
        )
        return rows[0]
    },

    /** ===============================
     * 2. TOTAL USERS (FILTER)
     * =============================== */
    async getTotalUsers({ startDate, endDate }) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `
            SELECT COUNT(id) AS total_users
            FROM Users
            WHERE created_at BETWEEN ? AND ?
        `,
            [startDate, endDate]
        )
        return rows[0]
    },

    /** ===============================
     * 3. TOTAL STOCK (NO FILTER)
     * =============================== */
    async getTotalStock() {
        const conn = getConnection()
        const [rows] = await conn.execute(`
            SELECT COALESCE(SUM(stock_qty), 0) AS total_stock
            FROM Products
        `)
        return rows[0]
    },

    /** ===============================
     * 4. MONTHLY REVENUE (FILTER)
     * =============================== */
    async getMonthlyRevenue({ startDate, endDate }) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `
        SELECT COALESCE(SUM(amount) - SUM(shipping_fee), 0) AS total_revenue
        FROM Transactions
        WHERE status = 'completed'
          AND updated_at BETWEEN ? AND ?
        `,
            [startDate, endDate]
        )
        return rows[0]
    },

    /** ===============================
     * 5. TOP BUYING CUSTOMERS (FILTER)
     * =============================== */
    async getTopCustomers({ startDate, endDate }) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        SELECT 
            u.full_name AS customer_name,
            COUNT(t.id) AS total_orders
        FROM Transactions t
        JOIN Users u ON t.user_id = u.id
        WHERE t.created_at BETWEEN ? AND ?
        GROUP BY u.id, u.full_name
        ORDER BY total_orders DESC
        LIMIT 6
        `,
            [startDate, endDate]
        )

        return rows
    },

    async getYearRevenue() {
        const conn = getConnection()

        const [rows] = await conn.execute(`
            WITH months AS (
                SELECT 1 AS m UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6
                UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
            )
            SELECT 
                m AS month,
                COALESCE(SUM(t.amount), 0) AS total_revenue
            FROM months
            LEFT JOIN Transactions t 
                ON MONTH(t.updated_at) = m
                AND YEAR(t.updated_at) = YEAR(CURDATE())
                AND t.status = 'completed'
            GROUP BY m
            ORDER BY m;
        `)

        return rows
    },

    async getFinancialData({ startDate, endDate }) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        WITH order_data AS (
            SELECT 
                t.id AS transaction_id,
                oi.product_id,
                oi.qty_total,
                oi.amount_total,
                p.import_price,
                t.created_at
            FROM Transactions t
            JOIN OrderItems oi ON t.id = oi.transaction_id
            JOIN Products p ON oi.product_id = p.id
            WHERE t.status = 'completed'
            AND t.created_at BETWEEN ? AND ?
        )

        SELECT
            -- Lợi nhuận gộp
            COALESCE(SUM(od.amount_total) - SUM(od.import_price * od.qty_total), 0) AS gross_profit,

            -- Tổng chi phí
            COALESCE(SUM(od.import_price * od.qty_total), 0) AS total_cost,

            -- Đơn hàng trung bình
            COALESCE(SUM(od.qty_total) / COUNT(DISTINCT od.transaction_id), 0) AS avg_order_value,

            -- Tổng đơn hàng
            COUNT(DISTINCT od.transaction_id) AS total_orders

        FROM order_data od
    `,
            [startDate, endDate]
        )

        return rows
    },

    /** ==========================================
     * 6. BEST SELLING PRODUCT (FILTER)
     * ========================================== */
    async getBestSellingProduct({ startDate, endDate }) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        SELECT 
            p.id AS product_id,
            p.name AS product_name,
            SUM(oi.qty_total) AS total_sold,
            COUNT(DISTINCT t.user_id) AS total_buyers
        FROM OrderItems oi
        JOIN Products p ON oi.product_id = p.id
        JOIN Transactions t ON oi.transaction_id = t.id
        WHERE t.status = 'completed'
          AND t.updated_at BETWEEN ? AND ?
        GROUP BY p.id, p.name
        ORDER BY total_sold DESC
        LIMIT 1
        `,
            [startDate, endDate]
        )

        return rows[0] || null
    },

    /** ==========================================
     * 7. ORDER COUNT BY STATUS (FILTER)
     * ========================================== */
    async getOrderCountByStatus({ startDate, endDate }) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        SELECT 
            status,
            COUNT(*) AS total_orders
        FROM Transactions
        WHERE created_at BETWEEN ? AND ?
        GROUP BY status
        ORDER BY status ASC
        `,
            [startDate, endDate]
        )

        const statusMap = {
            0: 'pending (chờ xử lý)',
            1: 'confirmed (đã xác nhận)',
            2: 'canceled (đã huỷ)',
            3: 'refunded (hoàn tiền)',
            4: 'completed (xong đơn)',
        }

        return rows.map(r => ({
            status_code: r.status,
            total_orders: r.total_orders,
        }))
    },

    /** ===============================
     * OTHER FUNCTIONS — KEEP ORIGINAL
     * =============================== */

    async getNewUsersByMonths() {
        const conn = getConnection()

        const [rows] = await conn.execute(`
            SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
                COUNT(*) AS total_new_users
            FROM Users
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
                AND created_at <= CURDATE()
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month ASC
        `)
        return rows
    },

    async getRevenueByCategory() {
        const conn = getConnection()
        const [rows] = await conn.execute(`
            SELECT 
                c.id AS category_id,
                c.name AS category_name,
                COALESCE(SUM(oi.amount_total), 0) AS total_revenue
            FROM OrderItems oi
            JOIN Products p ON oi.product_id = p.id
            JOIN Categories c ON p.category_id = c.id
            JOIN Transactions t ON oi.transaction_id = t.id
            WHERE t.shipment_status = 'delivered'
            GROUP BY c.id, c.name
            ORDER BY total_revenue DESC
        `)
        return rows
    },

    async getRevenueByPaymentMethod() {
        const conn = getConnection()
        const [rows] = await conn.execute(`
            SELECT 
                p.method AS payment_method,
                COALESCE(SUM(t.amount), 0) AS total_revenue
            FROM Transactions t
            JOIN Payments p ON t.payment_id = p.id
            WHERE t.shipment_status = 'delivered'
            GROUP BY p.method
        `)
        return rows
    },

    async getRevenueByShipmentMethod() {
        const conn = getConnection()
        const [rows] = await conn.execute(`
            SELECT 
                s.name AS shipment_method,
                COALESCE(SUM(t.amount), 0) AS total_revenue
            FROM Transactions t
            JOIN Shipments s ON t.shipment_id = s.id
            WHERE t.shipment_status = 'delivered'
            GROUP BY s.id, s.name
        `)
        return rows
    },

    async getCancelRefundRate({ startDate, endDate }) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        WITH orders AS (
            SELECT id, status
            FROM Transactions
            WHERE updated_at BETWEEN ? AND ?
        )
        SELECT 
            ROUND(
                (
                    (SELECT COUNT(*) FROM orders WHERE status = 'canceled') +
                    (SELECT COUNT(*) FROM orders WHERE status = 'refunded')
                )
                /
                (SELECT COUNT(*) FROM orders) * 100
            , 2) AS cancel_refund_rate;
    `,
            [startDate, endDate]
        )

        return rows[0]
    },

    async getOrderConversionRate({ startDate, endDate }) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        WITH orders AS (
            SELECT id, status
            FROM Transactions
            WHERE updated_at BETWEEN ? AND ?
        )
        SELECT 
            ROUND(
                (
                    SELECT COUNT(*) 
                    FROM orders 
                    WHERE status = 'completed'
                )
                /
                (
                    SELECT COUNT(*) 
                    FROM orders
                ) * 100
            , 2) AS order_conversion_rate;
    `,
            [startDate, endDate]
        )

        return rows[0]
    },

    async getCustomerConversionRate({ startDate, endDate }) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        WITH customers_with_orders AS (
            SELECT DISTINCT user_id
            FROM Transactions
            WHERE status = 'completed'
              AND updated_at BETWEEN ? AND ?
        )
        SELECT 
            ROUND(
                (SELECT COUNT(*) FROM customers_with_orders) 
                /
                (SELECT COUNT(*) FROM Users) * 100
            , 2) AS customer_conversion_rate;
    `,
            [startDate, endDate]
        )

        return rows[0]
    },

    async getReturningCustomerRate({ startDate, endDate }) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        WITH customer_orders AS (
            SELECT 
                user_id,
                COUNT(id) AS order_count
            FROM Transactions
            WHERE status = 'completed'
              AND updated_at BETWEEN ? AND ?
            GROUP BY user_id
        )
        SELECT 
            ROUND(
                (
                    SELECT COUNT(*) 
                    FROM customer_orders 
                    WHERE order_count >= 2
                ) 
                /
                (
                    SELECT COUNT(*) 
                    FROM customer_orders
                ) * 100
            , 2) AS returning_customer_rate;
    `,
            [startDate, endDate]
        )

        return rows[0]
    },

    async getRevenueByLocation({ startDate, endDate }) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        SELECT 
            t.deli_city AS city,
            ROUND(SUM(t.amount - t.shipping_fee) / 1000000, 1) AS total_revenue_million
        FROM Transactions t
        WHERE 
            t.status = 'completed'
            AND t.updated_at BETWEEN ? AND ?
        GROUP BY t.deli_city
        ORDER BY total_revenue_million DESC;
        `,
            [startDate, endDate]
        )

        return rows
    },

    async createBoard(data) {
        const { error, value } = BOARDS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${BOARDS_TABLE_NAME} (title, slug) VALUES (?, ?)`,
            [value.title, value.slug]
        )

        return { board_id: result.insertId, ...value }
    },

    async getBoardById(board_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${BOARDS_TABLE_NAME} WHERE board_id = ?`,
            [board_id]
        )
        return rows[0] || null
    },

    async updateBoard(board_id, data) {
        const schema = BOARDS_SCHEMA.fork(
            Object.keys(BOARDS_SCHEMA.describe().keys),
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
            `UPDATE ${BOARDS_TABLE_NAME} SET ${setClause} WHERE board_id = ?`,
            [...values, board_id]
        )

        return this.getBoardById(board_id)
    },

    async deleteBoard(board_id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${BOARDS_TABLE_NAME} WHERE board_id = ?`,
            [board_id]
        )
        return result.affectedRows > 0
    },

    async listBoards(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${BOARDS_TABLE_NAME} ORDER BY board_id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },
}

export { BOARDS_TABLE_NAME, BOARDS_SCHEMA, BoardsModel }
