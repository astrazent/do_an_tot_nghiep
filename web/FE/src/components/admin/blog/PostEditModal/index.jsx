// src/admin/blog/PostEditModal.jsx
import React, { useState, useEffect } from 'react'
import { FaTimes, FaSave, FaUpload, FaTrashAlt } from 'react-icons/fa'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { getByIdPost } from '~/services/admin/postAdminService'

const PostEditModal = ({ postId, isOpen, onClose, onSave }) => {
    const [post, setPost] = useState({
        title: '',
        description: '',
        content: '',
        slug: '',
        status: 1, // 1: Đăng, 0: Ẩn
        images: [], // array of { url: string }
        author_name: '',
        published_at: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [imageFiles, setImageFiles] = useState([]) // files mới upload
    const [imageUrls, setImageUrls] = useState([]) // urls hiện có + mới

    useEffect(() => {
        if (isOpen && postId) {
            fetchPostDetail()
        } else {
            resetForm()
        }
    }, [isOpen, postId])

    const fetchPostDetail = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getByIdPost(postId)
            const postData = data.data || data
            setPost({
                title: postData.title || '',
                description: postData.description || '',
                content: postData.content || '',
                slug: postData.slug || '',
                status: postData.status || 1,
                images: postData.images || [],
                author_name: postData.author_name || '',
                published_at: postData.published_at || '',
            })
            setImageUrls(postData.images?.map(img => img.url) || [])
        } catch (err) {
            console.error('Lỗi tải chi tiết bài viết:', err)
            setError('Không thể tải chi tiết bài viết. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setPost({
            title: '',
            description: '',
            content: '',
            slug: '',
            status: 1,
            images: [],
            author_name: '',
            published_at: '',
        })
        setImageFiles([])
        setImageUrls([])
        setError(null)
    }

    const handleInputChange = e => {
        const { name, value } = e.target
        setPost(prev => ({ ...prev, [name]: value }))
    }

    const handleContentChange = value => {
        setPost(prev => ({ ...prev, content: value }))
    }

    const handleImageUpload = e => {
        const files = Array.from(e.target.files)
        if (files.length === 0) return

        // Tạo preview URL cho ảnh mới
        const newUrls = files.map(file => URL.createObjectURL(file))
        setImageUrls(prev => [...prev, ...newUrls])
        setImageFiles(prev => [...prev, ...files])
    }

    const handleRemoveImage = index => {
        setImageUrls(prev => prev.filter((_, i) => i !== index))
        setImageFiles(prev => prev.filter((_, i) => i !== index))
        // Nếu xóa ảnh cũ (không phải file mới), cần đánh dấu để API xóa
    }

    const handleSave = async () => {
        if (!post.title.trim()) {
            setError('Tiêu đề không được để trống')
            return
        }
        if (!post.content.trim()) {
            setError('Nội dung bài viết không được để trống')
            return
        }

        // TODO: Gọi API update
        // const formData = new FormData()
        // formData.append('title', post.title)
        // formData.append('description', post.description)
        // formData.append('content', post.content)
        // formData.append('slug', post.slug)
        // formData.append('status', post.status)
        // imageFiles.forEach(file => formData.append('images', file))
        // await updatePost(postId, formData)

        // Sau khi save thành công
        onSave?.() // refresh list ở parent
        onClose()
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white z-10 border-b flex items-center justify-between px-8 py-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Chỉnh sửa bài viết
                    </h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mx-8 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
                        <p className="mt-4 text-gray-600">
                            Đang tải dữ liệu...
                        </p>
                    </div>
                ) : (
                    <div className="p-8 space-y-8">
                        {/* Thông tin cơ bản */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tiêu đề{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={post.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mô tả ngắn (description)
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    value={post.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={post.slug}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Trạng thái
                                </label>
                                <select
                                    name="status"
                                    value={post.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value={1}>Đăng (Published)</option>
                                    <option value={0}>Ẩn (Hidden)</option>
                                </select>
                            </div>
                        </div>

                        {/* Nội dung bài viết */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nội dung bài viết{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={post.content}
                                onChange={handleContentChange}
                                modules={{
                                    toolbar: [
                                        [{ header: [1, 2, 3, false] }],
                                        [
                                            'bold',
                                            'italic',
                                            'underline',
                                            'strike',
                                        ],
                                        [
                                            { list: 'ordered' },
                                            { list: 'bullet' },
                                        ],
                                        ['link', 'image'],
                                        ['clean'],
                                    ],
                                }}
                                className="bg-white rounded-lg border border-gray-300"
                                style={{ height: '400px' }}
                            />
                        </div>

                        {/* Upload ảnh */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thư viện ảnh (ảnh đại diện + ảnh phụ)
                            </label>
                            <div className="flex items-center gap-4 mb-4">
                                <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
                                    <FaUpload className="w-4 h-4" />
                                    <span>Chọn ảnh</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-sm text-gray-500">
                                    Hỗ trợ JPG, PNG, GIF. Ảnh đầu tiên sẽ là ảnh
                                    đại diện.
                                </p>
                            </div>

                            {/* Preview ảnh */}
                            {imageUrls.length > 0 && (
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                                    {imageUrls.map((url, index) => (
                                        <div
                                            key={index}
                                            className="relative group"
                                        >
                                            <img
                                                src={url}
                                                alt={`Ảnh ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                onClick={() =>
                                                    handleRemoveImage(index)
                                                }
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <FaTrashAlt className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Meta info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                            <div>
                                <strong>Tác giả:</strong>{' '}
                                {post.author_name || 'Admin'}
                            </div>
                            <div>
                                <strong>Ngày đăng:</strong>{' '}
                                {post.published_at
                                    ? new Date(
                                          post.published_at
                                      ).toLocaleString('vi-VN')
                                    : 'N/A'}
                            </div>
                        </div>

                        {/* Footer buttons */}
                        <div className="flex justify-end gap-4 pt-6 border-t">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                            >
                                <FaSave className="w-4 h-4" />
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostEditModal
