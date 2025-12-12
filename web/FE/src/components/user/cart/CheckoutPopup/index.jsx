import React, { useState, useEffect, useMemo } from 'react'
import BasePopup from '~/components/shared/BasePopup'
import { FiCheckCircle } from 'react-icons/fi'
import { FaShippingFast } from 'react-icons/fa'
import provincesData from '~/assets/data/provinces.json'
import { getAllShipments } from '~/services/user/shipmentService'
import { processPayment } from '~/services/user/paymentService'
import { useAllActivePayments } from '~/hooks/user/usePayment'
import { useAlert } from '~/contexts/AlertContext'
import { useDispatch } from 'react-redux'

const CheckoutPopup = ({
    total,
    onClose,
    onSubmit,
    user,
    cartItems = null,
}) => {
    const { showAlert } = useAlert()
    const dispatch = useDispatch()
    const { data: paymentsData, isLoading: isLoadingPayments } =
        useAllActivePayments()
    const [payments, setPayments] = useState([])
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        province: '',
        district: '',
        ward: '',
        notes: '',
        paymentMethod: 'cod',
        giftCode: '',
    })

    const [allProvinces] = useState(provincesData)
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [shipments, setShipments] = useState([])

    useEffect(() => {
        if (paymentsData) {
            const activePayments = paymentsData.filter(p => p.status === 1)
            setPayments(activePayments)
            if (activePayments.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    paymentMethod: activePayments[0].method,
                }))
            }
        }
    }, [paymentsData])

    useEffect(() => {
        const fetchShipments = async () => {
            try {
                const shipmentsData = await getAllShipments()
                const activeShipments = shipmentsData
                    .filter(s => s.status === 1)
                    .map(s => ({
                        ...s,
                        displayFee:
                            parseFloat(s.base_fee) + randomFee(10000, 50000),
                    }))
                setShipments(activeShipments)
                if (activeShipments.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        shipmentMethod: activeShipments[0].id.toString(),
                    }))
                }
            } catch (error) {
                console.error('Không thể tải danh sách vận chuyển:', error)
            }
        }

        fetchShipments()
    }, [])

    useEffect(() => {
        if (user) {
            const selectedProvince = allProvinces.find(
                p => p.Name === user.city
            )
            const provinceId = selectedProvince ? selectedProvince.Id : ''
            const districtsOfSelectedProvince =
                selectedProvince?.Districts || []
            setDistricts(districtsOfSelectedProvince)

            const selectedDistrict = districtsOfSelectedProvince.find(
                d => d.Name === user.district
            )
            const districtId = selectedDistrict ? selectedDistrict.Id : ''
            const wardsOfSelectedDistrict = selectedDistrict?.Wards || []
            setWards(wardsOfSelectedDistrict)

            const selectedWard = wardsOfSelectedDistrict.find(
                w => w.Name === user.ward
            )
            const wardId = selectedWard ? selectedWard.Id : ''

            setFormData(prev => ({
                ...prev,
                name: user.full_name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                province: provinceId,
                district: districtId,
                ward: wardId,
            }))
        }
    }, [user, allProvinces])

    useEffect(() => {
        if (formData.province) {
            const selectedProvince = allProvinces.find(
                p => p.Id === formData.province
            )
            setDistricts(selectedProvince?.Districts || [])
        } else {
            setDistricts([])
        }
        setWards([])
    }, [formData.province, allProvinces])

    useEffect(() => {
        if (formData.district) {
            const selectedDistrict = districts.find(
                d => d.Id === formData.district
            )
            setWards(selectedDistrict?.Wards || [])
        } else {
            setWards([])
        }
    }, [formData.district, districts])

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => {
            const newState = { ...prev, [name]: value }

            if (name === 'province') {
                newState.district = ''
                newState.ward = ''
            }

            if (name === 'district') {
                newState.ward = ''
            }

            return newState
        })
    }

    const handleSubmit = e => {
        e.preventDefault()

        const showError = msg => {
            showAlert(msg, { type: 'error' })
            throw new Error('Validation stopped')
        }

        if (!formData.name.trim()) showError('Vui lòng nhập họ và tên.')
        if (formData.name.length < 3 || formData.name.length > 100)
            showError('Tên người nhận phải từ 3 ký tự trở lên.')

        if (!formData.phone.trim()) showError('Vui lòng nhập số điện thoại.')
        if (formData.phone.length < 5 || formData.phone.length > 20)
            showError('Số điện thoại phải từ 5–20 ký tự.')

        if (!formData.address.trim())
            showError('Vui lòng nhập địa chỉ nhận hàng.')
        if (formData.address.length < 5 || formData.address.length > 255)
            showError('Địa chỉ phải từ 5 ký tự trở lên.')

        if (!formData.province) showError('Vui lòng chọn Tỉnh/Thành phố.')
        if (!formData.district) showError('Vui lòng chọn Quận/Huyện.')
        if (!formData.ward) showError('Vui lòng chọn Phường/Xã.')
        if (!formData.shipmentMethod)
            showError('Vui lòng chọn phương thức vận chuyển.')
        if (!formData.paymentMethod)
            showError('Vui lòng chọn phương thức thanh toán.')
        if (formData.notes && formData.notes.length > 255)
            showError('Ghi chú tối đa 255 ký tự.')
        if (shippingFee < 0) showError('Phí vận chuyển không hợp lệ.')

        const selectedProvince = allProvinces.find(
            p => p.Id === formData.province
        )
        const selectedDistrict = districts.find(d => d.Id === formData.district)
        const selectedWard = wards.find(w => w.Id === formData.ward)
        const selectedShipment = shipments.find(
            s => s.id.toString() === formData.shipmentMethod
        )
        const submissionData = {
            deli_name: formData.name,
            deli_phone: formData.phone,
            deli_email: formData.email,
            deli_address: formData.address,
            deli_city: selectedProvince?.Name || '',
            deli_district: selectedDistrict?.Name || '',
            deli_ward: selectedWard?.Name || '',
            message: formData.notes || '',
            shipment_method: selectedShipment?.name || null,
            shipping_fee: shippingFee,
            amount: subtotal,
            user_id: user?.user_id || null,
            payment_method: formData.paymentMethod,
        }
        let items = null
        if (cartItems != null) {
            items = cartItems.map(item => ({
                product_id: item.productId,
                qty_total: item.quantity,
                amount_total: item.price * item.quantity,
            }))
        }
        try {
            processPayment(formData.paymentMethod, submissionData, {
                onSubmit,
                dispatch,
                subtotal,
                shippingFee,
                userId: user?.user_id || null,
                items,
                showAlert,
            })
        } catch (error) {
            showAlert('Xử lý thanh toán thất bại', { type: 'error' })
            console.error(error)
        }
    }

    const randomFee = (min, max) => {
        const minK = Math.ceil(min / 1000)
        const maxK = Math.floor(max / 1000)
        const randK = Math.floor(Math.random() * (maxK - minK + 1)) + minK
        return randK * 1000
    }

    const shippingFee = useMemo(() => {
        const selectedShipment = shipments.find(
            s => s.id.toString() === formData.shipmentMethod
        )
        return selectedShipment ? selectedShipment.displayFee : 0
    }, [formData.shipmentMethod, shipments])

    const subtotal = total
    const finalTotal = subtotal + shippingFee

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
                            Email (tuỳ chọn)
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
                                <option value="">Chọn tỉnh/thành</option>
                                {allProvinces.map(province => (
                                    <option
                                        key={province.Id}
                                        value={province.Id}
                                    >
                                        {province.Name}
                                    </option>
                                ))}
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
                                disabled={!formData.province}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                            >
                                <option value="">Chọn quận/huyện</option>
                                {districts.map(district => (
                                    <option
                                        key={district.Id}
                                        value={district.Id}
                                    >
                                        {district.Name}
                                    </option>
                                ))}
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
                                disabled={!formData.district}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                            >
                                <option value="">Chọn phường/xã</option>
                                {wards.map(ward => (
                                    <option key={ward.Id} value={ward.Id}>
                                        {ward.Name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Ghi chú (tuỳ chọn)
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
                </div>

                <div className="space-y-6 pt-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            Phương thức vận chuyển
                        </h3>
                        <div className="mt-4 space-y-3">
                            {shipments.map(shipment => {
                                const randomAddition =
                                    Math.floor(
                                        Math.random() * (50 - 10 + 1) + 10
                                    ) * 1000

                                return (
                                    <label
                                        key={shipment.id}
                                        className="border border-gray-300 rounded-lg p-4 flex items-start cursor-pointer has-[:checked]:border-blue-600 has-[:checked]:ring-1 has-[:checked]:ring-blue-600"
                                    >
                                        <div className="w-6 h-6 flex justify-center items-center flex-shrink-0">
                                            {shipment.icon_url ? (
                                                <img
                                                    src={shipment.icon_url}
                                                    alt={shipment.name}
                                                    className="w-6 h-6 object-contain"
                                                />
                                            ) : (
                                                <FaShippingFast className="text-blue-600 text-xl" />
                                            )}
                                        </div>

                                        <div className="flex-1 flex justify-between ml-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="shipmentMethod"
                                                        value={shipment.id}
                                                        checked={
                                                            formData.shipmentMethod ===
                                                            shipment.id.toString()
                                                        }
                                                        onChange={handleChange}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {shipment.name}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {shipment.description}
                                                </p>
                                            </div>
                                            <span className="text-sm font-semibold text-red-600 self-center">
                                                {shipment.displayFee.toLocaleString(
                                                    'vi-VN'
                                                )}{' '}
                                                VND
                                            </span>
                                        </div>
                                    </label>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            Phương thức thanh toán
                        </h3>
                        <div className="mt-4 space-y-3">
                            {isLoadingPayments ? (
                                <p>Đang tải các phương thức thanh toán...</p>
                            ) : (
                                payments.map(payment => (
                                    <label
                                        key={payment.id}
                                        className="border border-gray-300 rounded-lg p-4 flex items-center cursor-pointer has-[:checked]:border-blue-600 has-[:checked]:ring-1 has-[:checked]:ring-blue-600"
                                    >
                                        <div className="w-6 flex justify-center flex-shrink-0">
                                            <img
                                                src={payment.icon_url}
                                                alt={payment.method}
                                                className="w-6 h-6 object-contain"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={payment.method}
                                                checked={
                                                    formData.paymentMethod ===
                                                    payment.method
                                                }
                                                onChange={handleChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <span className="text-sm font-medium text-gray-800">
                                                Thanh toán qua {payment.method}
                                            </span>
                                        </div>
                                    </label>
                                ))
                            )}
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
                                {finalTotal.toLocaleString('vi-VN')} VND
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center items-center py-3 px-4 mt-8 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#00b33c] hover:bg-[#009933] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b33c]"
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
