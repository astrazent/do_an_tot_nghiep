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
            p.id, p.name, p.slug, p.description, p.origin_price, p.price,
             p.buyed, p.rate_point_total, p.rate_count, p.stock_qty, 
            p.created_at, p.status, p.views,
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
// Các hàm phục vụ trang chi tiết sản phẩm

// ✅ Lấy chi tiết sản phẩm theo slug (JOIN Categories)
export const getProductDetailBySlug = async (slug) => {
    const db = getConnection()
    const [rows] = await db.execute(
        `SELECT
            p.*, 
            c.name AS category_name, 
             -- Đảm bảo xử lý chia cho 0 nếu rate_count = 0
            CASE 
                WHEN p.rate_count > 0 
                THEN (p.rate_point_total / p.rate_count) 
                ELSE 0 
            END AS average_rating
        FROM Products p
        JOIN Categories c ON p.category_id = c.id
        WHERE p.slug = ?`,
        [slug]
    )
    return rows[0] || null
}

// ✅ Lấy hình ảnh liên quan theo product_id
export const getProductImages = async (productId) => {
    const db = getConnection()
    const [rows] = await db.execute(
        // Truy vấn này là OK, chỉ lấy các trường có sẵn trong DB
        `SELECT id, image_url, is_main FROM ProductImages WHERE product_id = ? ORDER BY is_main DESC, updated_at DESC`,
        [productId]
    )
    return rows
}

// ✅ Lấy sản phẩm liên quan (cùng category, loại trừ sản phẩm hiện tại)
export const getRelatedProducts = async (categoryId, currentProductId, limit = 8) => {
    const db = getConnection()
    const [rows] = await db.execute(
        `SELECT 
            p.id, p.name, p.slug, p.price, p.origin_price, p.ocop_rating,
            p.rate_point_total, p.rate_count,
            (
                SELECT image_url 
                FROM ProductImages 
                WHERE product_id = p.id AND is_main = 1 
                ORDER BY updated_at DESC -- Thêm order by nếu có nhiều hình chính
                LIMIT 1
            ) AS main_image_url,
            -- Thêm tính toán rating để frontend tiện sử dụng
            CASE 
                WHEN p.rate_count > 0 
                THEN (p.rate_point_total / p.rate_count) 
                ELSE 0 
            END AS average_rating
        FROM Products p
        WHERE p.category_id = ? AND p.id != ? AND p.status = 1
        ORDER BY p.buyed DESC 
        LIMIT ?`,
        [categoryId, currentProductId, limit]
    )
    return rows
}

// ✅ Tăng lượt xem (views)
export const increaseProductViews = async (slug) => {
    const db = getConnection()
    // Đảm bảo cột 'views' đã tồn tại trong bảng Products
    await db.execute(
        `UPDATE Products SET views = views + 1 WHERE slug = ?`,
        [slug]
    )
}