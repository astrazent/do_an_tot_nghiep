import React, { useEffect, useState } from 'react'
import { FiClock } from 'react-icons/fi'

const UpdateStatusModal = ({ isOpen, onClose, order, onUpdate }) => {
    const [status, setStatus] = useState(order?.status || 'pending')
    const [shipmentStatus, setShipmentStatus] = useState(order?.shipment_status || 'pending')
    const [isSaving, setIsSaving] = useState(false)

    // Sync local state when order prop changes
    useEffect(() => {
        setStatus(order?.status || 'pending')
        setShipmentStatus(order?.shipment_status || 'pending')
    }, [order])

    // Close on ESC
    useEffect(() => {
        if (!isOpen) return
        const onKey = e => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [isOpen, onClose])

    // don't render when closed
    if (!isOpen) return null

    const handleSave = async () => {
        if (isSaving) return
        setIsSaving(true)
        try {
            // parent should return a Promise and throw on error
            await onUpdate({ status, shipment_status: shipmentStatus })
            onClose()
        } catch (err) {
            console.error('Update failed', err)
            // keep modal open so user can retry; consider showing toast
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6"
            >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Cập nhật trạng thái đơn hàng #{order?.tracking_number}
                </h3>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái đơn hàng
                        </label>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="pending">Chờ xử lý</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="refunded">Đã hoàn tiền</option>
                            <option value="canceled">Đã hủy</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái vận chuyển
                        </label>
                        <select
                            value={shipmentStatus}
                            onChange={e => setShipmentStatus(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="pending">Đang xử lý</option>
                            <option value="shipped">Đã giao cho vận chuyển</option>
                            <option value="in_transit">Đang vận chuyển</option>
                            <option value="delivered">Đã giao</option>
                            <option value="returned">Đã trả lại</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-60"
                    >
                        <FiClock className="w-4 h-4" />
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UpdateStatusModal