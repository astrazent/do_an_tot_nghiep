import { getConnection } from '../config/mysql.js'

// 📝 Thêm comment mới
export const addComment = async (productId, userId, rate, content) => {
    const db = getConnection()

    const [result] = await db.execute(
        `INSERT INTO Comments (product_id, user_id, rate, content) 
         VALUES (?, ?, ?, ?)`,
        [productId, userId, rate, content]
    )

    const [rows] = await db.execute(`SELECT * FROM Comments WHERE id = ?`, [
        result.insertId,
    ])

    // Sau khi thêm comment thì cập nhật Products: rate_point_total + rate_count
    await db.execute(
        `UPDATE Products 
         SET rate_point_total = rate_point_total + ?, 
             rate_count = rate_count + 1 
         WHERE id = ?`,
        [rate, productId]
    )

    return rows[0]
}

// 📝 Lấy danh sách comment theo productId
export const getCommentsByProduct = async productId => {
    const db = getConnection()

    const [rows] = await db.execute(
        `SELECT c.id, c.user_id, c.rate, c.content, c.created_at
         FROM Comments c
         WHERE c.product_id = ?
         ORDER BY c.created_at DESC`,
        [productId]
    )

    return rows
}

// 📝 Lấy thống kê comment (trung bình, tổng số)
export const getCommentStats = async productId => {
    const db = getConnection()

    const [rows] = await db.execute(
        `SELECT 
            ROUND(AVG(rate), 1) AS avg_rate, 
            COUNT(*) AS total_comments
         FROM Comments
         WHERE product_id = ?`,
        [productId]
    )

    return rows[0] || { avg_rate: 0, total_comments: 0 }
}
