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
    async getTotalProductsSold() {
        const conn = getConnection()

        const [rows] = await conn.execute(`
        SELECT 
            COALESCE(SUM(qty_total), 0) AS total_sold
        FROM OrderItems
    `)

        return rows[0]
    },

    async getTotalUsers() {
        const conn = getConnection()

        const [rows] = await conn.execute(`
        SELECT 
            COUNT(id) AS total_users
        FROM Users
    `)

        return rows[0]
    },

    async getTotalStock() {
        const conn = getConnection()

        const [result] = await conn.execute(
            `SELECT COALESCE(SUM(stock_qty), 0) AS total_stock FROM Products`
        )

        return { total_stock: result[0].total_stock }
    },

    async getMonthlyRevenue(data) {
        const { month, year } = data

        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        SELECT 
            COALESCE(SUM(amount), 0) AS total_revenue
        FROM Transactions
        WHERE shipment_status = 'delivered'
          AND MONTH(delivered_at) = ?
          AND YEAR(delivered_at) = ?
    `,
            [month, year]
        )

        return { month, year, total_revenue: rows[0].total_revenue }
    },

    async getTopCustomers() {
        const conn = getConnection()

        const [rows] = await conn.execute(`
        SELECT 
            u.full_name AS customer_name,
            COUNT(t.id) AS total_orders
        FROM Transactions t
        JOIN Users u ON t.user_id = u.id
        GROUP BY u.id, u.full_name
        ORDER BY total_orders DESC
        LIMIT 6
    `)

        return rows
    },

    async getBestSellingProduct() {
        const conn = getConnection()

        const [rows] = await conn.execute(`
        SELECT 
            p.id AS product_id,
            p.name AS product_name,
            SUM(oi.qty_total) AS total_sold,
            COUNT(DISTINCT t.user_id) AS total_buyers
        FROM OrderItems oi
        JOIN Products p ON oi.product_id = p.id
        JOIN Transactions t ON oi.transaction_id = t.id
        WHERE t.shipment_status = 'delivered'
        GROUP BY p.id, p.name
        ORDER BY total_sold DESC
        LIMIT 1
    `)

        return rows[0] || null
    },

    async getOrderCountByStatus() {
        const conn = getConnection()

        const [rows] = await conn.execute(`
        SELECT 
            status,
            COUNT(*) AS total_orders
        FROM Transactions
        GROUP BY status
        ORDER BY status ASC
    `)

        // Ánh xạ trạng thái
        const statusMap = {
            0: 'pending (chờ xử lý)',
            1: 'confirmed (đã xác nhận)',
            2: 'canceled (đã bị huỷ)',
            3: 'refunded (hoàn tiền)',
            4: 'completed (hoàn tất đơn hàng)',
        }

        const result = rows.map(r => ({
            status_code: r.status,
            status_name: statusMap[r.status] || 'unknown',
            total_orders: r.total_orders,
        }))

        return result
    },

    async getNewUsersByMonths() {
        const months = 7

        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        SELECT 
            DATE_FORMAT(created_at, '%Y-%m') AS month,
            COUNT(*) AS total_new_users
        FROM Users
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month ASC
    `,
            [months]
        )

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
            p.METHOD AS payment_method,
            COALESCE(SUM(t.amount), 0) AS total_revenue
        FROM Transactions t
        JOIN Payments p ON t.payment_id = p.id
        WHERE t.shipment_status = 'delivered'
        GROUP BY p.METHOD
        ORDER BY total_revenue DESC
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
        ORDER BY total_revenue DESC
    `)

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
