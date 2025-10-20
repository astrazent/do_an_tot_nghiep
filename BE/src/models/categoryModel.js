import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const CATEGORIES_TABLE_NAME = 'Categories'

// Schema validate dữ liệu category
const CATEGORIES_SCHEMA = Joi.object({
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
    parent_id: Joi.number().integer().allow(null).messages({
        'number.base': 'Parent ID phải là số hoặc null',
    }),
})

const CategoriesModel = {
    
    async createCategory(data) {
        const { error, value } = CATEGORIES_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${CATEGORIES_TABLE_NAME} (name, slug, description, parent_id) 
            VALUES (?, ?, ?, ?)`,
            [value.name, value.slug, value.description, value.parent_id]
        )

        return { id: result.insertId, ...value }
    },

    async getCategoryByName(name) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${CATEGORIES_TABLE_NAME} WHERE name = ?`,
            [name]
        )
        return rows[0] || null
    },
    
    async getCategoryById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${CATEGORIES_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    
    async updateCategory(id, data) {
        const schema = CATEGORIES_SCHEMA.fork(
            Object.keys(CATEGORIES_SCHEMA.describe().keys),
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
            `UPDATE ${CATEGORIES_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )

        return this.getCategoryById(id)
    },

    
    async deleteCategory(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${CATEGORIES_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    
    async listCategories(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${CATEGORIES_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },
}

export { CATEGORIES_TABLE_NAME, CATEGORIES_SCHEMA, CategoriesModel }
