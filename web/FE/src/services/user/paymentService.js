import api from './api'
import { createVnpayPayment } from '~/utils/vnpay'
import { setOrderFromPayload } from '~/Redux/reducers/orderReducer'

export const getAllActivePayments = async () => {
    try {
        const response = await api.get('/payment/active')
        return response.data.data || []
    } catch (error) {
        console.error('Lỗi khi tải danh sách phương thức thanh toán:', error)
        throw error
    }
}

const handleCodPayment = (orderData, { onSubmit, showAlert }) => {
    console.log('Xử lý thanh toán COD...')
    onSubmit(orderData)
    console.log('Đơn hàng COD đã được tạo!')
}

const handlePosPayment = (orderData, { onSubmit, showAlert }) => {
    console.log('Xử lý thanh toán POS tại nơi giao hàng...')
    onSubmit(orderData)
    console.log('Đơn hàng POS đã được tạo!')
}

const handleVnPayPayment = async (orderData, { dispatch }) => {
    console.log('Dữ liệu nhận được:', orderData)
    console.log('Bắt đầu xử lý thanh toán VNPay...')

    dispatch(setOrderFromPayload(orderData))

    try {
        const totalAmount = orderData.amount

        const vnpayRes = await createVnpayPayment(totalAmount)

        if (vnpayRes?.url) {
            window.location.href = vnpayRes.url
            return
        }

        console.log('Không lấy được URL thanh toán VNPay')
    } catch (error) {
        console.error('Lỗi khi tạo link thanh toán VNPay:', error)
        console.error('Không thể tạo yêu cầu thanh toán. Vui lòng thử lại sau.')
    }
}

const handleVietQrPayment = async (orderData, { onSubmit, showAlert }) => {
    console.log('Bắt đầu xử lý thanh toán VietQR...')
    console.log('Chuẩn bị hiển thị mã QR.')

    try {
        console.log('Đã tạo đơn hàng, bây giờ sẽ hiển thị mã QR.')
    } catch (error) {
        console.error('Lỗi khi tạo mã VietQR:', error)
        console.error('Không thể tạo mã QR. Vui lòng thử lại sau.')
    }
}

const handleMomoPayment = async (orderData, { onSubmit, showAlert }) => {
    console.log('Bắt đầu xử lý thanh toán MoMo...')
    console.log('Chuẩn bị chuyển hướng đến cổng thanh toán MoMo.')

    try {
        console.log(
            'Đã tạo đơn hàng, chuẩn bị chuyển hướng người dùng đến MoMo.'
        )
    } catch (error) {
        console.error('Lỗi khi tạo link thanh toán MoMo:', error)
        console.error(
            'Không thể tạo yêu cầu thanh toán MoMo. Vui lòng thử lại sau.'
        )
    }
}

const handleZaloPayPayment = async (orderData, { onSubmit, showAlert }) => {
    console.log('Bắt đầu xử lý thanh toán ZaloPay...')
    console.log('Chuẩn bị chuyển hướng đến cổng thanh toán ZaloPay.')

    try {
        console.log(
            'Đã tạo đơn hàng, chuẩn bị chuyển hướng người dùng đến ZaloPay.'
        )
    } catch (error) {
        console.error('Lỗi khi tạo link thanh toán ZaloPay:', error)
        console.error(
            'Không thể tạo yêu cầu thanh toán ZaloPay. Vui lòng thử lại sau.'
        )
    }
}

const handleCreditCardPayment = async (orderData, { onSubmit, showAlert }) => {
    console.log('Bắt đầu xử lý thanh toán bằng Thẻ tín dụng...')
    console.log('Chuẩn bị chuyển hướng đến cổng thanh toán Thẻ tín dụng.')

    try {
        console.log(
            'Đã tạo đơn hàng, chuẩn bị chuyển hướng người dùng đến Thẻ tín dụng.'
        )
    } catch (error) {
        console.error('Lỗi khi tạo link thanh toán Credit Card:', error)
        console.error(
            'Không thể tạo yêu cầu thanh toán Thẻ tín dụng. Vui lòng thử lại sau.',
            { type: 'error' }
        )
    }
}

const paymentHandlers = {
    cod: handleCodPayment,
    pos: handlePosPayment,
    vnpay: handleVnPayPayment,
    vietqr: handleVietQrPayment,
    momo: handleMomoPayment,
    zalopay: handleZaloPayPayment,
    creditcard: handleCreditCardPayment,
}

const BEPayload = (formData, subtotal, shippingFee, userId, items = []) => {
    const payload = {
        user_id: userId,
        payment_method: formData.payment_method
            .toLowerCase()
            .replace(/\s+/g, ''),
        shipment_method: formData.shipment_method
            .toLowerCase()
            .replace(/\s+/g, ''),
        status: 'pending',
        deli_name: formData.deli_name,
        deli_phone: formData.deli_phone,
        deli_email: formData.deli_email,
        deli_address: formData.deli_address,
        deli_city: formData.deli_city,
        deli_district: formData.deli_district,
        deli_ward: formData.deli_ward,
        message: formData.message,
        shipment_status: 'pending',
        shipping_fee: shippingFee,
        shipped_at: null,
        delivered_at: null,
        amount: subtotal + shippingFee,
    }

    if (!userId && Array.isArray(items) && items.length > 0) {
        payload.items = items.map(i => ({
            product_id: i.product_id,
            qty_total: i.qty_total,
            amount_total: i.amount_total,
        }))
    }

    return payload
}

export const processPayment = (method, formData, options) => {
    const key = method.toLowerCase()
    const handler = paymentHandlers[key]
    if (!handler) {
        console.error(`Không tìm thấy bộ xử lý cho phương thức: ${method}`)
        options.showAlert?.('Phương thức thanh toán không hợp lệ.', {
            type: 'error',
        })
        return
    }
    const {
        dispatch,
        subtotal = 0,
        shippingFee = 0,
        userId = null,
        items = [],
        onSubmit,
        showAlert,
    } = options
    const backendPayload = BEPayload(
        formData,
        subtotal,
        shippingFee,
        userId,
        items
    )

    return handler(backendPayload, { dispatch, onSubmit, showAlert })
}
