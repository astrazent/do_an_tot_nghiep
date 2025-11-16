import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const COUPON_SCOPES_TABLE_NAME = 'CouponScopes'

const COUPON_SCOPES_SCHEMA = Joi.object({
    coupon_id: Joi.number().integer().required(),
    scope_type: Joi.number().integer().valid(0, 1, 2).required().messages({
        'any.only':
            'scope_type chỉ có thể là 0 (Toàn shop), 1 (Theo thể loại), 2 (Theo sản phẩm)',
    }),
    product_id: Joi.number().integer().allow(null),
})

const CouponScopesModel = {
    async createCouponScope(data) {
        const { error, value } = COUPON_SCOPES_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${COUPON_SCOPES_TABLE_NAME} 
            (coupon_id, scope_type, product_id)
            VALUES (?, ?, ?)`,
            [value.coupon_id, value.scope_type, value.product_id]
        )

        return { id: result.insertId, ...value }
    },

    async getCouponScopeById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COUPON_SCOPES_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async updateCouponScope(id, data) {
        const schema = COUPON_SCOPES_SCHEMA.fork(
            Object.keys(COUPON_SCOPES_SCHEMA.describe().keys),
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
            `UPDATE ${COUPON_SCOPES_TABLE_NAME} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [...values, id]
        )

        return this.getCouponScopeById(id)
    },

    async deleteCouponScope(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${COUPON_SCOPES_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listCouponScopes(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COUPON_SCOPES_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    async getCouponScopesByCouponId(coupon_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COUPON_SCOPES_TABLE_NAME} WHERE coupon_id = ? ORDER BY id DESC`,
            [coupon_id]
        )
        return rows
    },
}

export { COUPON_SCOPES_TABLE_NAME, COUPON_SCOPES_SCHEMA, CouponScopesModel }
