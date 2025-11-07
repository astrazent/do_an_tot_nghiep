import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const POST_TYPES_TABLE_NAME = 'PostTypes'

// Schema validate dữ liệu post type
const POST_TYPES_SCHEMA = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Name không được để trống',
        'string.min': 'Name tối thiểu 3 ký tự',
        'string.max': 'Name tối đa 100 ký tự',
    }),
    slug: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Slug tối đa 255 ký tự',
    }),
    description: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Description tối đa 255 ký tự',
    }),
})

const PostTypesModel = {
    async createPostType(data) {
        const { error, value } = POST_TYPES_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${POST_TYPES_TABLE_NAME} (name, slug, description)
            VALUES (?, ?, ?)`,
            [value.name, value.slug, value.description]
        )

        return { id: result.insertId, ...value }
    },

    async getPostTypeById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${POST_TYPES_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async updatePostType(id, data) {
        const schema = POST_TYPES_SCHEMA.fork(
            Object.keys(POST_TYPES_SCHEMA.describe().keys),
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
            `UPDATE ${POST_TYPES_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )

        return this.getPostTypeById(id)
    },

    async deletePostType(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${POST_TYPES_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listPostTypes(limit = 50, offset = 0, sort = 'newest') {
        const conn = getConnection()
        let sql = `SELECT * FROM ${POST_TYPES_TABLE_NAME}`

        const order = sort === 'oldest' ? 'ASC' : 'DESC'
        sql += ` ORDER BY id ${order} LIMIT ? OFFSET ?`

        const [rows] = await conn.execute(sql, [limit, offset])
        return rows
    }
}

export { POST_TYPES_TABLE_NAME, POST_TYPES_SCHEMA, PostTypesModel }
