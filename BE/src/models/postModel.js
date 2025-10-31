import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const POSTS_TABLE_NAME = 'Posts'

// Schema validate dữ liệu post
const POSTS_SCHEMA = Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
        'string.empty': 'Title không được để trống',
        'string.min': 'Title tối thiểu 3 ký tự',
        'string.max': 'Title tối đa 200 ký tự',
    }),
    slug: Joi.string().max(200).allow('', null).messages({
        'string.max': 'Slug tối đa 200 ký tự',
    }),
    content: Joi.string().required().messages({
        'string.empty': 'Content không được để trống',
    }),
    author_name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Author name không được để trống',
        'string.min': 'Author name tối thiểu 3 ký tự',
        'string.max': 'Author name tối đa 100 ký tự',
    }),
    description: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Description tối đa 255 ký tự',
    }),
    status: Joi.number().integer().valid(0, 1).default(1).messages({
        'number.base': 'Status phải là số',
        'any.only': 'Status phải là 0 hoặc 1',
    }),
    published_at: Joi.date().allow(null),
    admin_id: Joi.number().integer().required().messages({
        'number.base': 'Admin ID phải là số',
        'any.required': 'Admin ID là bắt buộc',
    }),
})

const PostsModel = {
    
    async createPost(data) {
        const { error, value } = POSTS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${POSTS_TABLE_NAME} (title, slug, content, author_name, description, status, published_at, admin_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                value.title,
                value.slug,
                value.content,
                value.author_name,
                value.description,
                value.status,
                value.published_at,
                value.admin_id,
            ]
        )

        return { id: result.insertId, ...value }
    },

    
    async getPostById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${POSTS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    
    async updatePost(id, data) {
        const schema = POSTS_SCHEMA.fork(
            Object.keys(POSTS_SCHEMA.describe().keys),
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
            `UPDATE ${POSTS_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )

        return this.getPostById(id)
    },

    
    async deletePost(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${POSTS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    
    async listPosts(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${POSTS_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },
}

export { POSTS_TABLE_NAME, POSTS_SCHEMA, PostsModel }
