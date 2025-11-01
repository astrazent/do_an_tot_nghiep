import React from 'react'
import { useState, useEffect } from 'react'
import { FaChevronDown, FaSearch } from 'react-icons/fa'
import ReactSlider from 'react-slider'
import './sidebar.scss'
import { Link, useNavigate } from 'react-router-dom'
import { slugify } from '~/utils/slugify'
import { useAllCategories } from '~/hooks/user/useCategory'
import chanVitRutXuongUXiDau from '~/assets/image/shared/product/chan-vit-rut-xuong-u-xi-dau.png'
import pateGanVit from '~/assets/image/shared/product/pate-gan-vit.jpg'
import gaDongTaoUMuoi from '~/assets/image/shared/product/dong-tao-u-muoi.png'
import gaUMuoi from '~/assets/image/shared/product/ga-u-muoi.png'
import gaUXiDau from '~/assets/image/shared/product/ga-u-xi-dau.jpg'

import ProductListSection from '../ProductListSection'

const hotProductsData = [
    {
        id: 1,
        name: 'Pate gan vịt',
        price: '180,000 VND',
        imageUrl: pateGanVit,
        slug: slugify('Pate gan vịt'),
    },
    {
        id: 2,
        name: 'Gà Đông Tảo ủ muối',
        price: '350,000 VND',
        imageUrl: gaDongTaoUMuoi,
        slug: slugify('Gà Đông Tảo ủ muối'),
    },
    {
        id: 3,
        name: 'Combo Gà Đông Tảo - Sale sốc',
        imageUrl: gaDongTaoUMuoi,
        price: '450.000đ',
        discountPrice: '360.000đ',
        slug: slugify('Combo Gà Đông Tảo - Sale sốc'),
    },
    {
        id: 4,
        name: 'Gà ủ xì dầu',
        price: '280,000 VND',
        imageUrl: gaUXiDau,
        slug: slugify('Gà ủ xì dầu'),
    },
    {
        id: 5,
        name: 'Pate gan vịt',
        price: '180,000 VND',
        imageUrl: pateGanVit,
        slug: slugify('Pate gan vịt'),
    },
    {
        id: 6,
        name: 'Gà Đông Tảo ủ muối',
        price: '350,000 VND',
        imageUrl: gaDongTaoUMuoi,
        slug: slugify('Gà Đông Tảo ủ muối'),
    },
    {
        id: 7,
        name: 'Gà ủ xì dầu',
        price: '280,000 VND',
        imageUrl: gaUXiDau,
        slug: slugify('Gà ủ xì dầu'),
    },
]

const featuredProductsData = [
    {
        id: 1,
        name: 'Chân Vịt Rút Xương',
        price: '150,000 VND',
        imageUrl: chanVitRutXuongUXiDau,
        slug: slugify('Chân Vịt Rút Xương'),
    },
    {
        id: 2,
        name: 'Pate gan vịt - Mua 1 tặng 1',
        imageUrl: pateGanVit,
        price: '120.000đ',
        discountPrice: '120.000đ',
        slug: slugify('Pate gan vịt - Mua 1 tặng 1'),
    },
    {
        id: 3,
        name: 'Gà ủ muối',
        price: '260,000 VND',
        imageUrl: gaUMuoi,
        slug: slugify('Gà ủ muối'),
    },
    {
        id: 4,
        name: 'Hạt Điều Rang Củi',
        price: '250,000 VND',
        imageUrl: gaDongTaoUMuoi,
        slug: slugify('Hạt Điều Rang Củi'),
    },
    {
        id: 5,
        name: 'Cá Cơm Sấy Giòn',
        price: '95,000 VND',
        imageUrl: gaUMuoi,
        slug: slugify('Cá Cơm Sấy Giòn'),
    },
    {
        id: 6,
        name: 'Combo Gà Đông Tảo - Sale sốc',
        imageUrl: gaDongTaoUMuoi,
        price: '450.000đ',
        discountPrice: '360.000đ',
        slug: slugify('Combo Gà Đông Tảo - Sale sốc'),
    },
]

