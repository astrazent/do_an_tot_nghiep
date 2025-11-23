import { getConnection } from '../config/mysql.js'

const RevenueModel = {
    async getRevenueAnalysisKPIs({ startDate, endDate }) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        WITH date_range AS (
            SELECT 
                CAST(? AS DATETIME) AS start_date,
                CAST(? AS DATETIME) AS end_date,
                TIMESTAMPDIFF(DAY, CAST(? AS DATETIME), CAST(? AS DATETIME)) AS diff_days
        ),

        previous_range AS (
            SELECT
                DATE_SUB((SELECT start_date FROM date_range), INTERVAL (SELECT diff_days FROM date_range) + 1 DAY) AS prev_start,
                DATE_SUB((SELECT end_date FROM date_range), INTERVAL (SELECT diff_days FROM date_range) + 1 DAY) AS prev_end
        ),

        current_period AS (
            SELECT 
                t.id AS transaction_id,
                (t.amount - t.shipping_fee) AS revenue,
                SUM(oi.qty_total * p.import_price) AS cost
            FROM Transactions t
            JOIN OrderItems oi ON t.id = oi.transaction_id
            JOIN Products p ON oi.product_id = p.id
            JOIN date_range dr
            WHERE t.status = 'completed'
            AND t.updated_at BETWEEN dr.start_date AND dr.end_date
            GROUP BY t.id
        ),

        previous_period AS (
            SELECT 
                t.id AS transaction_id,
                (t.amount - t.shipping_fee) AS revenue,
                SUM(oi.qty_total * p.import_price) AS cost
            FROM Transactions t
            JOIN OrderItems oi ON t.id = oi.transaction_id
            JOIN Products p ON oi.product_id = p.id
            JOIN previous_range pr
            WHERE t.status = 'completed'
            AND t.updated_at BETWEEN pr.prev_start AND pr.prev_end
            GROUP BY t.id
        )

        SELECT
            -- 1. Gross Profit
            COALESCE(SUM(c.revenue - c.cost), 0) AS gross_profit,

            -- 2. Profit Margin
            CASE 
                WHEN SUM(c.revenue) = 0 THEN 0
                ELSE ROUND((SUM(c.revenue - c.cost) / SUM(c.revenue)) * 100, 2)
            END AS profit_margin,

            -- 3. Average Order Revenue
            CASE 
                WHEN COUNT(c.transaction_id) = 0 THEN 0
                ELSE ROUND(SUM(c.revenue) / COUNT(c.transaction_id), 2)
            END AS avg_order_revenue,

            -- 4. Revenue Growth Rate
            CASE 
                WHEN COALESCE((SELECT SUM(revenue) FROM previous_period), 0) = 0 THEN 0
                ELSE ROUND(
                    (
                        SUM(c.revenue) - (SELECT SUM(revenue) FROM previous_period)
                    ) / (SELECT SUM(revenue) FROM previous_period) * 100,
                    2
                )
            END AS revenue_growth_rate

        FROM current_period c;

        `,
            [startDate, endDate, startDate, endDate]
        )

        return rows[0]
    },

    async getYearRevenueAndOrders({ year }) {
        const conn = getConnection()

        const targetYear = year || new Date().getFullYear()

        const [rows] = await conn.execute(
            `
        WITH months AS (
            SELECT 1 AS m UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6
            UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
        )
        SELECT
            m AS month,
            COALESCE(SUM(t.amount - t.shipping_fee), 0) AS total_revenue,
            COALESCE(COUNT(t.id), 0) AS total_orders
        FROM months
        LEFT JOIN Transactions t
            ON MONTH(t.updated_at) = m
           AND YEAR(t.updated_at) = ?
           AND t.status = 'completed'
        GROUP BY m
        ORDER BY m;
        `,
            [targetYear]
        )

        return rows
    },

    async getNewVsReturningRevenue({ startDate, endDate }) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        WITH user_order_count AS (
            SELECT 
                t.user_id,
                COUNT(t.id) AS order_count,
                SUM(t.amount) AS total_amount
            FROM Transactions t
            WHERE t.status = 'completed'
              AND t.created_at BETWEEN ? AND ?
            GROUP BY t.user_id
        )

        SELECT
            SUM(CASE WHEN order_count = 1 THEN total_amount ELSE 0 END)
                AS new_customer_revenue,

            SUM(CASE WHEN order_count >= 2 THEN total_amount ELSE 0 END)
                AS returning_customer_revenue

        FROM user_order_count;
        `,
            [startDate, endDate]
        )

        return rows[0]
    },

    async getRevenueByCategory({ startDate, endDate }) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        SELECT
            c.id   AS category_id,
            c.name AS category_name,
            COALESCE(SUM(oi.amount_total), 0) AS total_revenue
        FROM Categories c
        LEFT JOIN Products p 
            ON p.category_id = c.id
        LEFT JOIN OrderItems oi 
            ON oi.product_id = p.id
        LEFT JOIN Transactions t 
            ON t.id = oi.transaction_id
        WHERE t.status = 'completed'
          AND t.updated_at BETWEEN ? AND ?
        GROUP BY c.id, c.name
        ORDER BY total_revenue DESC;
        `,
            [startDate, endDate]
        )

        return rows
    },

    async getProductRevenueList({ startDate, endDate }) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        WITH product_sales AS (
            SELECT
                p.id AS product_id,
                p.name AS product_name,
                c.name AS category_name,
                COALESCE(SUM(oi.qty_total), 0) AS total_sold,
                COALESCE(SUM(oi.amount_total), 0) AS total_revenue
            FROM Products p
            LEFT JOIN Categories c ON c.id = p.category_id
            LEFT JOIN OrderItems oi ON oi.product_id = p.id
            LEFT JOIN Transactions t ON t.id = oi.transaction_id
            WHERE t.status = 'completed'
              AND t.updated_at BETWEEN ? AND ?
            GROUP BY p.id, p.name, c.name
        ),
        total_revenue_all AS (
            SELECT SUM(total_revenue) AS total_revenue_sum
            FROM product_sales
        )
        SELECT
            ps.product_id,
            ps.product_name,
            ps.category_name,
            ps.total_sold,
            ps.total_revenue,
            ROUND(
                (ps.total_revenue / NULLIF(tra.total_revenue_sum, 0)) * 100,
                2
            ) AS contribution_percent
        FROM product_sales ps
        CROSS JOIN total_revenue_all tra
        ORDER BY ps.total_revenue DESC;
        `,
            [startDate, endDate]
        )

        return rows
    },

    async getRevenueByPaymentMethod({ startDate, endDate }) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        WITH payment_sales AS (
            SELECT 
                p.id AS payment_id,
                p.method AS payment_method,
                COALESCE(SUM(t.amount), 0) AS total_revenue
            FROM Payments p
            LEFT JOIN Transactions t 
                ON t.payment_id = p.id
                AND t.status = 'completed'
                AND t.updated_at BETWEEN ? AND ?
            GROUP BY p.id, p.method
        ),
        total_revenue_all AS (
            SELECT SUM(total_revenue) AS total_sum
            FROM payment_sales
        )
        SELECT
            ps.payment_id,
            ps.payment_method,
            ps.total_revenue,
            ROUND((ps.total_revenue / NULLIF(tra.total_sum, 0)) * 100, 2) AS percent
        FROM payment_sales ps
        CROSS JOIN total_revenue_all tra
        ORDER BY ps.total_revenue DESC;
        `,
            [startDate, endDate]
        )

        return rows
    },

    async getRevenueByShipmentMethod({ startDate, endDate }) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `
        WITH shipment_sales AS (
            SELECT
                s.id   AS shipment_id,
                s.name AS shipment_name,
                COALESCE(SUM(t.amount), 0) AS total_revenue
            FROM Shipments s
            LEFT JOIN Transactions t
                ON t.shipment_id = s.id
               AND t.status = 'completed'
               AND t.updated_at BETWEEN ? AND ?
            GROUP BY s.id, s.name
        ),
        total_revenue_all AS (
            SELECT SUM(total_revenue) AS total_sum
            FROM shipment_sales
        )
        SELECT
            ss.shipment_id,
            ss.shipment_name,
            ss.total_revenue,
            ROUND(
                (ss.total_revenue / NULLIF(tra.total_sum, 0)) * 100,
                2
            ) AS percent
        FROM shipment_sales ss
        CROSS JOIN total_revenue_all tra
        ORDER BY ss.total_revenue DESC;
        `,
            [startDate, endDate]
        )

        return rows
    },
}

export { RevenueModel }
