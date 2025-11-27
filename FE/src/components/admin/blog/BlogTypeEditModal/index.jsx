// src/components/admin/blog/BlogTypeEditModal.jsx
import React, { useState, useEffect } from 'react'
import { FaTimes, FaEdit } from 'react-icons/fa'
import { updatePostType } from '~/services/admin/postAdminService'


const BlogTypeEditModal = ({ isOpen, onClose, type, onSuccess }) => {
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (isOpen && type) {
            setName(type.name || '')
            setSlug(type.slug || '')
            setDescription(type.description || '')
        }
    }, [isOpen, type])

    useEffect(() => {
        if (name && name !== type?.name) {
            const generated = name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[đĐ]/g, 'd')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            setSlug(generated)
        }
    }, [name, type?.name])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) return setError('Vui lòng nhập tên loại bài viết')

        setLoading(true)
        setError('')

        try {
            await updatePostType({ name: name.trim(), slug: slug.trim(), description: description.trim() || null }, type.id)
            onSuccess?.()
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể cập nhật')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen || !type) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <FaEdit className="text-blue-600" />
                        Chỉnh sửa loại bài viết
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <FaTimes className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên loại bài viết *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                        <input
                            type="text"
                            value={slug}
                            onChange={e => setSlug(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium">
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BlogTypeEditModal