// src/components/admin/category/CategoryEditModal.jsx
import React, { useState, useEffect, useRef } from 'react'
import { FaTimes, FaEdit, FaSitemap } from 'react-icons/fa'
import { updateCategory } from '~/services/admin/categoryAdminService'
import { getListCategory } from '~/services/admin/productAdminService'

const CategoryEditModal = ({ isOpen, onClose, category, onSuccess }) => {
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')
    const [parentId, setParentId] = useState(null)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const modalRef = useRef(null)

    // Load dữ liệu khi mở modal
    useEffect(() => {
        if (isOpen && category) {
            setName(category.name || '')
            setSlug(category.slug || '')
            setDescription(category.description || '')
            setParentId(category.parent_id || null)
        }
    }, [isOpen, category])

    // Tự động sinh slug
    useEffect(() => {
        if (name && name !== category?.name) {
            const generatedSlug = name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[đĐ]/g, 'd')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            setSlug(generatedSlug)
        }
    }, [name, category?.name])

    // Load danh sách danh mục để chọn parent (loại trừ chính nó)
    useEffect(() => {
        if (isOpen) {
            const fetchCategories = async () => {
                try {
                    const data = await getListCategory()
                    const list = (data.data || data || []).filter(c => c.id !== category?.id)
                    setCategories(list)
                } catch (err) {
                    console.error('Lỗi load danh mục:', err)
                }
            }
            fetchCategories()
        }
    }, [isOpen, category?.id])

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
                parent_id: parentId
            }

            await updateCategory(payload, category.id)
            onSuccess?.()
            handleClose()
        } catch (err) {
            const msg = err.response?.data?.message || 'Không thể cập nhật danh mục'
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

    if (!isOpen || !category) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
            <div
                ref={modalRef}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <FaEdit className="text-blue-600" />
                        Chỉnh sửa danh mục
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
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Slug
                        </label>
                        <input
                            type="text"
                            value={slug}
                            onChange={e => setSlug(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaSitemap className="inline mr-1 text-indigo-600" />
                            Danh mục cha
                        </label>
                        <select
                            value={parentId || ''}
                            onChange={e => setParentId(e.target.value ? Number(e.target.value) : null)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                            <option value="">Danh mục gốc</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.parent_id ? '├── ' : ''}{cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả
                        </label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition-all font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CategoryEditModal