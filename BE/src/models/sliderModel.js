import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const SLIDERS_TABLE_NAME = 'Sliders'

// Schema validate dữ liệu slider
const SLIDERS_SCHEMA = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Name không được để trống',
        'string.min': 'Name tối thiểu 3 ký tự',
        'string.max': 'Name tối đa 100 ký tự',
    }),
    image_url: Joi.string().max(255).required().messages({
        'string.empty': 'Image URL không được để trống',
        'string.max': 'Image URL tối đa 255 ký tự',
    }),
    sort_order: Joi.number().integer().min(0).default(0),
})

const SlidersModel = {
    
    async createSlider(data) {
        const { error, value } = SLIDERS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${SLIDERS_TABLE_NAME} (name, image_url, sort_order) VALUES (?, ?, ?)`,
            [value.name, value.image_url, value.sort_order]
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
        const schema = SLIDERS_SCHEMA.fork(
            Object.keys(SLIDERS_SCHEMA.describe().keys),
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

    
    async listSliders(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${SLIDERS_TABLE_NAME} ORDER BY sort_order ASC, id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },
}

export { SLIDERS_TABLE_NAME, SLIDERS_SCHEMA, SlidersModel }
