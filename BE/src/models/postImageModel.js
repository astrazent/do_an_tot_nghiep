import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const POST_IMAGES_TABLE_NAME = 'PostImages'

const POST_IMAGES_SCHEMA = Joi.object({
    is_main: Joi.number().integer().valid(0, 1).required().messages({
        'number.base': 'is_main phải là số',
        'any.only': 'is_main chỉ nhận 0 hoặc 1',
        'any.required': 'is_main là bắt buộc',
    }),
    image_url: Joi.string().max(255).required().messages({
        'string.empty': 'Image URL không được để trống',
        'string.max': 'Image URL tối đa 255 ký tự',
    }),
    post_id: Joi.number().integer().required().messages({
        'number.base': 'Post ID phải là số',
        'any.required': 'Post ID là bắt buộc',
    }),
})

const PostImagesModel = {
    async createPostImage(data) {
        const { error, value } = POST_IMAGES_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${POST_IMAGES_TABLE_NAME} (image_url, is_main, post_id) VALUES (?, ?, ?)`,
            [value.image_url, value.is_main, value.post_id]
        )

        return { id: result.insertId, ...value }
    },

    async getPostImageById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${POST_IMAGES_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async updatePostImage(id, data) {
        const schema = POST_IMAGES_SCHEMA.fork(
            Object.keys(POST_IMAGES_SCHEMA.describe().keys),
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
            `UPDATE ${POST_IMAGES_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )

        return this.getPostImageById(id)
    },

    async deletePostImage(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${POST_IMAGES_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listPostImages(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${POST_IMAGES_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    async getImagesByPost(post_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${POST_IMAGES_TABLE_NAME} WHERE post_id = ? ORDER BY is_main DESC, id ASC`,
            [post_id]
        )
        return rows
    },

    async getImagesByPostIds(postIds) {
        if (!Array.isArray(postIds) || postIds.length === 0) return []

        const conn = getConnection()
        const placeholders = postIds.map(() => '?').join(',')
        const [rows] = await conn.execute(
            `SELECT * FROM ${POST_IMAGES_TABLE_NAME}
            WHERE post_id IN (${placeholders})
            ORDER BY post_id ASC, is_main DESC, id ASC`,
            postIds
        )
        return rows
    },
}

export { POST_IMAGES_TABLE_NAME, POST_IMAGES_SCHEMA, PostImagesModel }
