import React, { useEffect } from 'react'
import {
    FaStar,
    FaCheckCircle,
    FaTimesCircle,
    FaShoppingCart,
} from 'react-icons/fa'
import { useDispatch } from 'react-redux'

import { useProductBySlug } from '~/hooks/user/useProduct'
import { useAddCartItem } from '~/hooks/user/useCartItem'
import { useCurrentUser } from '~/hooks/user/useUser'
import { addCart } from '~/Redux/reducers/cartItemReducer'
import { useAlert } from '~/contexts/AlertContext'
import ReactGA from 'react-ga4'

const ProductDetail = ({ slug }) => {
    const {
        data: product,
        isLoading: isLoadingProduct,
        isError,
        error,
    } = useProductBySlug(slug)

    const { user, isAuthenticated } = useCurrentUser()
    const dispatch = useDispatch()
    const { showAlert } = useAlert()

    const addCartItemMutation = useAddCartItem(user?.user_id)
    useEffect(() => {
        if (!product || !product.id) return

        ReactGA.event('view_item', {
            currency: 'VND',
            value: Number(product.price),
            items: [
                {
                    item_id: String(product.id),
                    item_name: product.name,
                    price: Number(product.price),
                    quantity: 1,
                    item_category: product.category_name || 'Sản phẩm',
                },
            ],
            debug_mode: true,
        })
    }, [product])
    const handleAddToCart = () => {
        if (!product || !product.id) return

        if (isAuthenticated) {
            addCartItemMutation.mutate(
                {
                    productId: product.id,
                    quantity: 1,
                },
                {
                    onSuccess: data => {
                        showAlert(
                            data?.message || 'Thêm vào giỏ hàng thành công!',
                            {
                                type: 'success',
                            }
                        )
                        ReactGA.gtag('event', 'add_to_cart', {
                            currency: 'VND',
                            value: product.price,
                            items: [
                                {
                                    item_id: String(product.id),
                                    item_name: product.name,
                                    price: Number(product.price),
                                    quantity: 1,
                                },
                            ],
                            debug_mode: true,
                        })
                    },
                    onError: error => {
                        showAlert(
                            error?.response?.data?.message ||
                                'Đã có lỗi xảy ra. Vui lòng thử lại.',
                            { type: 'error' }
                        )
                    },
                }
            )
        } else {
            const cartItem = {
                product_id: product.id,
                name: product.name,
                description: product.description,
                slug: product.slug,
                price: product.price,
                origin_price: product.origin_price,
                ocop_rating: product.ocop_rating || 0,
                main_image: product.images[0] || '',
                qty_total: 1,
            }

            try {
                dispatch(addCart({ cartItem }))

                showAlert('Thêm vào giỏ hàng thành công!', {
                    type: 'success',
                })
                ReactGA.gtag('event', 'add_to_cart', {
                    currency: 'VND',
                    value: product.price,
                    items: [
                        {
                            item_id: String(product.id),
                            item_name: product.name,
                            price: Number(product.price),
                            quantity: 1,
                        },
                    ],
                    debug_mode: true,
                })
                console.log(Number(product.price))
            } catch (e) {
                showAlert('Lỗi khi thêm sản phẩm vào giỏ hàng.', {
                    type: 'error',
                })
                console.error('Redux dispatch error:', e)
            }
        }
    }

    if (isLoadingProduct) {
        return (
            <div className="animate-pulse text-gray-400">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="text-red-600 bg-red-50 border border-red-200 p-4 rounded-md">
                Lỗi tải thông tin sản phẩm: {error?.message || 'Không xác định'}
            </div>
        )
    }

    if (!product) {
        return (
            <div className="text-gray-600 italic">
                Không tìm thấy thông tin sản phẩm.
            </div>
        )
    }

    const {
        name = 'Sản phẩm',
        description = 'Không có mô tả.',
        origin_price,
        price,
        buyed = 0,
        rate_point_total = 0,
        rate_count = 0,
        stock_qty = 0,
    } = product
    const averageRating =
        rate_count > 0 ? Math.round(rate_point_total / rate_count) : 0
    const isAvailable = stock_qty > 0
    const originalPrice = origin_price ? parseFloat(origin_price) : null
    const salePrice = price ? parseFloat(price) : null

    const isLoading = addCartItemMutation.isLoading

    return (
        <div>
            <h1 className="text-2xl font-bold uppercase">{name}</h1>

            <div className="flex items-center my-5 space-x-2">
                <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <FaStar
                            key={index}
                            className={
                                index < averageRating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                            }
                        />
                    ))}
                </div>
                <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded border border-gray-300">
                    {rate_count} đánh giá
                </span>
            </div>

            <div className="flex justify-between text-gray-600 text-sm my-5">
                <div className="flex items-center space-x-1">
                    <FaShoppingCart />
                    <span>{buyed.toLocaleString('vi-VN')} đã bán</span>
                </div>
            </div>

            {Array.isArray(description) ? (
                description.map((line, idx) => (
                    <p key={idx} className="text-gray-700 my-4">
                        {line}
                    </p>
                ))
            ) : (
                <p className="text-gray-700 my-4">{description}</p>
            )}

            <div className="mt-12">
                <span className="font-bold mr-2">Tình trạng:</span>
                <span
                    className={`px-3 py-1 rounded-md text-sm font-medium inline-flex items-center space-x-1 ${
                        isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}
                >
                    {isAvailable ? <FaCheckCircle /> : <FaTimesCircle />}
                    <span>{isAvailable ? 'Còn hàng' : 'Hết hàng'}</span>
                </span>
            </div>

            <div className="my-6 flex items-baseline gap-4">
                {originalPrice && (
                    <span className="text-gray-400 line-through text-lg">
                        {originalPrice.toLocaleString('vi-VN')}₫
                    </span>
                )}
                {salePrice && (
                    <span className="text-red-600 font-semibold text-3xl">
                        {salePrice.toLocaleString('vi-VN')}₫
                    </span>
                )}
            </div>

            <button
                onClick={handleAddToCart}
                disabled={!isAvailable || isLoading}
                className={`flex items-center justify-center gap-2 text-white px-4 py-2 rounded mt-4 text-sm transition-colors ${
                    isAvailable
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-400 cursor-not-allowed'
                } ${isLoading ? 'bg-gray-400 cursor-wait' : ''}`}
            >
                <FaShoppingCart />
                <span>{isLoading ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}</span>
            </button>

            <p className="mt-4 text-xs text-gray-500 italic">
                Mã sản phẩm: {slug}
            </p>
        </div>
    )
}

export default ProductDetail
