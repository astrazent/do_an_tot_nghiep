import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const SLIDERS_TABLE_NAME = 'Sliders'

// Schema validate dữ liệu slider
const SLIDER_SCHEMA = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Tên slider không được để trống',
        'string.min': 'Tên slider tối thiểu 3 ký tự',
        'string.max': 'Tên slider tối đa 100 ký tự',
    }),
    description: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Description tối đa 255 ký tự',
    }),
    image_url: Joi.string().max(255).required().messages({
        'string.empty': 'Image URL không được để trống',
        'string.max': 'Image URL tối đa 255 ký tự',
    }),
    link_url: Joi.string().max(255).allow('', null).messages({
        'string.max': 'Link URL tối đa 255 ký tự',
    }),
    sort_order: Joi.number().integer().default(0),
    status: Joi.number().integer().valid(0, 1).default(1),
    start_date: Joi.date().allow(null),
    end_date: Joi.date().allow(null),
})

const SlidersModel = {
    async createSlider(data) {
        const { error, value } = SLIDER_SCHEMA.validate(data, { abortEarly: false })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${SLIDERS_TABLE_NAME} 
            (name, description, image_url, link_url, sort_order, status, start_date, end_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                value.name,
                value.description,
                value.image_url,
                value.link_url,
                value.sort_order,
                value.status,
                value.start_date,
                value.end_date,
            ]
        )

        return { id: result.insertId, ...value }
    },

    async getSliderById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${SLIDERS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async updateSlider(id, data) {
        const schema = SLIDER_SCHEMA.fork(Object.keys(SLIDER_SCHEMA.describe().keys), f => f.optional())
        const { error, value } = schema.validate(data, { abortEarly: false })
        if (error) throw error

        const fields = Object.keys(value)
        const values = Object.values(value)
        if (!fields.length) return null

        const setClause = fields.map(f => `${f} = ?`).join(', ')
        const conn = getConnection()
        await conn.execute(
            `UPDATE ${SLIDERS_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )

        return this.getSliderById(id)
    },

    async deleteSlider(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${SLIDERS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listSliders(limit = 50, offset = 0, status = null, sort = 'desc') {
        const conn = getConnection()
        let sql = `SELECT * FROM ${SLIDERS_TABLE_NAME}`
        const params = []

        if (status !== null) {
            sql += ' WHERE status = ?'
            params.push(status)
        }

        const order = sort === 'asc' ? 'ASC' : 'DESC'
        sql += ` ORDER BY sort_order ${order}, id ${order} LIMIT ? OFFSET ?`
        params.push(limit, offset)

        const [rows] = await conn.execute(sql, params)
        return rows
    }
}

export { SLIDERS_TABLE_NAME, SLIDER_SCHEMA, SlidersModel }
