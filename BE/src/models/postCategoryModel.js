import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const POST_CATEGORIES_TABLE_NAME = 'PostCategories'

const POST_CATEGORIES_SCHEMA = Joi.object({
    post_id: Joi.number().integer().required().messages({
        'number.base': 'Post ID phải là số',
        'any.required': 'Post ID là bắt buộc',
    }),
    category_id: Joi.number().integer().required().messages({
        'number.base': 'Category ID phải là số',
        'any.required': 'Category ID là bắt buộc',
    }),
})

const PostCategoriesModel = {
    async createLink(data) {
        const { error, value } = POST_CATEGORIES_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${POST_CATEGORIES_TABLE_NAME} (post_id, category_id) VALUES (?, ?)`,
            [value.post_id, value.category_id]
        )

        return { id: result.insertId, ...value }
    },

    async getLinkById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${POST_CATEGORIES_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async updateLink(id, data) {
        const schema = POST_CATEGORIES_SCHEMA.fork(
            Object.keys(POST_CATEGORIES_SCHEMA.describe().keys),
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
            `UPDATE ${POST_CATEGORIES_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )

        return this.getLinkById(id)
    },

    async deleteLink(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${POST_CATEGORIES_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listLinks(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${POST_CATEGORIES_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    async getCategoriesByPost(post_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${POST_CATEGORIES_TABLE_NAME} WHERE post_id = ?`,
            [post_id]
        )
        return rows
    },

    async getPostsByCategory(category_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${POST_CATEGORIES_TABLE_NAME} WHERE category_id = ?`,
            [category_id]
        )
        return rows
    },
}

export {
    POST_CATEGORIES_TABLE_NAME,
    POST_CATEGORIES_SCHEMA,
    PostCategoriesModel,
}
