import api from '~/services/user/api'
export const createVnpayPayment = async amount => {
    const body = {
        amount,
    }

    const res = await api.post('/payment/vnpay/create_payment', body)
    return res.data
}
