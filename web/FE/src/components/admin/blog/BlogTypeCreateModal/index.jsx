// src/components/admin/blog/BlogTypeCreateModal.jsx
import React, { useState, useEffect } from 'react'
import { FaTimes, FaPlus } from 'react-icons/fa'
import { createPostType } from '~/services/admin/postAdminService'

const BlogTypeCreateModal = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Tự động sinh slug
    useEffect(() => {
        if (name) {
            const generated = name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[đĐ]/g, 'd')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            setSlug(generated)
        } else {
            setSlug('')
        }
    }, [name])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) return setError('Vui lòng nhập tên loại bài viết')

        setLoading(true)
        setError('')

        try {
            await createPostType({ name: name.trim(), slug: slug.trim(), description: description.trim() || null })
            onSuccess?.()
            handleClose()
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tạo loại bài viết')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setName(''); setSlug(''); setDescription(''); setError('')
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <FaPlus className="text-emerald-600" />
                        Thêm loại bài viết mới
                    </h2>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full">
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
                            placeholder="Ví dụ: Tin tức ẩm thực"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Slug (tự động sinh)</label>
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
                            placeholder="Mô tả ngắn về loại bài viết..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={handleClose} className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium">
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="flex-1 px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:bg-gray-400 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? 'Đang tạo...' : 'Tạo loại bài viết'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BlogTypeCreateModal