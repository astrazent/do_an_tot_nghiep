import React, { useState } from 'react'
import { FaSearch, FaChevronDown } from 'react-icons/fa'
import ProductListSection from '../ProductListSection'

// Import hình ảnh sản phẩm
import chanVitRutXuongUXiDau from '~/assets/image/shared/product/chan-vit-rut-xuong-u-xi-dau.png'
import pateGanVit from '~/assets/image/shared/product/pate-gan-vit.jpg'
import gaDongTaoUMuoi from '~/assets/image/shared/product/dong-tao-u-muoi.png'
import gaUMuoi from '~/assets/image/shared/product/ga-u-muoi.png'
import gaUXiDau from '~/assets/image/shared/product/ga-u-xi-dau.jpg'

const productCategories = [
    'Sản phẩm từ vịt',
    'Sản phẩm từ gà',
    'Các loại hạt',
    'Sản phẩm từ heo',
    'Sản phẩm từ cá',
    'Sản phẩm từ ngan',
    'Hải sản',
    'Các loại ruốc',
    'Thực phẩm khác',
]

const priceRanges = [
    { label: '0 VND', value: 0 },
    { label: '100,000 VND', value: 100000 },
    { label: '200,000 VND', value: 200000 },
    { label: '500,000 VND', value: 500000 },
    { label: '1,000,000 VND', value: 1000000 },
]

const featuredProductsData = [
    {
        id: 1,
        name: 'Chân Vịt Rút Xương',
        price: 150000,
        category: 'Sản phẩm từ vịt',
        imageUrl: chanVitRutXuongUXiDau,
    },
    {
        id: 2,
        name: 'Pate gan vịt - Mua 1 tặng 1',
        price: 120000,
        discountPrice: 120000,
        category: 'Sản phẩm từ vịt',
        imageUrl: pateGanVit,
    },
    {
        id: 3,
        name: 'Gà ủ muối',
        price: 260000,
        category: 'Sản phẩm từ gà',
        imageUrl: gaUMuoi,
    },
    {
        id: 4,
        name: 'Hạt Điều Rang Củi',
        price: 250000,
        category: 'Các loại hạt',
        imageUrl: gaDongTaoUMuoi,
    },
    {
        id: 5,
        name: 'Cá Cơm Sấy Giòn',
        price: 95000,
        category: 'Sản phẩm từ cá',
        imageUrl: gaUMuoi,
    },
]

const hotProductsData = [
    {
        id: 1,
        name: 'Pate gan vịt',
        price: 180000,
        category: 'Sản phẩm từ vịt',
        imageUrl: pateGanVit,
    },
    {
        id: 2,
        name: 'Gà Đông Tảo ủ muối',
        price: 350000,
        category: 'Sản phẩm từ gà',
        imageUrl: gaDongTaoUMuoi,
    },
    {
        id: 3,
        name: 'Gà ủ xì dầu',
        price: 280000,
        category: 'Sản phẩm từ gà',
        imageUrl: gaUXiDau,
    },
]

const Sidebar = ({
    onSearch, // ✅ callback nhận bộ lọc tìm kiếm
    sections: {
        search = true,
        categories = true,
        featured = true,
        hot = true,
        isPromotion = true,
    } = {},
}) => {
    const [filters, setFilters] = useState({
        category: '',
        minPrice: 0,
        maxPrice: 1000000,
    })

    const handleSearchClick = () => {
        if (onSearch) onSearch(filters)
    }

    const handleCategoryClick = category => {
        const updatedFilters = { ...filters, category }
        setFilters(updatedFilters)
        if (onSearch) onSearch(updatedFilters)
    }

    return (
        <aside className="w-full max-w-xs rounded-lg p-4 font-sans bg-white shadow-sm">
            {search && (
                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase pb-2 border-b">
                        Tìm kiếm
                    </h3>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-2">
                                Danh mục
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white appearance-none pr-8"
                                    value={filters.category}
                                    onChange={e =>
                                        setFilters({
                                            ...filters,
                                            category: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">Tất cả</option>
                                    {productCategories.map(c => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-2">
                                Khoảng giá
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white appearance-none pr-8"
                                        value={filters.minPrice}
                                        onChange={e =>
                                            setFilters({
                                                ...filters,
                                                minPrice: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                    >
                                        {priceRanges.map(p => (
                                            <option
                                                key={p.value}
                                                value={p.value}
                                            >
                                                {p.label}
                                            </option>
                                        ))}
                                    </select>
                                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                                <span className="text-gray-500">đến</span>
                                <div className="relative flex-1">
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white appearance-none pr-8"
                                        value={filters.maxPrice}
                                        onChange={e =>
                                            setFilters({
                                                ...filters,
                                                maxPrice: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                    >
                                        {priceRanges.map(p => (
                                            <option
                                                key={p.value}
                                                value={p.value}
                                            >
                                                {p.label}
                                            </option>
                                        ))}
                                    </select>
                                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSearchClick}
                            className="w-full bg-green-600 text-white font-bold py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                        >
                            <FaSearch />
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
                        <ul>
                            {productCategories.map(category => (
                                <li key={category}>
                                    <button
                                        onClick={() =>
                                            handleCategoryClick(category)
                                        }
                                        className="w-full text-left block p-3 text-sm text-gray-600 border-b hover:bg-green-50 hover:text-green-700 transition-colors"
                                    >
                                        {category}
                                    </button>
                                </li>
                            ))}
                        </ul>
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
