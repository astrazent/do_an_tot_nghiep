import { getConnection } from '../config/mysql.js'

// ✅ Lấy danh sách sản phẩm (có phân trang + tìm kiếm + lọc category)
export const fetchProducts = async ({
    page = 1,
    limit = 10,
    keyword = '',
    categoryId,
}) => {
    const db = getConnection()
    const offset = (page - 1) * limit

    let query = `
        SELECT 
            p.id, 
            p.name, 
            p.description,
            p.origin_price,
            p.price,
            p.buyed,
            p.rate_point_total,
            p.rate_count,
            p.stock_qty,
            p.created_at,
            c.name AS category_name
        FROM Products p
        JOIN Categories c ON p.category_id = c.id
        WHERE 1=1
    `
    const params = []

    if (keyword) {
        query += ` AND p.name LIKE ?`
        params.push(`%${keyword}%`)
    }

    if (categoryId) {
        query += ` AND p.category_id = ?`
        params.push(categoryId)
    }

    query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`
    params.push(Number(limit), Number(offset))

    const [rows] = await db.execute(query, params)
    return rows
}
