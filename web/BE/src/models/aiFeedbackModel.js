import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const AIFEEDBACK_TABLE_NAME = 'AIFeedback'
const PRODUCTS_TABLE_NAME = 'Products'

const AIFEEDBACK_SCHEMA = Joi.object({
    id: Joi.number().integer().allow(null),
    product_id: Joi.number().integer().required().messages({
        'number.base': 'Product ID phải là số',
        'any.required': 'Product ID là bắt buộc',
    }),
    voter_id: Joi.number().integer().allow(null).messages({
        'number.base': 'Voter ID phải là số',
    }),
    vote: Joi.number().integer().valid(0, 1).required().messages({
        'number.base': 'Vote phải là số',
        'any.required': 'Vote là bắt buộc',
        'any.only': 'Vote chỉ có thể là 0 (dislike) hoặc 1 (like)',
    }),
})

const aiFeedbackModel = {
    async createFeedback(data) {
        const { error, value } = AIFEEDBACK_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${AIFEEDBACK_TABLE_NAME} (product_id, voter_id, vote) VALUES (?, ?, ?)`,
            [value.product_id, value.voter_id, value.vote]
        )

        return { id: result.insertId, ...value }
    },

    async createOrUpdateFeedback(data) {
        const { error, value } = AIFEEDBACK_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        await conn.beginTransaction()

        try {
            let existingFeedback = null

            if (value.id) {
                const [rows] = await conn.execute(
                    `SELECT id, vote FROM ${AIFEEDBACK_TABLE_NAME} WHERE id = ?`,
                    [value.id]
                )
                if (rows.length > 0) existingFeedback = rows[0]
            }

            if (existingFeedback) {
                if (existingFeedback.vote === value.vote) {
                    await conn.execute(
                        `DELETE FROM ${AIFEEDBACK_TABLE_NAME} WHERE id = ?`,
                        [existingFeedback.id]
                    )
                    await conn.commit()
                    return { message: 'Feedback removed.' }
                }

                await conn.execute(
                    `UPDATE ${AIFEEDBACK_TABLE_NAME} SET vote = ? WHERE id = ?`,
                    [value.vote, existingFeedback.id]
                )
                await conn.commit()
                return { id: existingFeedback.id, ...value, updated: true }
            }

            const [result] = await conn.execute(
                `INSERT INTO ${AIFEEDBACK_TABLE_NAME} (product_id, voter_id, vote) VALUES (?, ?, ?)`,
                [value.product_id, value.voter_id, value.vote]
            )
            await conn.commit()
            return {
                id: result.insertId,
                product_id: value.product_id,
                voter_id: value.voter_id,
                vote: value.vote,
            }
        } catch (err) {
            await conn.rollback()
            console.error(`Transaction failed: ${err.message}`, err)
            throw err
        } finally {
        }
    },

    async getFeedbackById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${AIFEEDBACK_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async getIdByProductSlug(slug) {
        if (!slug) {
            throw new Error('Slug sản phẩm không được để trống!')
        }
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT id FROM ${PRODUCTS_TABLE_NAME} WHERE slug = ? LIMIT 1`,
            [slug]
        )

        return rows[0]?.id || null
    },

    async updateFeedback(id, data) {
        const schema = AIFEEDBACK_SCHEMA.fork(
            Object.keys(AIFEEDBACK_SCHEMA.describe().keys),
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
            `UPDATE ${AIFEEDBACK_TABLE_NAME} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [...values, id]
        )

        return this.getFeedbackById(id)
    },

    async deleteFeedback(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${AIFEEDBACK_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async getFeedbacksByProduct(product_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${AIFEEDBACK_TABLE_NAME} WHERE product_id = ? ORDER BY created_at DESC`,
            [product_id]
        )
        return rows
    },

    async getFeedbacksByUser(voter_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${AIFEEDBACK_TABLE_NAME} WHERE voter_id = ? ORDER BY created_at DESC`,
            [voter_id]
        )
        return rows
    },
}

export { AIFEEDBACK_TABLE_NAME, AIFEEDBACK_SCHEMA, aiFeedbackModel }
