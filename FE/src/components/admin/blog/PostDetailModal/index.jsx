// src/admin/blog/PostDetailModal.jsx
import React, { useState, useEffect } from 'react'
import { FaTimes, FaUser, FaCalendar } from 'react-icons/fa'
import { getByIdPost } from '~/services/admin/postAdminService'

const formatDateTime = dateString => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const time = date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
    })
    const day = date.toLocaleDateString('vi-VN')
    return `${time} ${day}`
}

const StatusBadge = ({ status }) => {
    const isPublished = status === 1
    const config = isPublished
        ? {
              label: 'Đã đăng',
              bg: 'bg-emerald-50',
              text: 'text-emerald-700',
              dot: 'bg-emerald-500',
          }
        : {
              label: 'Đã ẩn',
              bg: 'bg-gray-100',
              text: 'text-gray-600',
              dot: 'bg-gray-400',
          }

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
        >
            <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`}
            ></span>
            {config.label}
        </span>
    )
}

const PostDetailModal = ({ post, isOpen, onClose }) => {
    const [postDetail, setPostDetail] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (isOpen && post?.id) {
            fetchPostDetail()
        } else {
            setPostDetail(null)
            setError(null)
        }
    }, [isOpen, post?.id])

    const fetchPostDetail = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await getByIdPost(post.id)
            setPostDetail(data.data || data) // phòng trường hợp data nằm trong .data
        } catch (err) {
            console.error('Lỗi tải chi tiết bài viết:', err)
            setError('Không thể tải chi tiết bài viết. Vui lòng thử lại.')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    // Thay thế [IMAGE_X] bằng thẻ <img> thực tế (bắt đầu từ ảnh thứ 2 vì ảnh 1 là ảnh đại diện)
    const renderContent = () => {
        if (!postDetail?.content || !postDetail?.images)
            return postDetail.content || 'Không có nội dung'

        let content = postDetail.content

        // 1. Thay thế ảnh [IMAGE_X]
        const contentImages = postDetail.images.slice(1)
        contentImages.forEach((img, idx) => {
            const placeholder = `[IMAGE_${idx + 1}]`
            const imgTag = `
            <div class="my-12 text-center">
                <img 
                    src="${img.url}" 
                    alt="Hình ảnh bài viết" 
                    class="max-w-full h-auto rounded-xl shadow-lg mx-auto border border-gray-100"
                    loading="lazy"
                />
            </div>
        `.trim()
            content = content.split(placeholder).join(imgTag)
        })

        // 2. QUAN TRỌNG: Chuyển bullet list của Quill về dạng chuẩn <ul><li>
        // Quill dùng: <li data-list="bullet"><span class="ql-ui"></span>Nội dung</li>
        // → Chuyển thành: <li>Nội dung</li>
        content = content
            // Xóa span.ql-ui vô nghĩa
            .replace(/<span class=["']ql-ui["'][^>]*><\/span>/g, '')
            // Chuyển tất cả <li data-list="bullet"> → <li> (và giữ nguyên <li data-list="ordered"> thành <ol>)
            .replace(/<li data-list="bullet">/g, '<li>')
            .replace(/<\/li>/g, '</li>')
            // Bọc các <li> bullet lại trong <ul>
            .replace(/<ol>/g, '<ul class="list-disc list-inside space-y-2">')
            .replace(/<\/ol>/g, '</ul>')
            // Nếu có số thứ tự (ordered list) thì giữ <ol>
            .replace(/<li data-list="ordered">/g, '<li>')
            .replace(
                /<ol class="list-disc[^"]*">/g,
                '<ol class="list-decimal list-inside space-y-2">'
            )

        return content
    }
    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            style={{ backdropFilter: 'blur(10px)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 rounded-full p-2 shadow-md transition-all"
                >
                    <FaTimes className="w-5 h-5" />
                </button>

                {/* Loading */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
                        <p className="mt-4 text-gray-600">
                            Đang tải chi tiết bài viết...
                        </p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="text-6xl mb-4">Lỗi</div>
                        <p className="text-red-600 font-medium mb-4">{error}</p>
                        <button
                            onClick={fetchPostDetail}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {/* Content */}
                {postDetail && !isLoading && !error && (
                    <div className="p-8 pb-12">
                        {/* Ảnh đại diện */}
                        {postDetail.images?.[0]?.url && (
                            <div className="mb-8 -mx-8">
                                <img
                                    src={postDetail.images[0].url}
                                    alt={postDetail.title}
                                    className="w-full h-96 object-cover rounded-t-2xl"
                                />
                            </div>
                        )}

                        {/* Tiêu đề & meta */}
                        <div className="mb-8">
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                                {postDetail.title}
                            </h1>
                            {postDetail.description && (
                                <p className="text-lg text-gray-600 italic mb-6">
                                    {postDetail.description}
                                </p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-2">
                                    <FaUser className="text-indigo-600" />
                                    {postDetail.author_name || 'Admin'}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-2">
                                    <FaCalendar className="text-indigo-600" />
                                    {formatDateTime(postDetail.published_at)}
                                </span>
                                <span>•</span>
                                <StatusBadge status={postDetail.status} />
                            </div>
                        </div>

                        {/* Nội dung bài viết */}
                        <article className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: renderContent(),
                                }}
                            />
                        </article>

                        {/* Thư viện ảnh phụ */}
                        {postDetail.images && postDetail.images.length > 1 && (
                            <div className="mt-12 border-t pt-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">
                                    Thư viện ảnh
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {postDetail.images
                                        .slice(1)
                                        .map((img, i) => (
                                            <a
                                                key={i}
                                                href={img.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block group relative overflow-hidden rounded-lg shadow hover:shadow-xl transition-shadow"
                                            >
                                                <img
                                                    src={img.url}
                                                    alt={`Ảnh ${i + 1}`}
                                                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                                    <span className="text-white opacity-0 group-hover:opacity-100 font-medium">
                                                        Xem lớn
                                                    </span>
                                                </div>
                                            </a>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Thông tin meta cuối trang */}
                        <div className="mt-12 pt-8 border-t text-sm text-gray-500 space-y-2">
                            <div>
                                <strong>Slug:</strong> {postDetail.slug}
                            </div>
                            <div>
                                <strong>ID:</strong> #{postDetail.id}
                            </div>
                            <div>
                                <strong>Tạo lúc:</strong>{' '}
                                {formatDateTime(postDetail.created_at)}
                            </div>
                            <div>
                                <strong>Cập nhật:</strong>{' '}
                                {formatDateTime(postDetail.updated_at)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostDetailModal
