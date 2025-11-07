// src/models/commentReactions.model.js
import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

// Khai báo tên bảng
const COMMENT_REACTIONS_TABLE = 'CommentReactions'
const COMMENTS_TABLE = 'Comments'

const COMMENT_REACTIONS_SCHEMA = Joi.object({
    user_id: Joi.number().integer().required().messages({
        'number.base': 'User ID phải là số',
        'any.required': 'User ID là bắt buộc',
    }),
    product_id: Joi.number().integer().required().messages({
        'number.base': 'Product ID phải là số',
        'any.required': 'Product ID là bắt buộc',
    }),
    comment_id: Joi.number().integer().required().messages({
        'number.base': 'Comment ID phải là số',
        'any.required': 'Comment ID là bắt buộc',
    }),
    reaction: Joi.string().valid('like', 'dislike').required().messages({
        'any.only': 'Reaction chỉ được là like hoặc dislike',
        'any.required': 'Reaction là bắt buộc',
    }),
})

const CommentReactionsModel = {
    async createReaction(data) {
        const { error, value } = COMMENT_REACTIONS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = await getConnection()
        await conn.beginTransaction()

        try {
            const [existing] = await conn.execute(
                `SELECT id, reaction FROM ${COMMENT_REACTIONS_TABLE}
                WHERE user_id = ? AND comment_id = ?`,
                [value.user_id, value.comment_id]
            )

            if (existing.length > 0) {
                const existingReaction = existing[0]
                const currentReactionType = existingReaction.reaction

                if (currentReactionType === value.reaction) {
                    await conn.execute(
                        `DELETE FROM ${COMMENT_REACTIONS_TABLE} WHERE id = ?`,
                        [existingReaction.id]
                    )

                    const columnToDecrement =
                        value.reaction === 'like' ? 'likes' : 'dislikes'
                    await conn.execute(
                        `UPDATE ${COMMENTS_TABLE} 
                        SET ${columnToDecrement} = ${columnToDecrement} - 1 
                        WHERE id = ? AND ${columnToDecrement} > 0`,
                        [value.comment_id]
                    )

                    await conn.commit()
                    return { message: 'Reaction removed.' }
                }

                await conn.execute(
                    `UPDATE ${COMMENT_REACTIONS_TABLE} SET reaction = ? WHERE id = ?`,
                    [value.reaction, existingReaction.id]
                )

                const columnToIncrement =
                    value.reaction === 'like' ? 'likes' : 'dislikes'
                const columnToDecrement =
                    value.reaction === 'like' ? 'dislikes' : 'likes'
                await conn.execute(
                    `UPDATE ${COMMENTS_TABLE} 
                    SET ${columnToIncrement} = ${columnToIncrement} + 1,
                        ${columnToDecrement} = ${columnToDecrement} - 1
                    WHERE id = ? AND ${columnToDecrement} > 0`,
                    [value.comment_id]
                )

                await conn.commit()
                return { ...value, updated: true }
            }

            const [result] = await conn.execute(
                `INSERT INTO ${COMMENT_REACTIONS_TABLE} (user_id, product_id, comment_id, reaction)
                VALUES (?, ?, ?, ?)`,
                [value.user_id, value.product_id, value.comment_id, value.reaction]
            )

            const columnToIncrement =
                value.reaction === 'like' ? 'likes' : 'dislikes'
            await conn.execute(
                `UPDATE ${COMMENTS_TABLE} SET ${columnToIncrement} = ${columnToIncrement} + 1 WHERE id = ?`,
                [value.comment_id]
            )

            await conn.commit()
            return { id: result.insertId, ...value }
        } catch (err) {
            await conn.rollback()
            console.error(`Transaction failed: ${err.message}`, err)
            throw err
        } finally {
            if (conn) {
                // conn.release() nếu thư viện yêu cầu
            }
        }
    },

    async getReactionById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENT_REACTIONS_TABLE} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async getReactionsByProduct({ user_id, product_id }) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENT_REACTIONS_TABLE} WHERE user_id = ? AND product_id = ?`,
            [user_id, product_id]
        )
        return rows
    },

    async getReactionsByUser(user_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENT_REACTIONS_TABLE} WHERE user_id = ?`,
            [user_id]
        )
        return rows
    },

    async deleteReaction(user_id, comment_id, product_id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${COMMENT_REACTIONS_TABLE} 
            WHERE user_id = ? AND comment_id = ? AND product_id = ?`,
            [user_id, comment_id, product_id]
        )
        return result.affectedRows > 0
    },

    async countReactions(comment_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT 
                SUM(reaction = 'like') AS likes,
                SUM(reaction = 'dislike') AS dislikes
            FROM ${COMMENT_REACTIONS_TABLE}
            WHERE comment_id = ?`,
            [comment_id]
        )
        return rows[0]
    },
}

export { COMMENT_REACTIONS_TABLE, COMMENT_REACTIONS_SCHEMA, CommentReactionsModel }
