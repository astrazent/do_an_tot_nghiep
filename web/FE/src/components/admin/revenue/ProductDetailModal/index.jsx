// components/admin/ProductDetailModal.js
import React, { useState, useEffect } from 'react'
import {
    FiX,
    FiDollarSign,
    FiPackage,
    FiStar,
    FiCalendar,
    FiEye,
    FiImage,
} from 'react-icons/fi'
import {
    getProductById,
    getImageforProduct,
} from '~/services/admin/productAdminService'

const formatCurrency = amount => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount || 0)
}

const formatDateTime = isoString => {
    if (!isoString) return 'N/A'
    const date = new Date(isoString)
    const time = date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
    })
    const day = date.toLocaleDateString('vi-VN')
    return `${time} ${day}`
}

const ProductDetailModal = ({ productId, isOpen, onClose }) => {
    const [product, setProduct] = useState(null)
    const [images, setImages] = useState([]) // Danh sách ảnh
    const [loading, setLoading] = useState(true)
    const [loadingImages, setLoadingImages] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!isOpen || !productId) {
            setProduct(null)
            setImages([])
            return
        }

        const fetchProductDetail = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await getProductById(productId)
                setProduct(response.data)
            } catch (err) {
                console.error('Lỗi khi lấy chi tiết sản phẩm:', err)
                setError('Không thể tải thông tin sản phẩm.')
            } finally {
                setLoading(false)
            }
        }

        const fetchProductImages = async () => {
            setLoadingImages(true)
            try {
                const res = await getImageforProduct(productId)
                setImages(res.data || [])
            } catch (err) {
                console.error('Lỗi khi lấy ảnh sản phẩm:', err)
                setImages([])
            } finally {
                setLoadingImages(false)
            }
        }

        fetchProductDetail()
        fetchProductImages()
    }, [productId, isOpen])

    if (!isOpen) return null

    const averageRating =
        product && product.rate_count > 0
            ? (product.rate_point_total / product.rate_count).toFixed(1)
            : 'Chưa có'

    const mainImage = images.find(img => img.is_main) || images[0]
    const otherImages = images.filter(img => img !== mainImage)

    console.log(mainImage, otherImages)

    const backdropStyle = {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
    }

    return (
        <div
            className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 transition-opacity"
            style={backdropStyle}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                    <FiX className="w-6 h-6" />
                </button>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-gray-600">
                            Đang tải thông tin...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                )}

                {product && !loading && !error && (
                    <>
                        <div className="mb-6">
                            <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                                {product.name}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                ID: #{product.id} | Slug:{' '}
                                {product.slug || 'N/A'}
                            </p>
                        </div>

                        {/* PHẦN ẢNH SẢN PHẨM */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-gray-600 mb-4 flex items-center gap-2">
                                <FiImage className="text-indigo-500 w-5 h-5" />
                                Hình ảnh sản phẩm ({images.length})
                            </h3>

                            {loadingImages ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
                                </div>
                            ) : images.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <FiImage className="mx-auto text-gray-300 w-16 h-16 mb-3" />
                                    <p className="text-gray-500">
                                        Chưa có ảnh nào được tải lên
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {/* Ảnh chính – lớn */}
                                    {mainImage && (
                                        <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-2xl group">
                                            <img
                                                src={mainImage.image_url}
                                                alt={product.name}
                                                className="w-full h-96 object-cover shadow-lg border border-gray-200 group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {mainImage.is_main && (
                                                <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                                    Ảnh chính
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Các ảnh phụ */}
                                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                        {otherImages.map(img => (
                                            <div
                                                className="relative overflow-hidden rounded-xl group cursor-pointer"
                                            >
                                                <img
                                                    src={img.image_url}
                                                    alt={product.name}
                                                    className="w-full h-32 object-cover border border-gray-200 rounded-xl shadow group-hover:scale-110 group-hover:border-indigo-400 transition-all duration-300"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* THÔNG TIN CHI TIẾT */}
                        <div className="space-y-6 text-base">
                            <div className="grid grid-cols-2 gap-8 border-b pb-6">
                                <div>
                                    <h3 className="font-semibold text-gray-600 mb-2 flex items-center gap-2">
                                        <FiDollarSign className="text-indigo-500 w-5 h-5" />
                                        Giá bán
                                    </h3>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {formatCurrency(product.price)}
                                    </p>
                                    {product.origin_price > product.price && (
                                        <p className="text-sm text-gray-500 line-through">
                                            Giá gốc:{' '}
                                            {formatCurrency(
                                                product.origin_price
                                            )}
                                        </p>
                                    )}
                                    {product.import_price && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            Giá nhập:{' '}
                                            {formatCurrency(
                                                product.import_price
                                            )}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-600 mb-2 flex items-center gap-2">
                                        <FiPackage className="text-indigo-500 w-5 h-5" />
                                        Tồn kho
                                    </h3>
                                    <p
                                        className={`text-2xl font-bold ${product.stock_qty <= product.low_stock_threshold ? 'text-red-600' : 'text-green-600'}`}
                                    >
                                        {product.stock_qty}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Ngưỡng cảnh báo:{' '}
                                        <strong>
                                            {product.low_stock_threshold}
                                        </strong>
                                    </p>
                                    {product.last_restock_at && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            Nhập lần cuối:{' '}
                                            {formatDateTime(
                                                product.last_restock_at
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 border-b pb-6">
                                <div>
                                    <h3 className="font-semibold text-gray-600 mb-2 flex items-center gap-2">
                                        <FiStar className="text-amber-500 w-5 h-5" />
                                        Đánh giá
                                    </h3>
                                    <p className="text-xl font-bold text-amber-600 flex items-center">
                                        {averageRating} sao{' '}
                                        <span className="text-base font-normal text-gray-500 ml-2">
                                            ({product.rate_count} đánh giá)
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Đã bán:{' '}
                                        <strong>
                                            {new Intl.NumberFormat().format(
                                                product.buyed || 0
                                            )}
                                        </strong>
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-600 mb-2 flex items-center gap-2">
                                        <FiCalendar className="text-indigo-500 w-5 h-5" />
                                        Thời gian
                                    </h3>
                                    <p className="text-gray-700 font-medium">
                                        {formatDateTime(product.created_at)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Cập nhật:{' '}
                                        {formatDateTime(product.updated_at)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-600 mb-2">
                                    Mô tả sản phẩm
                                </h3>
                                <div className="text-gray-700 bg-gray-50 p-5 rounded-xl max-h-48 overflow-y-auto text-base leading-relaxed">
                                    {product.description ||
                                        'Không có mô tả chi tiết.'}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ProductDetailModal
