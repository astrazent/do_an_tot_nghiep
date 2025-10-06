import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const DISCOUNTS_TABLE_NAME = 'Discounts'

// Schema validate dữ liệu discount
const DISCOUNTS_SCHEMA = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Name không được để trống',
        'string.min': 'Name tối thiểu 3 ký tự',
        'string.max': 'Name tối đa 100 ký tự',
    }),
    description: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Description tối đa 255 ký tự',
    }),
    value: Joi.number().precision(2).min(0).default(0).messages({
        'number.base': 'Value phải là số',
        'number.min': 'Value tối thiểu 0',
    }),
    min_price: Joi.number().precision(2).min(0).default(0).messages({
        'number.base': 'Min price phải là số',
        'number.min': 'Min price tối thiểu 0',
    }),
    start_date: Joi.date().default(() => new Date()),
    end_date: Joi.date().default(() => new Date()),
    status: Joi.number().integer().valid(0, 1).default(0).messages({
        'number.base': 'Status phải là số',
        'any.only': 'Status phải là 0 hoặc 1',
    }),
})

const DiscountsModel = {
    // Tạo discount mới
    async createDiscount(data) {
        const { error, value } = DISCOUNTS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${DISCOUNTS_TABLE_NAME} 
                (name, description, value, min_price, start_date, end_date, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                value.name,
                value.description,
                value.value,
                value.min_price,
                value.start_date,
                value.end_date,
                value.status,
            ]
        )

        return { id: result.insertId, ...value }
    },

    // Lấy discount theo ID
    async getDiscountById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${DISCOUNTS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    // Cập nhật discount theo ID
    async updateDiscount(id, data) {
        const schema = DISCOUNTS_SCHEMA.fork(
            Object.keys(DISCOUNTS_SCHEMA.describe().keys),
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
            `UPDATE ${DISCOUNTS_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )

        return this.getDiscountById(id)
    },

    // Xóa discount theo ID
    async deleteDiscount(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${DISCOUNTS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    // Lấy danh sách discount
    async listDiscounts(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${DISCOUNTS_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    // Lấy discount đang hoạt động tại thời điểm hiện tại
    async getActiveDiscounts() {
        const now = new Date()
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${DISCOUNTS_TABLE_NAME} 
                WHERE status = 1 AND start_date <= ? AND end_date >= ? 
                ORDER BY start_date ASC`,
            [now, now]
        )
        return rows
    },
}

export { DISCOUNTS_TABLE_NAME, DISCOUNTS_SCHEMA, DiscountsModel }
