import { getConnection } from '../config/mysql.js'

// Thêm bình luận mới
export const addComment = async (productId, userId, rate, content) => {
    const db = getConnection()

    const [result] = await db.execute(
        `INSERT INTO Comments (product_id, user_id, rate, content)
         VALUES (?, ?, ?, ?)`,
        [productId, userId, rate, content]
    )

    return { id: result.insertId, productId, userId, rate, content }
}

// Lấy tất cả comment theo product
export const getCommentsByProduct = async productId => {
    const db = getConnection()

    const [rows] = await db.execute(
        `SELECT c.id, c.rate, c.content, c.created_at,
                u.full_name AS user_name, u.avatar_url
         FROM Comments c
         JOIN Users u ON c.user_id = u.id
         WHERE c.product_id = ?
         ORDER BY c.created_at DESC`,
        [productId]
    )

    return rows
}

// Tính trung bình rating + tổng số bình luận
export const getCommentStats = async productId => {
    const db = getConnection()

    const [rows] = await db.execute(
        `SELECT AVG(rate) AS avg_rate, COUNT(*) AS total_comments
         FROM Comments
         WHERE product_id = ?`,
        [productId]
    )

    return rows[0]
}
