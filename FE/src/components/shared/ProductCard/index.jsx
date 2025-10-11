import React from 'react'
import { Link } from 'react-router-dom' // Bonus: Import Link để điều hướng
import { useAlert } from '~/contexts/AlertContext' // 1. Import hook useAlert
import { FaShoppingCart } from 'react-icons/fa'
import { BsStarFill, BsStar } from 'react-icons/bs'
import ocop3Star from '~/assets/icon/ocop/ocop-3-star.png'
import ocop4Star from '~/assets/icon/ocop/ocop-4-star.svg'
import { useDispatch } from 'react-redux'
import * as cartUserReducer from '~/Redux/reducers/cartUserReducer'

const ProductCard = ({
    image,
    name,
    price,
    oldPrice,
    ocop,
    rating = 0,
    reviewCount = 0,
    slug, // Bonus: Thêm slug để tạo link
}) => {
    const dispatch = useDispatch()
    // 2. Lấy hàm showAlert từ context
    const { showAlert } = useAlert()

    const ocopMap = {
        3: ocop3Star,
        4: ocop4Star,
    }
    const ocopImg = ocopMap[ocop] || null

    const stars = Array.from({ length: 5 }, (_, index) => {
        const starNumber = index + 1
        return starNumber <= rating ? (
            <BsStarFill key={index} className="text-yellow-400" />
        ) : (
            <BsStar key={index} className="text-gray-300" />
        )
    })

    let discountPercent = 0
    if (oldPrice && price) {
        const old = parseFloat(String(oldPrice).replace(/[^0-9.-]+/g, ''))
        const current = parseFloat(String(price).replace(/[^0-9.-]+/g, ''))
        if (old > current) {
            discountPercent = Math.round(((old - current) / old) * 100)
        }
    }

    // 3. Tạo hàm xử lý sự kiện click
    const handleAddToCart = e => {
        // Ngăn sự kiện click lan ra thẻ Link cha, tránh việc chuyển trang
        e.preventDefault()
        e.stopPropagation()

        // Gọi hàm hiển thị thông báo
        showAlert('Sản phẩm đã được thêm vào Giỏ hàng', { type: 'success' })

        // (Tùy chọn) Thêm logic xử lý thêm vào giỏ hàng thật ở đây
        // console.log(`Đã thêm sản phẩm "${name}" vào giỏ hàng.`)
    }

    return (
        // Bonus: Bọc toàn bộ thẻ bằng Link
        <Link
            to={`/product/${slug}`}
            className="block relative w-56 h-96 flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 font-sans border border-gray-100"
        >
            <div className="w-full h-48 mb-2">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-contain"
                />
            </div>

            {ocopImg && (
                <div className="absolute top-0 right-0 bg-white flex items-center justify-center p-1 shadow-sm">
                    <img
                        src={ocopImg}
                        alt={`OCOP ${ocop}`}
                        className="w-16 h-10 object-contain"
                    />
                </div>
            )}

            <h2 className="text-sm font-normal text-gray-800 line-clamp-2 mb-1 min-h-[40px]">
                {name}
            </h2>

            <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1">
                    <div className="flex">{stars}</div>
                    {reviewCount > 0 && (
                        <span className="text-gray-400 text-xs">
                            ({reviewCount})
                        </span>
                    )}
                </div>
                {/* 4. Gắn hàm handleAddToCart vào sự kiện onClick của button */}
                <button
                    onClick={handleAddToCart}
                    className="group bg-gray-100 rounded-full flex items-center justify-center p-2
                            hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                    aria-label="Thêm vào giỏ hàng"
                >
                    <FaShoppingCart
                        size={18}
                        className="text-gray-700 group-hover:text-white"
                    />
                </button>
            </div>

            <div className="flex flex-col mt-auto">
                <div className="flex items-baseline">
                    <span className="text-red-500 text-lg font-bold">
                        {price}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 min-h-[20px]">
                    {oldPrice && discountPercent > 0 && (
                        <>
                            <span className="bg-gray-100 rounded px-1 py-0.5 border border-gray-200">
                                -{discountPercent}%
                            </span>
                            <span className="line-through">{oldPrice}</span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default ProductCard