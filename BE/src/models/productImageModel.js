import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const PRODUCT_IMAGES_TABLE_NAME = 'ProductImages'

// Schema validate dữ liệu product image
const PRODUCT_IMAGES_SCHEMA = Joi.object({
    is_main: Joi.number().integer().valid(0, 1).required().messages({
        'number.base': 'is_main phải là số',
        'any.only': 'is_main chỉ nhận 0 hoặc 1',
        'any.required': 'is_main là bắt buộc',
    }),
    image_url: Joi.string().max(255).required().messages({
        'string.empty': 'Image URL không được để trống',
        'string.max': 'Image URL tối đa 255 ký tự',
    }),
    product_id: Joi.number().integer().required().messages({
        'number.base': 'Product ID phải là số',
        'any.required': 'Product ID là bắt buộc',
    }),
    slider_id: Joi.number().integer().required().messages({
        'number.base': 'Slider ID phải là số',
        'any.required': 'Slider ID là bắt buộc',
    }),
})

const ProductImagesModel = {
    // Tạo product image mới
    async createProductImage(data) {
        const { error, value } = PRODUCT_IMAGES_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        const conn = getConnection()
        const [result] = await conn.execute(
            `INSERT INTO ${PRODUCT_IMAGES_TABLE_NAME} (is_main, image_url, product_id, slider_id) VALUES (?, ?, ?, ?)`,
            [value.is_main, value.image_url, value.product_id, value.slider_id]
        )

        return { id: result.insertId, ...value }
    },

    // Lấy product image theo ID
    async getProductImageById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${PRODUCT_IMAGES_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    // Cập nhật product image theo ID
    async updateProductImage(id, data) {
        const schema = PRODUCT_IMAGES_SCHEMA.fork(
            Object.keys(PRODUCT_IMAGES_SCHEMA.describe().keys),
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
            `UPDATE ${PRODUCT_IMAGES_TABLE_NAME} SET ${setClause} WHERE id = ?`,
            [...values, id]
        )

        return this.getProductImageById(id)
    },

    // Xóa product image theo ID
    async deleteProductImage(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${PRODUCT_IMAGES_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    // Lấy danh sách product images
    async listProductImages(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${PRODUCT_IMAGES_TABLE_NAME} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    // Lấy tất cả images của một product
    async getImagesByProduct(product_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${PRODUCT_IMAGES_TABLE_NAME} WHERE product_id = ? ORDER BY is_main DESC, id ASC`,
            [product_id]
        )
        return rows
    },

    // Lấy tất cả images của một slider
    async getImagesBySlider(slider_id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${PRODUCT_IMAGES_TABLE_NAME} WHERE slider_id = ? ORDER BY is_main DESC, id ASC`,
            [slider_id]
        )
        return rows
    },
}

export { PRODUCT_IMAGES_TABLE_NAME, PRODUCT_IMAGES_SCHEMA, ProductImagesModel }
