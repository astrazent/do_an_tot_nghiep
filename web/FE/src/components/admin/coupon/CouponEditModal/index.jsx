// ~/components/admin/coupon/CouponEditModal.jsx
import React, { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { updateCoupon } from '~/services/admin/couponAdminService'

const CouponEditModal = ({ isOpen, onClose, coupon, onSuccess }) => {
    const [form, setForm] = useState({
        code: '',
        description: '',
        type: 1,
        value: '',
        max_value: '',
        min_order_value: '',
        quantity: '',
        start_date: '',
        end_date: '',
        status: true,
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (coupon && isOpen) {
            setForm({
                code: coupon.code || '',
                description: coupon.description || '',
                type: coupon.type || 1,
                value: coupon.value || '',
                max_value: coupon.max_value || '',
                min_order_value: coupon.min_order_value || '',
                quantity: coupon.quantity || '',
                start_date: coupon.start_date ? coupon.start_date.slice(0, 16) : '',
                end_date: coupon.end_date ? coupon.end_date.slice(0, 16) : '',
                status: coupon.status === 1,
            })
        }
    }, [coupon, isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const payload = {
                code: form.code.trim().toUpperCase(),
                description: form.description.trim() || null,
                type: Number(form.type),
                value: Number(form.value),
                max_value: form.type === 1 && form.max_value ? Number(form.max_value) : null,
                min_order_value: form.type === 1 && form.min_order_value ? Number(form.min_order_value) : null,
                quantity: Number(form.quantity),
                start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
                end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
                status: form.status ? 1 : 0,
            }

            await updateCoupon(coupon.id, payload)
            onSuccess('Cập nhật mã giảm giá thành công!', 'success')
            onClose()
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật!'
            onSuccess(errorMsg, 'error')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen || !coupon) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">Chỉnh sửa mã giảm giá</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Mã giảm giá */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Mã giảm giá <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Phần chọn type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Loại mã giảm giá <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: Number(e.target.value) })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value={1}>Giảm giá sản phẩm</option>
                                <option value={0}>Giảm phí vận chuyển</option>
                            </select>
                        </div>

                        {/* Giá trị giảm */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                {form.type == 0 ? 'Số tiền giảm ship (VND)' : 'Giá trị giảm'} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={form.value}
                                onChange={(e) => setForm({ ...form, value: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder={form.type == 0 ? "VD: 30000 (0 = freeship hoàn toàn)" : "VD: 10 (%) hoặc 50000 (đ)"}
                            />
                        </div>

                        {/* max_value và min_order_value chỉ hiện khi type = 1 */}
                        {form.type == 1 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Giá trị giảm tối đa (VND)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.max_value}
                                        onChange={(e) => setForm({ ...form, max_value: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="VD: 100000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Đơn hàng tối thiểu (VND)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.min_order_value}
                                        onChange={(e) => setForm({ ...form, min_order_value: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="VD: 300000"
                                    />
                                </div>
                            </>
                        )}

                        {/* Số lượng sử dụng */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Số lượng sử dụng <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={form.quantity}
                                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Ngày bắt đầu */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày bắt đầu</label>
                            <input
                                type="datetime-local"
                                value={form.start_date}
                                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Ngày kết thúc */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày kết thúc</label>
                            <input
                                type="datetime-local"
                                value={form.end_date}
                                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Mô tả */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
                            <textarea
                                rows={3}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            />
                        </div>

                        {/* Trạng thái */}
                        <div className="md:col-span-2 flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="status-edit"
                                checked={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.checked })}
                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="status-edit" className="text-sm font-medium text-gray-700">
                                Kích hoạt mã giảm giá
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                            Hủy
                        </button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CouponEditModal