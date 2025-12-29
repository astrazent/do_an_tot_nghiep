// src/components/admin/slider/CreateSliderModal.jsx
import React, { useState, useRef } from 'react'
import { FiX, FiUpload, FiLink, FiCalendar, FiPlus, FiTrash2 } from 'react-icons/fi'
import { createSlider } from '~/services/admin/slideAdminService'

const CreateSliderModal = ({ isOpen, onClose, onSuccess }) => {
    const fileInputRef = useRef(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        link_url: '',
        sort_order: '1',
        start_date: '',
        end_date: '',
        status: '1',
    })

    const [selectedFile, setSelectedFile] = useState(null)        // File thực tế
    const [previewUrl, setPreviewUrl] = useState('')              // URL preview
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    if (!isOpen) return null

    // Khi người dùng chọn ảnh
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Kiểm tra loại file
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh!')
            return
        }

        setSelectedFile(file)

        // Tạo preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreviewUrl(reader.result)
        }
        reader.readAsDataURL(file)
    }

    // Xóa ảnh đã chọn
    const removeImage = () => {
        setSelectedFile(null)
        setPreviewUrl('')
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên banner'
        if (!selectedFile) newErrors.image = 'Vui lòng chọn ảnh banner'
        if (!formData.sort_order || formData.sort_order < 1) newErrors.sort_order = 'Thứ tự phải ≥ 1'
        if (!formData.start_date) newErrors.start_date = 'Chọn ngày bắt đầu'
        if (!formData.end_date) newErrors.end_date = 'Chọn ngày kết thúc'
        if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
            newErrors.end_date = 'Ngày kết thúc phải ≥ ngày bắt đầu'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setSubmitting(true)
        const submitData = new FormData()

        submitData.append('name', formData.name)
        if (formData.description) submitData.append('description', formData.description)
        if (formData.link_url) submitData.append('link_url', formData.link_url)
        submitData.append('sort_order', formData.sort_order)
        submitData.append('start_date', formData.start_date)
        submitData.append('end_date', formData.end_date)
        submitData.append('status', formData.status)
        submitData.append('images', selectedFile) // tên field đúng với backend

        try {
            const result = await createSlider(submitData)
            onSuccess(result.data || result)
            onClose()
        } catch (err) {
            const msg = err.response?.data?.message || 'Không thể tạo banner. Vui lòng thử lại!'
            alert(msg)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay mờ blur */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-gray-900">Thêm banner Mới</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <FiX className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-7">
                    {/* Tên slider */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên banner <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="VD: Sale 11.11"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả (tùy chọn)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Nhập mô tả ngắn về slider..."
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                        />
                    </div>

                    {/* Upload ảnh + Preview bên dưới */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Ảnh banner <span className="text-red-500">*</span>
                        </label>

                        {/* Khu vực chọn file */}
                        <label className="block">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-all">
                                <div className="text-center">
                                    <FiUpload className="mx-auto h-10 w-10 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-600">Click để tải lên ảnh</p>
                                    <p className="text-xs text-gray-500">PNG, JPG, WEBP • Tối đa 5MB</p>
                                </div>
                            </div>
                        </label>

                        {/* Preview ảnh ngay bên dưới */}
                        {previewUrl && (
                            <div className="mt-5 relative group">
                                <img
                                    src={previewUrl}
                                    alt="Preview slider"
                                    className="w-full max-h-96 object-contain rounded-xl border border-gray-200 shadow-lg"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                    <FiTrash2 className="w-5 h-5" />
                                </button>
                                <div className="mt-2 text-sm text-gray-600 text-center">
                                    {selectedFile?.name} • {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                            </div>
                        )}

                        {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}
                    </div>

                    {/* Liên kết */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <FiLink /> Liên kết (tùy chọn)
                        </label>
                        <input
                            type="url"
                            value={formData.link_url}
                            onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>

                    {/* Thứ tự + Trạng thái */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thứ tự hiển thị <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.sort_order}
                                onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none ${errors.sort_order ? 'border-red-300' : 'border-gray-300'}`}
                            />
                            {errors.sort_order && <p className="mt-1 text-sm text-red-600">{errors.sort_order}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                <option value="1">Hiển thị</option>
                                <option value="0">Ẩn</option>
                            </select>
                        </div>
                    </div>

                    {/* Thời gian hiển thị */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                            <FiCalendar /> Thời gian hiển thị <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Từ ngày</label>
                                <input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none ${errors.start_date ? 'border-red-300' : 'border-gray-300'}`}
                                />
                                {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Đến ngày</label>
                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none ${errors.end_date ? 'border-red-300' : 'border-gray-300'}`}
                                />
                                {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            {submitting ? 'Đang tạo...' : (
                                <>
                                    <FiPlus className="text-lg" />
                                    Thêm banner
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateSliderModal