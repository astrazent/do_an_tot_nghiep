import { paymentService } from '~/services/paymentService.js'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import moment from 'moment-timezone'
import qs from 'qs'
import crypto from 'crypto'
const addPayment = async (req, res, next) => {
    try {
        const data = await paymentService.addPaymentService(
            req.body.method,
            req.body.status
        )
        return res.status(StatusCodes.OK).json({
            message: 'Thêm phương thức thanh toán thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getAllPayments = async (req, res, next) => {
    try {
        const data = await paymentService.getAllPaymentsService()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy tất cả phương thức thanh toán thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const updatePayment = async (req, res, next) => {
    try {
        const data = await paymentService.updatePaymentService(
            req.body.id,
            req.body.method,
            req.body.status
        )
        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật phương thức thanh toán thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getPaymentById = async (req, res, next) => {
    try {
        const data = await paymentService.getPaymentByIdService(
            req.query.paymentId
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy phương thức thanh toán thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getPaymentByMethod = async (req, res, next) => {
    try {
        const data = await paymentService.getPaymentByMethodService(
            req.query.paymentMethod
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy phương thức thanh toán thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getActivePayment = async (req, res, next) => {
    try {
        const data = await paymentService.getActivePaymentService()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy phương thức thanh toán đang hoạt động thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deletePayment = async (req, res, next) => {
    try {
        const data = await paymentService.deletePaymentService(
            req.query.paymentId
        )
        return res.status(StatusCodes.OK).json({
            data,
        })
    } catch (error) {
        next(error)
    }
}

const createVnpayUrl = (req, res, next) => {
    try {
        let { amount } = req.body
        if (!amount) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Thiếu amount',
            })
        }
        amount = parseInt(amount, 10)
        if (isNaN(amount) || amount <= 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Amount không hợp lệ',
            })
        }
        let date = new Date()
        let createDate = moment()
            .tz('Asia/Ho_Chi_Minh')
            .format('YYYYMMDDHHmmss')
        let ipAddr =
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress
        let tmnCode = env.VNP_TMN_CODE
        let secretKey = env.VNP_HASH_SECRET
        let vnpUrl = env.VNP_URL
        let returnUrl = env.VNP_RETURN_URL
        let orderId = moment(date).format('DDHHmmss')
        let bankCode = ''
        let locale = 'vn'
        let currCode = 'VND'
        let vnp_Params = {}
        vnp_Params['vnp_Version'] = '2.1.0'
        vnp_Params['vnp_Command'] = 'pay'
        vnp_Params['vnp_TmnCode'] = tmnCode
        vnp_Params['vnp_Locale'] = locale
        vnp_Params['vnp_CurrCode'] = currCode
        vnp_Params['vnp_TxnRef'] = orderId
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId
        vnp_Params['vnp_OrderType'] = 'other'
        vnp_Params['vnp_Amount'] = amount * 100
        vnp_Params['vnp_ReturnUrl'] = returnUrl
        vnp_Params['vnp_IpAddr'] = ipAddr
        vnp_Params['vnp_CreateDate'] = createDate
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode
        }
        vnp_Params = sortObject(vnp_Params)

        const signData = qs.stringify(vnp_Params, { encode: false })
        const hmac = crypto.createHmac('sha512', secretKey)
        const signed = hmac.update(Buffer.from(signData, 'utf8')).digest('hex')
        vnp_Params['vnp_SecureHash'] = signed

        const vnpUrlFull =
            vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false })
        return res.status(StatusCodes.OK).json({ url: vnpUrlFull })
    } catch (error) {
        next(error)
    }
}

function sortObject(obj) {
    let sorted = {}
    let str = []
    let key
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key))
        }
    }
    str.sort()
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
            /%20/g,
            '+'
        )
    }
    return sorted
}

const handleVnpayReturn = (req, res) => {
    const vnpHashSecret = env.VNP_HASH_SECRET
    const query = { ...req.query }
    const secureHash = query.vnp_SecureHash
    delete query.vnp_SecureHash
    delete query.vnp_SecureHashType
    const sorted = sortObject(query)
    const signData = qs.stringify(sorted, { encode: false })
    const hmac = crypto.createHmac('sha512', vnpHashSecret)
    const checkHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
    if (checkHash === secureHash) {
        if (query.vnp_ResponseCode === '00') {
            const redirectUrl =
                `${env.FE_BASE_URL}/vnpay/return?` +
                qs.stringify(
                    {
                        success: true,
                        code: '00',
                        message: 'Thanh toán thành công',
                        ...query,
                    },
                    { encode: false }
                )

            return res.redirect(redirectUrl)
        } else {
            const redirectUrl =
                `${env.FE_BASE_URL}/vnpay/return?` +
                qs.stringify(
                    {
                        success: false,
                        code: query.vnp_ResponseCode,
                        message: 'Thanh toán thất bại',
                        ...query,
                    },
                    { encode: false }
                )

            return res.redirect(redirectUrl)
        }
    } else {
        const redirectUrl =
            `${env.FE_BASE_URL}/vnpay/return?` +
            qs.stringify(
                {
                    success: false,
                    code: 'invalid_hash',
                    message: 'Sai chữ ký',
                },
                { encode: false }
            )

        return res.redirect(redirectUrl)
    }
}

export const paymentController = {
    addPayment,
    getAllPayments,
    updatePayment,
    getPaymentById,
    getPaymentByMethod,
    deletePayment,
    getActivePayment,
    createVnpayUrl,
    handleVnpayReturn,
}
