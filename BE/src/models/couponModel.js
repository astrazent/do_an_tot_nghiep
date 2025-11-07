import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const COUPONS_TABLE_NAME = 'Coupons'

const COUPONS_SCHEMA = Joi.object({
    code: Joi.string().max(50).required(),
    description: Joi.string().max(255).allow('', null),
    type: Joi.number().integer().valid(0, 1).required().messages({
        'number.base': 'Type phải là số',
        'any.required': 'Type là bắt buộc',
        'any.only':
            'Type chỉ có thể là 0 (giảm phí ship) hoặc 1 (giảm giá sản phẩm)',
    }),
    value: Joi.number().precision(2).min(0).required(),
    measure: Joi.number().integer().valid(0, 1).required().messages({
        'any.only': 'Measure chỉ có thể là 0 (VND) hoặc 1 (%)',
    }),
    max_value: Joi.number().precision(2).min(0).allow(null),
    expire_date: Joi.date().allow(null),
})

const CouponsModel = {
    async createCoupon(data) {
        const { error, value } = COUPONS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${COUPONS_TABLE_NAME} 
            (code, description, type, value, measure, max_value, expire_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                value.code,
                value.description,
                value.type,
                value.value,
                value.measure,
                value.max_value,
                value.expire_date,
            ]
        )

        return { id: result.insertId, ...value }
    },

    async getCouponById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COUPONS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async updateCoupon(id, data) {
        const schema = COUPONS_SCHEMA.fork(
            Object.keys(COUPONS_SCHEMA.describe().keys),
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
            `UPDATE ${COUPONS_TABLE_NAME} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [...values, id]
        )

        return this.getCouponById(id)
    },

    async deleteCoupon(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${COUPONS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listCoupons(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COUPONS_TABLE_NAME} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    async getCouponsByType(type) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${COUPONS_TABLE_NAME} WHERE type = ? ORDER BY created_at DESC`,
            [type]
        )
        return rows
    },
}

export { COUPONS_TABLE_NAME, COUPONS_SCHEMA, CouponsModel }
