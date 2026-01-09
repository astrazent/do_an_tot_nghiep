import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const COMMENTS_TABLE = 'Comments'
const USERS_TABLE = 'Users'
const PRODUCTS_TABLE = 'Products'
const COMMENTIMAGES_TABLE = 'CommentImages'

const COMMENTS_SCHEMA = Joi.object({
    rate: Joi.number().integer().min(1).max(5).required().messages({
        'number.base': 'Rate phải là số',
        'number.min': 'Rate tối thiểu 1',
        'number.max': 'Rate tối đa 5',
        'any.required': 'Rate là bắt buộc',
    }),
    content: Joi.string().min(1).required().messages({
        'string.empty': 'Content không được để trống',
        'any.required': 'Content là bắt buộc',
    }),
    product_id: Joi.number().integer().required().messages({
        'number.base': 'Product ID phải là số',
        'any.required': 'Product ID là bắt buộc',
    }),
    user_id: Joi.number().integer().required().messages({
        'number.base': 'User ID phải là số',
        'any.required': 'User ID là bắt buộc',
    }),
    likes: Joi.number().integer().min(0).default(0).messages({
        'number.base': 'Likes phải là số',
        'number.min': 'Likes không thể âm',
    }),
    dislikes: Joi.number().integer().min(0).default(0).messages({
        'number.base': 'Dislikes phải là số',
        'number.min': 'Dislikes không thể âm',
    }),
    images: Joi.array()
        .items(
            Joi.string().uri().messages({
                'string.uri': 'Mỗi phần tử trong images phải là URL hợp lệ',
                'string.base': 'Mỗi phần tử trong images phải là chuỗi',
            })
        )
        .default([]),
})

