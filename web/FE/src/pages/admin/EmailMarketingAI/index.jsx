import React, { useState, useEffect } from 'react'
import Alert from '~/components/shared/Alert'
import { createEmailMarketing } from '~/services/admin/aiMarketingService'
import { getListCustomerByType } from '~/services/admin/userAdminService'

const customerTypes = [
    { label: 'Đồng', minSpending: 0 },
    { label: 'Bạc', minSpending: 5000000 },
    { label: 'Vàng', minSpending: 10000000 },
    { label: 'Kim Cương', minSpending: 30000000 },
]

const EmailAI = () => {
    const [selectedType, setSelectedType] = useState(customerTypes[0])
    const [customers, setCustomers] = useState([])
    const [subject, setSubject] = useState('')
    const [prompt, setPrompt] = useState('')
    const [images, setImages] = useState([])              // Array of File objects
    const [imagePreviews, setImagePreviews] = useState([]) // Array of preview URLs
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // State cho Alert modal
    const [alert, setAlert] = useState({ visible: false, message: '', type: 'success' })

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true)
                const data = await getListCustomerByType({
                    minSpending: selectedType.minSpending,
                })
                setCustomers(data.data || [])
                setError('')
            } catch (err) {
                setError('Không thể tải danh sách khách hàng')
                setCustomers([])
            } finally {
                setLoading(false)
            }
        }

        fetchCustomers()
    }, [selectedType])

    const handleImageChange = e => {
        const files = Array.from(e.target.files)
        if (files.length > 0) {
            // Thêm ảnh mới vào danh sách hiện tại
            setImages(prev => [...prev, ...files])

            // Tạo preview cho các ảnh mới
            const newPreviews = files.map(file => URL.createObjectURL(file))
            setImagePreviews(prev => [...prev, ...newPreviews])
        }
    }

    const removeImage = index => {
        // Xóa ảnh và preview tại vị trí index
        setImages(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => {
            const url = prev[index]
            URL.revokeObjectURL(url) // Giải phóng bộ nhớ
            return prev.filter((_, i) => i !== index)
        })
    }

    const clearAllImages = () => {
        // Giải phóng tất cả preview URLs
        imagePreviews.forEach(url => URL.revokeObjectURL(url))
        setImages([])
        setImagePreviews([])
    }

    // Reset form
    const resetForm = () => {
        setSubject('')
        setPrompt('')
        clearAllImages() // Xóa hết ảnh
        setSelectedType(customerTypes[0])
    }

    const showAlert = (message, type = 'success', duration = 2500) => {
        setAlert({ visible: true, message, type })
        setTimeout(() => {
            setAlert({ visible: false, message: '', type: 'success' })
            // Chỉ reset form khi thành công
            if (type === 'success') {
                resetForm()
            }
        }, duration)
    }

    const handleCloseAlert = () => {
        setAlert({ visible: false, message: '', type: 'success' })
        // Chỉ reset nếu là success (tránh reset khi lỗi)
        if (alert.type === 'success') {
            resetForm()
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        if (!subject || !prompt || images.length === 0 || customers.length === 0) {
            setError('Vui lòng điền đầy đủ thông tin, chọn ít nhất một ảnh và loại khách hàng có danh sách hợp lệ')
            return
        }

        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const formData = new FormData()
            formData.append('subject', subject)
            formData.append('message', prompt)
            // Append nhiều ảnh
            images.forEach((img) => {
                formData.append('image', img)
            })
            customers.forEach((customer, index) => {
                formData.append(`customers[${index}][name]`, customer.name)
                formData.append(`customers[${index}][email]`, customer.email)
            })

            await createEmailMarketing(formData)

            // Thành công: hiển thị alert success (sẽ tự reset form)
            showAlert('Email marketing đã được gửi thành công!', 'success', 2500)
        } catch (err) {
            const errMsg = 'Gửi email thất bại: ' + (err.response?.data?.message || err.message)
            // Lỗi: hiển thị alert error (KHÔNG reset form)
            showAlert(errMsg, 'error', 3000)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-stretch justify-center">
            <div className="w-full h-full flex flex-col bg-white shadow-2xl border-t-4 border-blue-600">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-6 md:py-8 text-white text-center">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
                        Email Marketing AI
                    </h1>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 p-6 md:p-8 lg:p-10 space-y-6 overflow-y-auto"
                >
                    {/* Loại khách hàng */}
                    <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-4">
                        <div className="flex-1">
                            <label className="block text-base font-medium text-gray-800 mb-2">
                                Loại khách hàng
                            </label>
                            <select
                                value={selectedType.label}
                                onChange={e => {
                                    const type = customerTypes.find(t => t.label === e.target.value)
                                    setSelectedType(type)
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-base h-12"
                            >
                                {customerTypes.map(type => (
                                    <option key={type.label} value={type.label}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-base font-medium text-gray-800 mb-2">
                            Tiêu đề (Subject)
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            placeholder="Ví dụ: Ưu đãi đặc biệt tháng 12 cho khách hàng thân thiết"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-base"
                            required
                        />
                    </div>

                    {/* Prompt */}
                    <div>
                        <label className="block text-base font-medium text-gray-800 mb-2">
                            Yêu cầu nội dung email (Prompt)
                        </label>
                        <textarea
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder="Ví dụ: Viết email thông báo ưu đãi giảm 20% từ 30/11 đến 10/12 cho khách hàng VIP..."
                            rows={10}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-base resize-none"
                            required
                        />
                    </div>

                    {/* Upload ảnh - hỗ trợ multiple */}
                    <div>
                        <label className="block text-base font-medium text-gray-800 mb-2">
                            Ảnh đính kèm (có thể chọn nhiều ảnh)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-blue-50">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                                <p className="text-gray-600 text-base mb-2">
                                    Nhấn để chọn hoặc kéo thả nhiều ảnh
                                </p>
                                <p className="text-xs text-gray-500">
                                    JPG, PNG, tối đa 5MB mỗi ảnh
                                </p>
                            </label>
                        </div>

                        {/* Preview nhiều ảnh */}
                        {imagePreviews.length > 0 && (
                            <div className="mt-6">
                                <div className="flex flex-wrap gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={clearAllImages}
                                    className="mt-4 text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                    Xóa tất cả ảnh
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Thông báo */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 text-green-700 text-sm">
                            {success}
                        </div>
                    )}

                    {/* Nút gửi */}
                    <button
                        type="submit"
                        disabled={loading || customers.length === 0}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 rounded-lg font-semibold text-base hover:from-blue-700 hover:to-blue-900 disabled:opacity-60 transition-all shadow-md"
                    >
                        {loading ? 'Đang gửi...' : 'Gửi Email Marketing'}
                    </button>
                </form>
            </div>

            {/* Alert modal */}
            {alert.visible && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    duration={alert.type === 'success' ? 2500 : 3000}
                    onClose={handleCloseAlert}
                />
            )}
        </div>
    )
}

export default EmailAI