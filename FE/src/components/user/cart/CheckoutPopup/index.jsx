import React, { useState } from 'react'
import BasePopup from '~/components/shared/BasePopup'
import { FiCheckCircle } from 'react-icons/fi'
import { FaMoneyBillWave, FaCreditCard } from 'react-icons/fa'
import vnpayLogo from '~/assets/icon/logo/vnpay.png'
import vietqrLogo from '~/assets/icon/logo/vietqr.png'

const CheckoutPopup = ({ total, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: 'B21DCCN479_Vũ Trung Lập',
        email: 'kendyvu2k3@gmail.com',
        phone: '0123456789',
        address: '1',
        province: 'Thành phố Hà Nội',
        district: 'Quận Ba Đình',
        ward: 'Phường Phúc Xá',
        notes: '',
        paymentMethod: 'cod',
        giftCode: '',
    })

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = e => {
        e.preventDefault()

        if (
            !formData.name ||
            !formData.phone ||
            !formData.address ||
            !formData.province ||
            !formData.district ||
            !formData.ward
        ) {
            alert('Vui lòng điền đầy đủ thông tin giao hàng bắt buộc.')
            return
        }
        onSubmit(formData)
    }
    const shippingFee = 15000
    const subtotal = total - shippingFee

    const vouchers = [
        {
            id: 1,
            discount: '60.000đ',
            condition: 'Đơn từ 250.000đ',
            expiry: '23 ngày',
        },
        {
            id: 2,
            discount: '25%',
            condition: 'Đơn từ 250.000đ',
            expiry: '13 ngày',
        },
        {
            id: 3,
            discount: '20%',
            condition: 'Đơn từ 200.000đ',
            expiry: '8 ngày',
        },
        {
            id: 4,
            discount: '40.000đ',
            condition: 'Đơn từ 300.000đ',
            expiry: '16 ngày',
        },
    ]

    return (
        <BasePopup title="Thông tin thanh toán" onClose={onClose}>
            <form
                onSubmit={handleSubmit}
                className="space-y-6 divide-y divide-gray-200"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Số điện thoại
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Địa chỉ
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Số nhà, tên đường..."
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Tỉnh/Thành phố
                            </label>
                            <select
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option>Thành phố Hà Nội</option>
                                <option>Thành phố Hồ Chí Minh</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Quận/Huyện
                            </label>
                            <select
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option>Quận Ba Đình</option>
                                <option>Quận Hoàn Kiếm</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Phường/Xã
                            </label>
                            <select
                                name="ward"
                                value={formData.ward}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option>Phường Phúc Xá</option>
                                <option>Phường Trúc Bạch</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Ghi chú
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="2"
                            placeholder="Bạn có ghi chú gì cho cửa hàng không?"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        ></textarea>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Phí vận chuyển
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Các tỉnh thành thuộc khu vực miễn phí vận chuyển sẽ
                            được cửa hàng liên hệ báo sau.
                        </p>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-800">
                                    Khoảng cách:
                                </span>
                                <span className="font-medium text-red-600">
                                    13 km
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-800">
                                    Phí vận chuyển:
                                </span>
                                <span className="font-medium text-red-600">
                                    {shippingFee.toLocaleString('vi-VN')} VND
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            Phương thức thanh toán
                        </h3>
                        <div className="mt-4 space-y-3">
                            <label className="border border-gray-300 rounded-lg p-4 flex items-center cursor-pointer has-[:checked]:border-blue-600 has-[:checked]:ring-1 has-[:checked]:ring-blue-600">
                                <div className="w-6 flex justify-center flex-shrink-0">
                                    <FaMoneyBillWave className="text-green-600 text-xl" />
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={
                                            formData.paymentMethod === 'cod'
                                        }
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-sm font-medium text-gray-800">
                                        Thanh toán tiền mặt khi nhận hàng
                                    </span>
                                </div>
                            </label>

                            <label className="border border-gray-300 rounded-lg p-4 flex items-center cursor-pointer has-[:checked]:border-blue-600 has-[:checked]:ring-1 has-[:checked]:ring-blue-600">
                                <div className="w-6 flex justify-center flex-shrink-0">
                                    <FaCreditCard className="text-indigo-600 text-xl" />
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="pos"
                                        checked={
                                            formData.paymentMethod === 'pos'
                                        }
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-sm font-medium text-gray-800">
                                        Thanh toán quẹt thẻ khi giao hàng (POS)
                                    </span>
                                </div>
                            </label>

                            <label className="border border-gray-300 rounded-lg p-4 flex items-center cursor-pointer has-[:checked]:border-blue-600 has-[:checked]:ring-1 has-[:checked]:ring-blue-600">
                                <div className="w-6 flex justify-center flex-shrink-0">
                                    <img
                                        src={vnpayLogo}
                                        alt="VNPay"
                                        className="w-6 h-6 object-contain"
                                    />
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="vnpay"
                                        checked={
                                            formData.paymentMethod === 'vnpay'
                                        }
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-sm font-medium text-gray-800">
                                        Thanh toán qua cổng VNPay
                                    </span>
                                </div>
                            </label>

                            <label className="border border-gray-300 rounded-lg p-4 flex items-center cursor-pointer has-[:checked]:border-blue-600 has-[:checked]:ring-1 has-[:checked]:ring-blue-600">
                                <div className="w-6 flex justify-center flex-shrink-0">
                                    <img
                                        src={vietqrLogo}
                                        alt="VietQR"
                                        className="w-5 h-5 object-contain"
                                    />
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="vietqr"
                                        checked={
                                            formData.paymentMethod === 'vietqr'
                                        }
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-sm font-medium text-gray-800">
                                        Thanh toán qua mã VietQR
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-gray-700">Tiền hàng:</span>
                            <span className="text-gray-900">
                                {subtotal.toLocaleString('vi-VN')} VND
                            </span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-gray-700">
                                Phí vận chuyển:
                            </span>
                            <span className="text-gray-900">
                                {shippingFee.toLocaleString('vi-VN')} VND
                            </span>
                        </div>
                        <div className="flex justify-between text-base font-bold">
                            <span className="text-gray-900">
                                Tổng thanh toán:
                            </span>
                            <span className="text-red-600">
                                {total.toLocaleString('vi-VN')} VND
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center items-center pt-10 px-4 mt-8 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#00b33c] hover:bg-[#009933] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b33c]"
                    >
                        <FiCheckCircle className="mr-2" />
                        HOÀN TẤT ĐƠN HÀNG
                    </button>
                </div>
            </form>
        </BasePopup>
    )
}

export default CheckoutPopup
