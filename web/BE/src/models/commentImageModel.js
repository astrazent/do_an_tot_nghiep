import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const COMMENT_IMAGES_TABLE = 'CommentImages'

const COMMENT_IMAGES_SCHEMA = Joi.object({
    comment_id: Joi.number().integer().required().messages({
        'number.base': 'Comment ID phải là số',
        'any.required': 'Comment ID là bắt buộc',
    }),
    image_url: Joi.string().max(255).required().messages({
        'string.empty': 'Image URL không được để trống',
        'string.max': 'Image URL tối đa 255 ký tự',
    }),
})

const CommentImagesModel = {
    async createCommentImage(data) {
        const { error, value } = COMMENT_IMAGES_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${COMMENT_IMAGES_TABLE} (comment_id, image_url) VALUES (?, ?)`,
            [value.comment_id, value.image_url]
        )

        return { id: result.insertId, ...value }
    },

    async getCommentImageById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENT_IMAGES_TABLE} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async updateCommentImage(id, data) {
        const schema = COMMENT_IMAGES_SCHEMA.fork(
            Object.keys(COMMENT_IMAGES_SCHEMA.describe().keys),
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
            `UPDATE ${COMMENT_IMAGES_TABLE} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )

        return this.getCommentImageById(id)
    },

    async deleteCommentImage(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${COMMENT_IMAGES_TABLE} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listCommentImages(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENT_IMAGES_TABLE} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    async getImagesByComment(comment_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENT_IMAGES_TABLE} WHERE comment_id = ? ORDER BY id ASC`,
            [comment_id]
        )
        return rows
    },

    async getImagesByCommentIds(commentIds) {
        if (!Array.isArray(commentIds) || commentIds.length === 0) return []

        const conn = getConnection()
        const placeholders = commentIds.map(() => '?').join(',')
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENT_IMAGES_TABLE} 
                WHERE comment_id IN (${placeholders})
                ORDER BY comment_id ASC, id ASC`,
            commentIds
        )
        return rows
    },
}

export { COMMENT_IMAGES_TABLE, COMMENT_IMAGES_SCHEMA, CommentImagesModel }
