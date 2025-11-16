import React from 'react'
import { useState, useEffect } from 'react'
import { FaChevronDown, FaSearch } from 'react-icons/fa'
import ReactSlider from 'react-slider'
import './sidebar.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useAllCategories } from '~/hooks/user/useCategory'
import { useHotProducts } from '~/hooks/user/useProduct'

import ProductListSection from '../ProductListSection'

const Sidebar = ({
    sections: {
        search = true,
        categories = true,
        featured = true,
        hot = true,
        isPromotion = true,
    } = {},
} = {}) => {
    const {
        data: productCategories,
        isLoading: isLoadingCategories,
        isError: isErrorCategories,
    } = useAllCategories()

    const {
        data: sidebarProductsData,
        isLoading: isLoadingSidebarProducts,
        isError: isErrorSidebarProducts,
    } = useHotProducts(6)
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
                                    disabled={isLoadingCategories}
                                >
                                    {isLoadingCategories ? (
                                        <option>Đang tải danh mục...</option>
                                    ) : isErrorCategories ? (
                                        <option>Lỗi tải danh mục</option>
                                    ) : (
                                        productCategories?.map(category => (
                                            <option
                                                key={category.id}
                                                value={category.slug}
                                            >
                                                {category.name}
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
                        {isLoadingCategories ? (
                            <p className="p-3 text-sm text-gray-500">
                                Đang tải...
                            </p>
                        ) : isErrorCategories ? (
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

            {featured &&
                (isLoadingSidebarProducts ? (
                    <p>Loading featured products...</p>
                ) : isErrorSidebarProducts ? (
                    <p>Error loading featured products.</p>
                ) : (
                    <ProductListSection
                        title="Sản phẩm OCCOP"
                        products={sidebarProductsData?.data?.occopProducts}
                        isPromotion={isPromotion}
                    />
                ))}

            {hot &&
                (isLoadingSidebarProducts ? (
                    <p>Loading hot products...</p>
                ) : isErrorSidebarProducts ? (
                    <p>Error loading hot products.</p>
                ) : (
                    <ProductListSection
                        title="Sản phẩm nổi bật"
                        products={sidebarProductsData?.data?.hotProducts}
                        isPromotion={isPromotion}
                    />
                ))}
        </aside>
    )
}

export default Sidebar
