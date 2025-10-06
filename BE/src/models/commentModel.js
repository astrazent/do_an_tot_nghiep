import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const COMMENTS_TABLE_NAME = 'Comments'

// Schema validate dữ liệu comment
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
})

const CommentsModel = {
    
    async createComment(data) {
        const { error, value } = COMMENTS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${COMMENTS_TABLE_NAME} (rate, content, product_id, user_id) VALUES (?, ?, ?, ?)`,
            [value.rate, value.content, value.product_id, value.user_id]
        )

        return { id: result.insertId, ...value }
    },

    
    async getCommentById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENTS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
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
            `UPDATE ${COMMENTS_TABLE_NAME} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [...values, id]
        )

        return this.getCommentById(id)
    },

    
    async deleteComment(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${COMMENTS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    
    async listComments(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENTS_TABLE_NAME} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    
    async getCommentsByProduct(product_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENTS_TABLE_NAME} WHERE product_id = ? ORDER BY created_at DESC`,
            [product_id]
        )
        return rows
    },

    
    async getCommentsByUser(user_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENTS_TABLE_NAME} WHERE user_id = ? ORDER BY created_at DESC`,
            [user_id]
        )
        return rows
    },
}

export { COMMENTS_TABLE_NAME, COMMENTS_SCHEMA, CommentsModel }
