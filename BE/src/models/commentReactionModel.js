// src/models/commentReactions.model.js
import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const COMMENT_REACTIONS_TABLE_NAME = 'CommentReactions'

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

        const conn = await getConnection() // Đảm bảo bạn có hàm để lấy kết nối CSDL

        // Bắt đầu một transaction
        await conn.beginTransaction()

        try {
            // Kiểm tra xem user đã có reaction nào với comment này chưa
            const [existing] = await conn.execute(
                `SELECT id, reaction FROM ${COMMENT_REACTIONS_TABLE_NAME}
            WHERE user_id = ? AND comment_id = ?`,
                [value.user_id, value.comment_id]
            )

            if (existing.length > 0) {
                const existingReaction = existing[0]
                const currentReactionType = existingReaction.reaction

                // Nếu user bấm lại cùng loại reaction → Xóa reaction (unlike/undislike)
                if (currentReactionType === value.reaction) {
                    await conn.execute(
                        `DELETE FROM ${COMMENT_REACTIONS_TABLE_NAME} WHERE id = ?`,
                        [existingReaction.id]
                    )

                    // Giảm số likes/dislikes tương ứng trong bảng Comments
                    const columnToDecrement =
                        value.reaction === 'like' ? 'likes' : 'dislikes'
                    await conn.execute(
                        `UPDATE Comments SET ${columnToDecrement} = ${columnToDecrement} - 1 WHERE id = ? AND ${columnToDecrement} > 0`,
                        [value.comment_id]
                    )

                    await conn.commit() // Commit transaction
                    return { message: 'Reaction removed.' }
                }

                // Nếu user đổi từ like sang dislike hoặc ngược lại → Cập nhật
                await conn.execute(
                    `UPDATE ${COMMENT_REACTIONS_TABLE_NAME}
                SET reaction = ?
                WHERE id = ?`,
                    [value.reaction, existingReaction.id]
                )

                // Cập nhật cả hai cột likes và dislikes trong bảng Comments
                const columnToIncrement =
                    value.reaction === 'like' ? 'likes' : 'dislikes'
                const columnToDecrement =
                    value.reaction === 'like' ? 'dislikes' : 'likes'
                await conn.execute(
                    `UPDATE Comments 
                SET 
                    ${columnToIncrement} = ${columnToIncrement} + 1,
                    ${columnToDecrement} = ${columnToDecrement} - 1
                WHERE id = ? AND ${columnToDecrement} > 0`,
                    [value.comment_id]
                )

                await conn.commit() // Commit transaction
                return { ...value, updated: true }
            }

            // Nếu chưa có reaction nào → Chèn mới
            const [result] = await conn.execute(
                `INSERT INTO ${COMMENT_REACTIONS_TABLE_NAME}
            (user_id, product_id, comment_id, reaction)
            VALUES (?, ?, ?, ?)`,
                [
                    value.user_id,
                    value.product_id,
                    value.comment_id,
                    value.reaction,
                ]
            )

            // Tăng số likes/dislikes tương ứng trong bảng Comments
            const columnToIncrement =
                value.reaction === 'like' ? 'likes' : 'dislikes'
            await conn.execute(
                `UPDATE Comments SET ${columnToIncrement} = ${columnToIncrement} + 1 WHERE id = ?`,
                [value.comment_id]
            )

            await conn.commit() // Commit transaction
            return { id: result.insertId, ...value }
        } catch (err) {
            // Nếu có lỗi xảy ra, rollback tất cả các thay đổi
            await conn.rollback()
            console.error(`Transaction failed: ${err.message}`, err)
            throw err // Ném lỗi ra để xử lý ở tầng cao hơn
        } finally {
            // Quan trọng: Giải phóng kết nối sau khi hoàn tất
            if (conn) {
                // Tùy thuộc vào thư viện bạn đang dùng, có thể là conn.release()
            }
        }
    },

    async getReactionById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENT_REACTIONS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async getReactionsByProduct(reactionProduct) {
        const conn = getConnection()
        const { user_id, product_id} = reactionProduct
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENT_REACTIONS_TABLE_NAME} WHERE user_id = ? AND product_id = ?`,
            [user_id, product_id]
        )
        return rows
    },

    async getReactionsByUser(user_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COMMENT_REACTIONS_TABLE_NAME} WHERE user_id = ?`,
            [user_id]
        )
        return rows
    },

    async deleteReaction(user_id, comment_id, product_id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${COMMENT_REACTIONS_TABLE_NAME} 
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
            FROM ${COMMENT_REACTIONS_TABLE_NAME}
            WHERE comment_id = ?`,
            [comment_id]
        )
        return rows[0]
    },
}

export {
    COMMENT_REACTIONS_TABLE_NAME,
    COMMENT_REACTIONS_SCHEMA,
    CommentReactionsModel,
}
