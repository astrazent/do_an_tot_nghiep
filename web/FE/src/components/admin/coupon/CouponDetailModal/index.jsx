// ~/components/admin/coupon/CouponDetailModal.jsx
import React from 'react'
import { FaTimes } from 'react-icons/fa'

const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    const day = date.toLocaleDateString('vi-VN')
    return `${time} ${day}`
}

const CouponDetailModal = ({ isOpen, onClose, coupon }) => {
    if (!isOpen || !coupon) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Chi tiết mã giảm giá: {coupon.code}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes size={20} />
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* All fields exactly as before */}
                        {/* ... */}
                    </div>
                </div>
                <div className="flex justify-end pt-6">
                    <button onClick={onClose} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CouponDetailModal