const Sidebar = ({
    sections: {
        search = true,
        categories = true,
        featured = true,
        hot = true,
        isPromotion = true,
    } = {},
} = {}) => {
    const { data: productCategories, isLoading, isError } = useAllCategories()
    const [priceValues, setPriceValues] = useState([0, 500000])
    const [selectedCategory, setSelectedCategory] = useState('')
    const navigate = useNavigate()
    useEffect(() => {
        if (
            productCategories &&
            productCategories.length > 0 &&
            !selectedCategory
        ) {
            setSelectedCategory(productCategories[0].slug)
        }
    }, [productCategories, selectedCategory])
    const handleSearch = () => {
        const searchUrl = `/search?category=${selectedCategory}&minPrice=${priceValues[0]}&maxPrice=${priceValues[1]}`
        navigate(searchUrl)
    }

    return (
        <aside className="w-full max-w-xs rounded-lg font-sans">
            {search && (
                <div className="w-full max-w-xs rounded-lg p-4 font-sans text-sm">
                    <h3 className="font-bold text-gray-500 uppercase pb-2 border-b">
                        Tìm kiếm
                    </h3>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label className="font-semibold text-gray-700 block mb-2">
                                Danh mục
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedCategory}
                                    onChange={e =>
                                        setSelectedCategory(e.target.value)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white appearance-none pr-8"
                                    disabled={isLoading} // Vô hiệu hóa khi đang tải
                                >
                                    {isLoading ? (
                                        <option>Đang tải danh mục...</option>
                                    ) : isError ? (
                                        <option>Lỗi tải danh mục</option>
                                    ) : (
                                        productCategories?.map(category => (
                                            <option
                                                key={category.id} // Sử dụng id cho key
                                                value={category.slug} // Sử dụng slug từ API
                                            >
                                                {category.name}{' '}
                                                {/* Sử dụng name từ API */}
                                            </option>
                                        ))
                                    )}
                                </select>
                                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="font-semibold text-gray-700 block mb-2">
                                Khoảng giá
                            </label>
                            <ReactSlider
                                className="horizontal-slider"
                                thumbClassName="thumb"
                                trackClassName="track"
                                value={priceValues}
                                min={0}
                                max={500000}
                                ariaLabel={['Lower thumb', 'Upper thumb']}
                                pearling
                                minDistance={10000}
                                onChange={values => setPriceValues(values)}
                            />
                            <div className="mt-3 text-gray-800 font-semibold space-y-1">
                                <div>
                                    <span className="font-bold text-green-600">
                                        Từ:{' '}
                                    </span>
                                    {priceValues[0].toLocaleString('vi-VN')} ₫
                                </div>
                                <div>
                                    <span className="font-bold text-green-600">
                                        Đến:{' '}
                                    </span>
                                    {priceValues[1].toLocaleString('vi-VN')} ₫
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleSearch}
                            className="w-full bg-green-600 text-white font-bold text-sm py-1.5 rounded-md flex items-center justify-center gap-1.5 hover:bg-green-700 transition-colors"
                        >
                            <FaSearch className="text-xs" />
                            TÌM KIẾM
                        </button>
                    </div>
                </div>
            )}

            {categories && (
                <div className="mt-8">
                    <h3 className="text-sm font-bold text-gray-500 uppercase pb-2 border-b">
                        Danh mục sản phẩm
                    </h3>
                    <div className="mt-2">
                        {}
                        {isLoading ? (
                            <p className="p-3 text-sm text-gray-500">
                                Đang tải...
                            </p>
                        ) : isError ? (
                            <p className="p-3 text-sm text-red-500">
                                Không thể tải danh mục.
                            </p>
                        ) : (
                            <ul>
                                {productCategories?.map(category => (
                                    <li key={category.id}>
                                        <Link
                                            to={`/category/${category.slug}`}
                                            className="block p-3 text-sm text-gray-600 border-b hover:bg-green-50 hover:text-green-700 transition-colors"
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {featured && (
                <ProductListSection
                    title="Có thể bạn sẽ thích"
                    products={featuredProductsData}
                    isPromotion={isPromotion}
                />
            )}

            {hot && (
                <ProductListSection
                    title="Sản phẩm nổi bật"
                    products={hotProductsData}
                    isPromotion={isPromotion}
                />
            )}
        </aside>
    )
}

export default Sidebar