const CommentsModel = {
    async createComment(data) {
        const { error, value } = COMMENTS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error
        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${COMMENTS_TABLE} (rate, content, product_id, user_id) VALUES (?, ?, ?, ?)`,
            [value.rate, value.content, value.product_id, value.user_id]
        )
        const commentId = result.insertId
        if (
            data.images &&
            Array.isArray(data.images) &&
            data.images.length > 0
        ) {
            const insertImagesQuery = `INSERT INTO ${COMMENTIMAGES_TABLE} (comment_id, image_url) VALUES ?`
            const imagesValues = data.images.map(url => [commentId, url])

            await conn.query(insertImagesQuery, [imagesValues])
        }
        return {
            id: commentId,
            ...value,
            images: data.images || [],
        }
    },

    async createCommentByUserAndProduct(data) {
        const { error, value } = COMMENTS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()

        await conn.beginTransaction()

        try {
            const [result] = await conn.execute(
                `INSERT INTO ${COMMENTS_TABLE} (rate, content, product_id, user_id)
                VALUES (?, ?, ?, ?)`,
                [value.rate, value.content, value.product_id, value.user_id]
            )

            const commentId = result.insertId

            if (
                data.images &&
                Array.isArray(data.images) &&
                data.images.length > 0
            ) {
                const insertImagesQuery = `
                INSERT INTO ${COMMENTIMAGES_TABLE} (comment_id, image_url)
                VALUES ?
            `
                const imagesValues = data.images.map(url => [commentId, url])
                await conn.query(insertImagesQuery, [imagesValues])
            }

            await conn.execute(
                `UPDATE ${PRODUCTS_TABLE}
                SET rate_point_total = rate_point_total + ?,
                    rate_count = rate_count + 1
                WHERE id = ?`,
                [value.rate, value.product_id]
            )

            await conn.commit()

            return {
                id: commentId,
                ...value,
                images: data.images || [],
            }
        } catch (err) {
            await conn.rollback()
            throw err
        }
    },

    async getCommentById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENTS_TABLE} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async updateCommentByUserAndProduct(user_id, product_id, data) {
        const conn = getConnection()
        const { content, rate, newImages, keep_image_ids } = data

        try {
            const [result] = await conn.execute(
                `UPDATE ${COMMENTS_TABLE}
                SET content = ?, rate = ?, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ? AND product_id = ?`,
                [content, rate, user_id, product_id]
            )

            if (result.affectedRows === 0) return false

            const [rows] = await conn.execute(
                `SELECT id FROM ${COMMENTS_TABLE} WHERE user_id = ? AND product_id = ?`,
                [user_id, product_id]
            )

            const commentId = rows[0]?.id
            if (!commentId) return false

            if (!Array.isArray(keep_image_ids) || keep_image_ids.length === 0) {
                await conn.execute(
                    `DELETE FROM ${COMMENTIMAGES_TABLE} WHERE comment_id = ?`,
                    [commentId]
                )
            } else {
                const placeholders = keep_image_ids.map(() => '?').join(',')
                await conn.execute(
                    `DELETE FROM ${COMMENTIMAGES_TABLE}
                    WHERE comment_id = ?
                    AND id NOT IN (${placeholders})`,
                    [commentId, ...keep_image_ids]
                )
            }

            if (newImages && newImages.length > 0) {
                const imageValues = newImages.map(url => [commentId, url])
                await conn.query(
                    `INSERT INTO ${COMMENTIMAGES_TABLE} (comment_id, image_url) VALUES ?`,
                    [imageValues]
                )
            }

            return true
        } catch (error) {
            throw error
        }
    },

    async updateComment(id, data) {
        const schema = COMMENTS_SCHEMA.fork(
            Object.keys(COMMENTS_SCHEMA.describe().keys),
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
            `UPDATE ${COMMENTS_TABLE} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [...values, id]
        )

        return this.getCommentById(id)
    },

    async deleteComment(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${COMMENTS_TABLE} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listComments(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENTS_TABLE} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    async getCommentsByProduct(product_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENTS_TABLE} WHERE product_id = ? ORDER BY created_at DESC`,
            [product_id]
        )
        return rows
    },

    async getCommentsByProductSlug(slug) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `
        SELECT 
            -- Dữ liệu từ bảng Comments
            c.id, 
            c.rate, 
            c.content, 
            c.likes,
            c.dislikes,
            c.created_at, 
            c.updated_at, 
            
            -- Dữ liệu từ bảng Users
            u.id AS user_id,
            u.username,
            u.full_name,
            u.avatar_url,

            -- Dữ liệu từ bảng Products
            p.id AS product_id,
            p.name AS product_name,
            p.slug AS product_slug
            
        FROM ${COMMENTS_TABLE} AS c
        INNER JOIN ${PRODUCTS_TABLE} AS p ON c.product_id = p.id
        INNER JOIN ${USERS_TABLE} AS u ON c.user_id = u.id
        WHERE p.slug = ?
        ORDER BY c.created_at DESC
        `,
            [slug]
        )
        return rows
    },

    async getByUserIdAndProductId(user_id, product_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `
        SELECT 
            c.id, 
            c.rate, 
            c.content, 
            c.likes,
            c.dislikes,
            c.created_at, 
            c.updated_at, 

            u.id AS user_id,
            u.username,
            u.full_name,
            u.avatar_url,

            p.id AS product_id,
            p.name AS product_name,
            p.slug AS product_slug,

            COALESCE(
                JSON_ARRAYAGG(
                    CASE 
                        WHEN ci.id IS NOT NULL THEN
                            JSON_OBJECT(
                                'id', ci.id,
                                'url', ci.image_url
                            )
                    END
                ),
                JSON_ARRAY()
            ) AS images
        FROM ${COMMENTS_TABLE} c
        INNER JOIN ${PRODUCTS_TABLE} p ON c.product_id = p.id
        INNER JOIN ${USERS_TABLE} u ON c.user_id = u.id
        LEFT JOIN ${COMMENTIMAGES_TABLE} ci ON ci.comment_id = c.id
        WHERE c.user_id = ? AND c.product_id = ?
        GROUP BY c.id
        ORDER BY c.created_at DESC
        `,
            [user_id, product_id]
        )

        return rows.map(row => ({
            ...row,
            images:
                typeof row.images === 'string'
                    ? JSON.parse(row.images)
                    : row.images,
        }))
    },

    async getCommentsByUser(user_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENTS_TABLE} WHERE user_id = ? ORDER BY created_at DESC`,
            [user_id]
        )
        return rows
    },
}

export { COMMENTS_TABLE, COMMENTS_SCHEMA, CommentsModel }
