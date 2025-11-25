import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const POSTS_TABLE = 'Posts'
const POST_CATEGORIES_TABLE = 'PostCategories'
const CATEGORIES_TABLE = 'Categories'
const POST_TYPES_TABLE = 'PostTypes'

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
            `INSERT INTO ${POSTS_TABLE} (title, slug, content, author_name, description, status, published_at, admin_id) 
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
            `SELECT * FROM ${POSTS_TABLE} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async getPostBySlug(slug, limit = 1, offset = 0) {
        if (!slug) return []

        const conn = getConnection()
        const sql = `
        SELECT *
        FROM ${POSTS_TABLE}
        WHERE slug = ?
        ORDER BY published_at DESC
        LIMIT ? OFFSET ?
    `
        const params = [slug, limit, offset]
        const [rows] = await conn.execute(sql, params)
        return rows
    },

    async getPostByCategorySlug(slugString = '', limit = 5, offset = 0) {
        if (!slugString) return []

        const slugs = slugString
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0)

        if (slugs.length === 0) return []

        const conn = getConnection()
        const placeholders = slugs.map(() => '?').join(', ')
        const sql = `
        SELECT p.*
        FROM ${POSTS_TABLE} p
        JOIN ${POST_CATEGORIES_TABLE} pc ON p.id = pc.post_id
        JOIN ${CATEGORIES_TABLE} c ON pc.category_id = c.id
        WHERE c.slug IN (${placeholders})
        ORDER BY p.published_at DESC
        LIMIT ? OFFSET ?
    `
        const params = [...slugs, limit, offset]
        const [rows] = await conn.execute(sql, params)
        return rows
    },

    async getPostByPostTypeSlug(slug, limit = 5, offset = 0) {
        if (!slug) return []

        const conn = getConnection()
        const sql = `
        SELECT p.*
        FROM ${POSTS_TABLE} p
        JOIN ${POST_TYPES_TABLE} pt ON p.post_type_id = pt.id
        WHERE pt.slug = ?
        ORDER BY p.published_at DESC
        LIMIT ? OFFSET ?
    `
        const [rows] = await conn.execute(sql, [slug, limit, offset])
        return rows
    },

    async getRelatedByPostSlug(slug, limit = 5, offset = 0) {
        if (!slug) return { relatedByCategory: [], relatedByPostType: [] }

        const conn = getConnection()

        const [originalRows] = await conn.execute(
            `
        SELECT p.id AS postId, p.post_type_id, pc.category_id
        FROM ${POSTS_TABLE} p
        LEFT JOIN ${POST_CATEGORIES_TABLE} pc ON p.id = pc.post_id
        WHERE p.slug = ?
        `,
            [slug]
        )
        if (originalRows.length === 0)
            return { relatedByCategory: [], relatedByPostType: [] }

        const { postId, post_type_id } = originalRows[0]
        const categoryIds = [
            ...new Set(originalRows.map(r => r.category_id).filter(Boolean)),
        ]

        let relatedByCategory = []

        if (categoryIds.length > 0) {
            const placeholders = categoryIds.map(() => '?').join(',')
            const [rows] = await conn.execute(
                `
            SELECT DISTINCT p.*
            FROM ${POSTS_TABLE} p
            JOIN ${POST_CATEGORIES_TABLE} pc ON p.id = pc.post_id
            WHERE pc.category_id IN (${placeholders})
            AND p.id != ?
            ORDER BY p.published_at DESC
            LIMIT ? OFFSET ?
            `,
                [...categoryIds, postId, limit, offset]
            )
            relatedByCategory = rows
        }

        const [relatedByPostType] = await conn.execute(
            `
        SELECT p.*
        FROM ${POSTS_TABLE} p
        WHERE p.post_type_id = ? AND p.id != ?
        ORDER BY p.published_at DESC
        LIMIT ? OFFSET ?
        `,
            [post_type_id, postId, limit, offset]
        )

        return {
            relatedByCategory,
            relatedByPostType,
        }
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
            `UPDATE ${POSTS_TABLE} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )

        return this.getPostById(id)
    },

    async deletePost(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${POSTS_TABLE} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listPosts(sort = 'newest') {
        const conn = getConnection()
        let sql = ''
        let params = []

        switch (sort) {
            case 'oldest':
                sql = `
            SELECT 
                p.*,
                pt.name AS post_type_name,
                pt.slug AS post_type_slug,
                pt.description AS post_type_description
            FROM ${POSTS_TABLE} p
            LEFT JOIN ${POST_TYPES_TABLE} pt ON p.post_type_id = pt.id
            ORDER BY p.updated_at ASC
        `
                break

            case 'post_type':
                sql = `
            SELECT 
                p.*,
                pt.name AS post_type_name,
                pt.slug AS post_type_slug,
                pt.description AS post_type_description
            FROM ${POSTS_TABLE} p
            LEFT JOIN ${POST_TYPES_TABLE} pt ON p.post_type_id = pt.id
            ORDER BY p.post_type_id ASC, p.updated_at DESC
        `
                break

            case 'post_type_limited':
                sql = `
            SELECT *
            FROM (
                SELECT 
                    p.*,
                    pt.name AS post_type_name,
                    pt.slug AS post_type_slug,
                    pt.description AS post_type_description,
                    ROW_NUMBER() OVER (PARTITION BY p.post_type_id ORDER BY p.updated_at DESC) AS rn
                FROM ${POSTS_TABLE} p
                LEFT JOIN ${POST_TYPES_TABLE} pt ON p.post_type_id = pt.id
            ) ranked
            WHERE ranked.rn <= 4
            ORDER BY ranked.post_type_id ASC, ranked.updated_at DESC
        `
                break

            default: 
                sql = `
            SELECT 
                p.*,
                pt.name AS post_type_name,
                pt.slug AS post_type_slug,
                pt.description AS post_type_description
            FROM ${POSTS_TABLE} p
            LEFT JOIN ${POST_TYPES_TABLE} pt ON p.post_type_id = pt.id
            ORDER BY p.updated_at DESC
        `
                break
        }

        const [rows] = await conn.execute(sql, params)
        return rows
    },
}

export { POSTS_TABLE, POSTS_SCHEMA, PostsModel }
