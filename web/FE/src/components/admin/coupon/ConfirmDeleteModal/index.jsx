// ~/components/admin/coupon/ConfirmDeleteModal.jsx
import React from 'react'
import { FaTrashAlt } from 'react-icons/fa'

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, couponCode }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Xác nhận xóa mã giảm giá</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Bạn có chắc chắn muốn xóa mã giảm giá
                    <span className="font-bold text-red-600"> "{couponCode}"</span>?
                    <br />
                    Hành động này không thể hoàn tác.
                </p>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                        Hủy
                    </button>
                    <button onClick={onConfirm} className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2">
                        <FaTrashAlt className="w-4 h-4" />
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDeleteModal