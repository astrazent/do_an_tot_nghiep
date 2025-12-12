// src/components/admin/category/CategoryCreateModal.jsx
import React, { useState, useEffect, useRef } from 'react'
import { FaTimes, FaPlus, FaSitemap } from 'react-icons/fa'
import { createCategory } from '~/services/admin/categoryAdminService'
import { getListCategory } from '~/services/admin/productAdminService'

const CategoryCreateModal = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')
    const [parentId, setParentId] = useState(null)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const modalRef = useRef(null)

    // Tự động sinh slug từ tên
    useEffect(() => {
        if (name) {
            const generatedSlug = name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[đĐ]/g, 'd')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            setSlug(generatedSlug)
        } else {
            setSlug('')
        }
    }, [name])

    // Load danh sách danh mục để chọn parent
    useEffect(() => {
        if (isOpen) {
            const fetchCategories = async () => {
                try {
                    const data = await getListCategory()
                    setCategories(data.data || data || [])
                } catch (err) {
                    console.error('Lỗi load danh mục cha:', err)
                }
            }
            fetchCategories()
        }
    }, [isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) {
            setError('Vui lòng nhập tên danh mục')
            return
        }

        setLoading(true)
        setError('')

        try {
            const payload = {
                name: name.trim(),
                slug: slug.trim() || undefined,
                description: description.trim() || null,
                parent_id: parentId || null,
            }

            await createCategory(payload)
            onSuccess?.()
            handleClose()
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Không thể tạo danh mục'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setName('')
        setSlug('')
        setDescription('')
        setParentId(null)
        setError('')
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
            <div
                ref={modalRef}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <FaPlus className="text-emerald-600" />
                        Thêm danh mục mới
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaTimes className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên danh mục <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="Ví dụ: Điện thoại"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Slug (tự động sinh)
                        </label>
                        <input
                            type="text"
                            value={slug}
                            onChange={e => setSlug(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="dien-thoai"
                        />
                        <p className="text-xs text-gray-500 mt-1">Dùng trong URL, có thể chỉnh sửa</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaSitemap className="inline mr-1 text-indigo-600" />
                            Danh mục cha
                        </label>
                        <select
                            value={parentId || ''}
                            onChange={e => setParentId(e.target.value ? Number(e.target.value) : null)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        >
                            <option value="">Danh mục gốc (không có cha)</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.parent_id ? '├── ' : ''}{cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả (tùy chọn)
                        </label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                            placeholder="Mô tả ngắn về danh mục..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="flex-1 px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? 'Đang tạo...' : <>Tạo danh mục</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CategoryCreateModal