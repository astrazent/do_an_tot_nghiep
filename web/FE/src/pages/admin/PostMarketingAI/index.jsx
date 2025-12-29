import React, { useState } from 'react'
import { createPostMarketing } from '~/services/admin/aiMarketingService'

const PostMarketingAI = () => {
    const [formData, setFormData] = useState({
        product_name: '',
        content_requirement: '',
        product_image: null,
    })

    const [imagePreview, setImagePreview] = useState(null)
    const [generatedMessage, setGeneratedMessage] = useState('')
    const [attachedMedia, setAttachedMedia] = useState([])
    const [loading, setLoading] = useState(false)
    const [publishing, setPublishing] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [scheduleTime, setScheduleTime] = useState('') // Unix timestamp cho scheduled time

    const handleInputChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleScheduleChange = e => {
        const date = new Date(e.target.value)
        const unixTime = Math.floor(date.getTime() / 1000)
        setScheduleTime(unixTime)
    }

    const handleImageChange = e => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({ ...prev, product_image: file }))
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)
        setAttachedMedia([])

        const data = new FormData()
        data.append('product_name', formData.product_name)
        data.append('content_requirement', formData.content_requirement)
        if (formData.product_image) {
            data.append('product_image', formData.product_image)
        }

        try {
            const response = await createPostMarketing(data)
            let respData = response?.data || {}

            const attachedMediaArray = []
            Object.keys(respData).forEach(key => {
                if (key.startsWith('attached_media[')) {
                    try {
                        const mediaObj = JSON.parse(respData[key])
                        attachedMediaArray.push(mediaObj)
                    } catch (err) {
                        console.error('Parse media error:', err)
                    }
                }
            })

            const finalRespData = {
                message: respData.message || '',
                attached_media: attachedMediaArray,
                page_id: respData.page_id || '',
            }

            setGeneratedMessage(finalRespData.message)
            setAttachedMedia(finalRespData.attached_media)

            if (!finalRespData.message.trim()) {
                setError(
                    'Hệ thống AI đang lỗi hoặc không trả về nội dung. Vui lòng thử lại sau!'
                )
                setSuccess(false)
            } else {
                setSuccess(true)
            }
        } catch (err) {
            console.error('API Error:', err)
            setError(
                err.response?.data?.message || 'Có lỗi xảy ra khi tạo bài viết'
            )
        } finally {
            setLoading(false)
        }
    }

    const handlePublish = async () => {
        if (!generatedMessage.trim()) {
            alert('Vui lòng tạo nội dung trước')
            return
        }

        setPublishing(true)

        const data = new FormData()
        data.append('message', generatedMessage)

        attachedMedia.forEach((media, index) => {
            data.append(`attached_media[${index}]`, JSON.stringify(media))
        })

        // Thêm lên lịch nếu có
        if (scheduleTime) {
            data.append('scheduled_publish_time', scheduleTime)
            data.append('published', 'false')
        }

        try {
            const response = await fetch(
                'https://tienduy20031.app.n8n.cloud/webhook/post',
                {
                    method: 'POST',
                    body: data,
                }
            )

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Lỗi: ${response.status} - ${errorText}`)
            }

            const result = await response.json()
            console.log('Đăng bài thành công:', result)
            alert(
                scheduleTime
                    ? 'Bài đã được lên lịch đăng!'
                    : 'Đăng bài lên Facebook thành công!'
            )
        } catch (err) {
            console.error('Lỗi khi đăng bài:', err)
            alert('Có lỗi khi đăng bài: ' + err.message)
        } finally {
            setPublishing(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-1 flex items-stretch p-0">
                <div className="flex-1 bg-white border border-gray-200 overflow-hidden flex flex-col">
                    <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Tạo Bài Đăng Marketing AI
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Điền thông tin sản phẩm để AI tạo nội dung bài đăng
                            chuyên nghiệp
                        </p>
                    </div>

                    <div className="flex-1 overflow-auto p-8">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6 max-w-4xl mx-auto"
                        >
                            {/* Tên sản phẩm */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên sản phẩm{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="product_name"
                                    value={formData.product_name}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    required
                                    placeholder="Ví dụ: Áo thun nam cotton cao cấp"
                                />
                            </div>

                            {/* Yêu cầu nội dung */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Yêu cầu nội dung{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="content_requirement"
                                    value={formData.content_requirement}
                                    onChange={handleInputChange}
                                    rows={5}
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y transition-all"
                                    required
                                    placeholder="Ví dụ: Tập trung vào ưu đãi Black Friday, giọng điệu trẻ trung, thêm emoji, kêu gọi hành động mua ngay"
                                />
                            </div>

                            {/* Upload ảnh */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ảnh sản phẩm
                                </label>
                                <div className="mt-1 flex items-center space-x-4">
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <span className="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                                            Chọn ảnh
                                        </span>
                                    </label>
                                    {formData.product_image && (
                                        <span className="text-sm text-gray-600 truncate max-w-xs">
                                            {formData.product_image.name}
                                        </span>
                                    )}
                                </div>

                                {imagePreview && (
                                    <div className="mt-4">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-80 w-auto rounded-lg border border-gray-200 object-contain shadow-sm"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Nút submit */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                        loading ? 'cursor-not-allowed' : ''
                                    }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Đang tạo...
                                        </span>
                                    ) : (
                                        'Tạo bài đăng'
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Phần hiển thị nội dung sau khi tạo thành công */}
                        {success && generatedMessage && (
                            <div className="mt-12 max-w-4xl mx-auto">
                                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                        Nội dung bài đăng (có thể chỉnh sửa)
                                    </h2>
                                    <textarea
                                        value={generatedMessage}
                                        onChange={e =>
                                            setGeneratedMessage(e.target.value)
                                        }
                                        rows={12}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y transition-all font-medium"
                                    />

                                    {/* Input lên lịch đăng */}
                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Lên lịch đăng bài (tùy chọn)
                                        </label>
                                        <input
                                            type="datetime-local"
                                            onChange={handleScheduleChange}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            min={new Date()
                                                .toISOString()
                                                .slice(0, 16)} // Không cho chọn quá khứ
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Nếu để trống, bài sẽ đăng ngay lập
                                            tức
                                        </p>
                                    </div>

                                    {/* Nút đăng */}
                                    <div className="mt-6 flex justify-end space-x-4">
                                        <button
                                            onClick={handlePublish}
                                            disabled={
                                                publishing ||
                                                !generatedMessage.trim()
                                            }
                                            className={`px-8 py-3 bg-green-600 text-white font-medium rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                                publishing
                                                    ? 'cursor-not-allowed'
                                                    : ''
                                            }`}
                                        >
                                            {publishing ? (
                                                <span className="flex items-center justify-center">
                                                    <svg
                                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                    Đang đăng...
                                                </span>
                                            ) : (
                                                'Đăng bài ngay'
                                            )}
                                        </button>
                                        <button
                                            onClick={handlePublish}
                                            disabled={
                                                publishing ||
                                                !generatedMessage.trim() ||
                                                !scheduleTime
                                            }
                                            className={`px-8 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                                publishing || !scheduleTime
                                                    ? 'cursor-not-allowed'
                                                    : ''
                                            }`}
                                        >
                                            {publishing
                                                ? 'Đang lên lịch...'
                                                : 'Lên lịch đăng'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-6 max-w-4xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostMarketingAI