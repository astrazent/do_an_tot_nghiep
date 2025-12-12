import { getConnection } from '../config/mysql.js'
import Joi from 'joi'

const TRANSACTIONS_TABLE_NAME = 'Transactions'

const TRANSACTIONS_SCHEMA = Joi.object({
    status: Joi.string()
        .valid('pending', 'confirmed', 'canceled', 'refunded', 'completed')
        .default('pending')
        .required()
        .messages({
            'any.only':
                'Status chỉ được là: pending, confirmed, canceled, refunded hoặc completed',
            'any.required': 'Status là bắt buộc',
        }),

    deli_name: Joi.string().min(3).max(100).optional().messages({
        'string.min': 'Tên người nhận tối thiểu 3 ký tự',
        'string.max': 'Tên người nhận tối đa 100 ký tự',
    }),

    deli_phone: Joi.string().min(5).max(20).optional().messages({
        'string.min': 'Số điện thoại tối thiểu 5 ký tự',
        'string.max': 'Số điện thoại tối đa 20 ký tự',
    }),

    deli_address: Joi.string().min(5).max(255).optional().messages({
        'string.min': 'Địa chỉ tối thiểu 5 ký tự',
        'string.max': 'Địa chỉ tối đa 255 ký tự',
    }),

    deli_email: Joi.string().email().max(255).allow(null, '').messages({
        'string.email': 'Email không hợp lệ',
        'string.max': 'Email tối đa 255 ký tự',
    }),

    deli_city: Joi.string().min(2).max(100).allow(null, '').optional(),
    deli_district: Joi.string().min(2).max(100).allow(null, '').optional(),
    deli_ward: Joi.string().min(2).max(100).allow(null, '').optional(),

    message: Joi.string().max(255).allow('', null).default('').messages({
        'string.max': 'Message tối đa 255 ký tự',
    }),

    shipping_fee: Joi.number().precision(2).min(0).default(0).messages({
        'number.base': 'Shipping fee phải là số',
        'number.min': 'Shipping fee tối thiểu là 0',
    }),

    payment_status: Joi.string()
        .valid('pending', 'paid', 'failed', 'refunded')
        .default('pending')
        .messages({
            'any.only':
                'Payment status chỉ được là: pending, paid, failed, refunded',
        }),

    shipment_status: Joi.string()
        .valid('pending', 'shipped', 'in_transit', 'delivered', 'returned')
        .default('pending')
        .messages({
            'any.only':
                'Shipment status chỉ được là: pending, shipped, in_transit, delivered, returned',
        }),

    amount: Joi.number().precision(2).min(0).default(0).messages({
        'number.base': 'Amount phải là số',
        'number.min': 'Amount tối thiểu là 0',
    }),

    source: Joi.string()
        .valid('chatbot', 'system')
        .allow(null, '')
        .optional()
        .messages({
            'any.only': 'Source chỉ được là chatbot hoặc system',
            'string.base': 'Source phải là chuỗi nếu có',
        }),

    shipped_at: Joi.date().allow(null),
    delivered_at: Joi.date().allow(null),

    user_id: Joi.number().integer().allow(null),
    payment_id: Joi.number().integer().required(),
    shipment_id: Joi.number().integer().required(),

    items: Joi.array()
        .items(
            Joi.object({
                product_id: Joi.number().integer().required(),
                qty_total: Joi.number().integer().min(1).required(),
                amount_total: Joi.number().precision(2).min(0).required(),
            })
        )
        .min(1)
        .required()
        .messages({
            'array.base': 'Items phải là một mảng',
            'array.min': 'Items phải có ít nhất 1 sản phẩm',
            'any.required': 'Danh sách sản phẩm là bắt buộc',
        }),
}).custom((value, helpers) => {
    if ('tracking_number' in value) {
        return helpers.error('any.custom', {
            message: 'tracking_number được sinh tự động',
        })
    }
    return value
}, 'Check forbidden tracking_number')

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

async function generateUniqueTrackingNumber() {
    const conn = getConnection()
    let tracking
    const PREFIX = 'TRK'
    const LENGTH = 8

    while (true) {
        tracking = PREFIX + generateRandomString(LENGTH)

        const [rows] = await conn.execute(
            `SELECT id FROM ${TRANSACTIONS_TABLE_NAME} WHERE tracking_number = ? LIMIT 1`,
            [tracking]
        )

        if (rows.length === 0) break
    }

    return tracking
}

const TransactionsModel = {
    async createTransaction(data) {
        const { error, value } = TRANSACTIONS_SCHEMA.validate(data, {
            abortEarly: false,
        })
        if (error) throw error

        value.tracking_number = await generateUniqueTrackingNumber()
        const conn = getConnection()
        const { items } = data

        await conn.beginTransaction()

        try {
            const [result] = await conn.execute(
                `INSERT INTO ${TRANSACTIONS_TABLE_NAME}
                (status, source, deli_name, deli_phone, deli_address, deli_email, deli_city, deli_district, deli_ward,
                message, tracking_number, shipping_fee, shipment_status, amount, shipped_at, delivered_at,
                user_id, payment_id, shipment_id, payment_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    value.status,
                    value.source,
                    value.deli_name,
                    value.deli_phone,
                    value.deli_address,
                    value.deli_email,
                    value.deli_city,
                    value.deli_district,
                    value.deli_ward,
                    value.message,
                    value.tracking_number,
                    value.shipping_fee,
                    value.shipment_status,
                    value.amount,
                    value.shipped_at,
                    value.delivered_at,
                    value.user_id,
                    value.payment_id,
                    value.shipment_id,
                    value.payment_status,
                ]
            )

            const transactionId = result.insertId

            if (Array.isArray(items) && items.length > 0) {
                const orderItemValues = items.map(i => [
                    i.qty_total,
                    i.amount_total,
                    transactionId,
                    i.product_id,
                ])

                await conn.query(
                    `INSERT INTO OrderItems (qty_total, amount_total, transaction_id, product_id)
                    VALUES ?`,
                    [orderItemValues]
                )
            }

            await conn.commit()
            return { id: transactionId, ...value, items }
        } catch (err) {
            await conn.rollback()
            throw err
        }
    },

    async getTransactionByEmailAndSlug(user_id, product_id) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `SELECT 
            oi.*,
            t.status AS transaction_status,
            t.payment_status,
            t.shipment_status
            FROM OrderItems oi
            JOIN Transactions t ON t.id = oi.transaction_id
            WHERE t.user_id = ? AND oi.product_id = ?`,
            [user_id, product_id]
        )

        return rows || null
    },

    async getTransactionById(id) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${TRANSACTIONS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return rows[0] || null
    },

    async updateTransaction(id, data) {
        const schema = TRANSACTIONS_SCHEMA.fork(
            Object.keys(TRANSACTIONS_SCHEMA.describe().keys),
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
            `UPDATE ${TRANSACTIONS_TABLE_NAME}
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
            [...values, id]
        )

        return this.getTransactionById(id)
    },

    async deleteByUserAndTrackingNumber(user_id, tracking_number) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${TRANSACTIONS_TABLE_NAME} 
            WHERE user_id = ? 
            AND tracking_number = ? 
            AND status = 'pending' 
            AND shipment_status = 'pending'`,
            [user_id, tracking_number]
        )
        return result.affectedRows > 0
    },

    async deleteTransaction(id) {
        const conn = getConnection()
        const [result] = await conn.execute(
            `DELETE FROM ${TRANSACTIONS_TABLE_NAME} WHERE id = ?`,
            [id]
        )
        return result.affectedRows > 0
    },

    async listTransactions(limit = 50, offset = 0) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${TRANSACTIONS_TABLE_NAME}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?`,
            [limit, offset]
        )
        return rows
    },

    async getTransactionsByUser(user_id) {
        const conn = getConnection()

        const [rows] = await conn.execute(
            `SELECT 
            t.id AS transaction_id,
            t.status,
            t.deli_name,
            t.deli_phone,
            t.deli_address,
            t.deli_email,
            t.deli_city,
            t.deli_district,
            t.deli_ward,
            t.message,
            t.tracking_number,
            t.shipping_fee,
            t.shipment_status,
            t.amount,
            t.shipped_at,
            t.delivered_at,
            t.created_at,
            t.updated_at,
            
            oi.id AS orderitem_id,
            oi.qty_total,
            oi.amount_total,
            oi.product_id,
            pdt.name AS product_name,
            
            pay.method AS payment_method,
            
            s.name AS shipment_name
        FROM Transactions t
        LEFT JOIN OrderItems oi ON t.id = oi.transaction_id
        LEFT JOIN Products pdt ON oi.product_id = pdt.id
        LEFT JOIN Payments pay ON t.payment_id = pay.id
        LEFT JOIN Shipments s ON t.shipment_id = s.id
        WHERE t.user_id = ?
        ORDER BY t.created_at DESC, oi.id ASC`,
            [user_id]
        )

        const transactionsMap = new Map()

        for (const row of rows) {
            const {
                transaction_id,
                orderitem_id,
                qty_total,
                amount_total,
                product_id,
                product_name,
                payment_method,
                shipment_name,
                ...transactionData
            } = row

            if (!transactionsMap.has(transaction_id)) {
                transactionsMap.set(transaction_id, {
                    ...transactionData,
                    id: transaction_id,
                    items: [],
                    payment: {
                        method: payment_method,
                    },
                    shipment: {
                        name: shipment_name,
                    },
                })
            }

            if (orderitem_id) {
                transactionsMap.get(transaction_id).items.push({
                    id: orderitem_id,
                    product_id,
                    name: product_name,
                    qty_total,
                    amount_total,
                })
            }
        }

        return Array.from(transactionsMap.values())
    },

    async getTransactionsByStatus(status) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${TRANSACTIONS_TABLE_NAME}
            WHERE status = ?
            ORDER BY created_at DESC`,
            [status]
        )
        return rows
    },

    async getTransactionsByShipmentStatus(shipment_status) {
        const conn = getConnection()
        const [rows] = await conn.execute(
            `SELECT * FROM ${TRANSACTIONS_TABLE_NAME}
            WHERE shipment_status = ?
            ORDER BY created_at DESC`,
            [shipment_status]
        )
        return rows
    },
}

export { TRANSACTIONS_TABLE_NAME, TRANSACTIONS_SCHEMA, TransactionsModel }
