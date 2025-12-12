// components/admin/UpdateStockModal.js
import React, { useState, useRef, useEffect } from 'react'
import {
    FiX,
    FiDollarSign,
    FiPackage,
    FiEdit,
    FiSave,
    FiImage,
    FiTrash2,
    FiStar,
    FiUpload,
} from 'react-icons/fi'
import {
    updateProduct,
    getProductById,
    getImageforProduct,
    updateProductImage,
    deleteProductImage,
    createProductImage,
} from '~/services/admin/productAdminService'

const UpdateStockModal = ({ productId, isOpen, onClose, onUpdateSuccess }) => {
    const [product, setProduct] = useState(null)
    const [images, setImages] = useState([])
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        origin_price: 0,
        stock_qty: 0,
        low_stock_threshold: 0,
        status: 1,
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [isDeletingImage, setIsDeletingImage] = useState(null)
    const [error, setError] = useState(null)
    const fileInputRef = useRef(null)
    const originalData = useRef({})

    useEffect(() => {
        if (!isOpen || !productId) {
            setProduct(null)
            setImages([])
            return
        }

        const fetchData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const [productRes, imagesRes] = await Promise.all([
                    getProductById(productId),
                    getImageforProduct(productId),
                ])

                const data = productRes.data
                setProduct(data)
                setImages(imagesRes.data || [])

                const initial = {
                    name: data.name || '',
                    description: data.description || '',
                    price: data.price || 0,
                    origin_price: data.origin_price || 0,
                    stock_qty: data.stock_qty || 0,
                    low_stock_threshold: data.low_stock_threshold || 0,
                    status: data.status ?? 1,
                }
                setFormData(initial)
                originalData.current = { ...initial }
            } catch (err) {
                console.error(err)
                setError('Không thể tải thông tin sản phẩm hoặc ảnh')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [productId, isOpen])

    const handleChange = e => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) || 0 : value,
        }))
    }

    const hasChanges = () => {
        return Object.keys(formData).some(
            key => String(formData[key]) !== String(originalData.current[key])
        )
    }

    const handleSave = async e => {
        e.preventDefault()

        const hasChange = Object.keys(formData).some(
            key => String(formData[key]) !== String(originalData.current[key])
        )

        if (!hasChange) {
            alert('Không có thay đổi nào để lưu.')
            return
        }

        const payload = {
            productId,
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: Number(formData.price),
            origin_price: Number(formData.origin_price),
            stock_qty: Number(formData.stock_qty),
            low_stock_threshold: Number(formData.low_stock_threshold),
            status: Number(formData.status),
        }

        setIsSaving(true)
        try {
            await updateProduct(payload)
            alert('Cập nhật sản phẩm thành công!')

            // Cập nhật lại dữ liệu gốc
            originalData.current = { ...formData }

            onUpdateSuccess?.()
            onClose()
        } catch (err) {
            console.error('Lỗi cập nhật:', err)
            setError('Cập nhật thất bại. Vui lòng thử lại.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleSetMainImage = async imageId => {
        try {
            await updateProductImage(imageId, { is_main: 1 })
            setImages(prev =>
                prev.map(img =>
                    img.id === imageId
                        ? { ...img, is_main: 1 }
                        : { ...img, is_main: 0 }
                )
            )
            alert('Đã đặt làm ảnh chính!')
        } catch (err) {
            console.error(err)
            alert('Lỗi khi đặt ảnh chính')
        }
    }

    const handleDeleteImage = async imageId => {
        if (!confirm('Bạn có chắc muốn xóa ảnh này?')) return
        setIsDeletingImage(imageId)
        try {
            await deleteProductImage(imageId)
            setImages(prev => prev.filter(img => img.id !== imageId))
            alert('Đã xóa ảnh thành công!')
        } catch (err) {
            alert('Xóa ảnh thất bại')
        } finally {
            setIsDeletingImage(null)
        }
    }

    // UPLOAD ẢNH
    const handleFileSelect = async e => {
        const files = Array.from(e.target.files)
        if (files.length === 0) return

        setIsUploading(true)

        try {
            for (const file of files) {
                const formData = new FormData()
                formData.append('images', file)
                formData.append('product_id', productId)
                formData.append('is_main', images.length === 0 ? 1 : 0)

                await createProductImage(formData)
            }

            const imagesRes = await getImageforProduct(productId)
            setImages(imagesRes.data || [])
            alert(`Đã thêm ${files.length} ảnh thành công!`)
        } catch (err) {
            console.error(err)
            alert('Upload ảnh thất bại. Vui lòng thử lại.')
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 z-10"
                >
                    <FiX className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <FiEdit className="text-green-600" />
                    Cập nhật sản phẩm
                </h2>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-gray-600">
                            Đang tải dữ liệu...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {product && !isLoading && (
                    <>
                        {/* Tên sản phẩm */}
                        <div className="mb-6">
                            <label className="block">
                                <span className="text-gray-700 font-medium">
                                    Tên sản phẩm
                                </span>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                                    required
                                />
                            </label>
                        </div>

                        {/* Mô tả sản phẩm - MỚI */}
                        <div className="mb-6">
                            <label className="block">
                                <span className="text-gray-700 font-medium">
                                    Mô tả sản phẩm
                                </span>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    placeholder="Nhập mô tả chi tiết sản phẩm..."
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base p-4 resize-none"
                                />
                            </label>
                        </div>

                        {/* Giá & kho */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <label className="block">
                                <span className="text-gray-700 font-medium flex items-center gap-1">
                                    <FiDollarSign className="text-indigo-500" />{' '}
                                    Giá Bán (VND)
                                </span>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                                    min="0"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-gray-700 font-medium">
                                    Giá Gốc (VND)
                                </span>
                                <input
                                    type="number"
                                    name="origin_price"
                                    value={formData.origin_price}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                                    min="0"
                                />
                            </label>

                            <label className="block">
                                <span className="text-gray-700 font-medium flex items-center gap-1">
                                    <FiPackage className="text-indigo-500" />{' '}
                                    Tồn Kho
                                </span>
                                <input
                                    type="number"
                                    name="stock_qty"
                                    value={formData.stock_qty}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                                    min="0"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-gray-700 font-medium">
                                    Ngưỡng Cảnh Báo
                                </span>
                                <input
                                    type="number"
                                    name="low_stock_threshold"
                                    value={formData.low_stock_threshold}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                                    min="0"
                                />
                            </label>
                        </div>

                        <label className="block mb-8">
                            <span className="text-gray-700 font-medium">
                                Trạng Thái
                            </span>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                            >
                                <option value={1}>Đang bán</option>
                                <option value={0}>Ngừng bán</option>
                            </select>
                        </label>

                        {/* Quản lý ảnh */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiImage className="text-indigo-500" />
                                Quản lý ảnh sản phẩm ({images.length})
                            </h3>

                            <div className="mb-6">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <button
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={isUploading}
                                    className={`w-full border-2 border-dashed rounded-xl px-6 py-12 flex flex-col items-center justify-center gap-3 transition-all ${
                                        isUploading
                                            ? 'bg-gray-50 border-gray-300 cursor-not-allowed'
                                            : 'border-indigo-300 bg-indigo-50 hover:bg-indigo-100 cursor-pointer'
                                    }`}
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                                            <p className="text-gray-600">
                                                Đang upload ảnh...
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <FiUpload className="w-12 h-12 text-indigo-500" />
                                            <p className="text-indigo-600 font-medium">
                                                Click hoặc kéo thả ảnh vào đây
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Hỗ trợ nhiều ảnh cùng lúc
                                            </p>
                                        </>
                                    )}
                                </button>
                            </div>

                            {images.length === 0 ? (
                                <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-xl">
                                    Chưa có ảnh nào
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {images.map(img => (
                                        <div
                                            key={img.id}
                                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                        >
                                            <img
                                                src={img.image_url}
                                                alt="product"
                                                className="w-20 h-20 object-cover rounded-lg border"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600">
                                                    ID: {img.id}
                                                </p>
                                                {img.is_main ? (
                                                    <span className="inline-flex items-center gap-1 text-emerald-600 text-sm font-medium">
                                                        <FiStar className="w-4 h-4 fill-emerald-600" />
                                                        Ảnh chính
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            handleSetMainImage(
                                                                img.id
                                                            )
                                                        }
                                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                                                    >
                                                        <FiStar className="w-4 h-4 text-indigo-600" />
                                                        Đặt làm ảnh chính
                                                    </button>
                                                )}
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleDeleteImage(img.id)
                                                }
                                                disabled={
                                                    isDeletingImage === img.id
                                                }
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                {isDeletingImage === img.id ? (
                                                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <FiTrash2 className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Nút hành động */}
                        <div className="flex justify-end gap-3 pt-6 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !hasChanges()}
                                className={`px-8 py-3 rounded-lg text-white font-semibold flex items-center gap-2 transition-colors ${
                                    isSaving || !hasChanges()
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-emerald-600 hover:bg-emerald-700'
                                }`}
                            >
                                <FiSave />
                                {isSaving
                                    ? 'Đang lưu...'
                                    : 'Lưu tất cả thay đổi'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default UpdateStockModal
