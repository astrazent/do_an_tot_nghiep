import { getConnection } from '../config/mysql.js'

export const getOrderById = async transactionId => {
    try {
        const db = getConnection() // Nếu connection chưa được tạo, sẽ throw

        // Lấy thông tin transaction + sản phẩm đầu tiên trong order
        const [transactionRows] = await db.execute(
            `SELECT 
                oi.id AS order_item_id,
                oi.qty_total,
                oi.amount_total,
                p.name AS product_name,
                p.origin_price,
                p.price
             FROM OrderItems oi
             JOIN Products p ON oi.product_id = p.id
             WHERE oi.transaction_id = ?`,
            [transactionId]
        )

        if (transactionRows.length === 0) {
            return null // Không tìm thấy transaction
        }

        const transaction = transactionRows[0]

        // Lấy toàn bộ danh sách sản phẩm trong order
        const [items] = await db.execute(
            `SELECT 
                oi.id AS order_item_id, 
                oi.qty_total, 
                oi.amount_total, 
                p.name AS product_name, 
                p.origin_price,
                p.price
             FROM OrderItems oi
             JOIN Products p ON oi.product_id = p.id
             WHERE oi.transaction_id = ?`,
            [transactionId]
        )

        return {
            ...transaction,
            items,
        }
    } catch (error) {
        console.error('Error in getOrderById:', error)
        throw error
    }
}
