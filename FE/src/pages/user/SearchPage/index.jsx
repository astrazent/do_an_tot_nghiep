import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import ProductCard from '~/components/shared/ProductCard'
import SortBar from '~/components/shared/SortBar'
import { useSearchProductsByCategory } from '~/hooks/user/useProduct'

const parsePrice = priceString =>
    parseInt(String(priceString).replace(/[^0-9]/g, ''), 10)

// Hàm tiện ích để định dạng tiền tệ
const formatCurrency = value =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(value)

const ITEMS_PER_LOAD = 8

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchTerm, setSearchTerm] = useState('')
    // Lấy các tham số từ URL
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
        ? parseInt(searchParams.get('minPrice'))
        : null
    const maxPrice = searchParams.get('maxPrice')
        ? parseInt(searchParams.get('maxPrice'))
        : null
    const sortBy = searchParams.get('sortBy') || 'newest'

    const [filteredProducts, setFilteredProducts] = useState([])

    const [productsToShow, setProductsToShow] = useState(ITEMS_PER_LOAD)

    const { data: apiResponse, isLoading } = useSearchProductsByCategory({
        slug: category,
    })

    useEffect(() => {
        if (apiResponse && Array.isArray(apiResponse)) {
            const productsFromApi = apiResponse

            let priceFilteredResults = productsFromApi.filter(product => {
                const productPrice = parsePrice(product.price)
                if (minPrice !== null && productPrice < minPrice) return false
                if (maxPrice !== null && productPrice > maxPrice) return false
                if (
                    searchTerm &&
                    !product.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
                    return false
                return true
            })

            let sortedResults = [...priceFilteredResults]
            switch (sortBy) {
                case 'newest':
                    sortedResults.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    break
                case 'promotion':
                    sortedResults.sort((a, b) => {
                        const aIsPromo = !!a.oldPrice
                        const bIsPromo = !!b.oldPrice
                        return (
                            (bIsPromo ? 1 : 0) - (aIsPromo ? 1 : 0) ||
                            new Date(b.createdAt) - new Date(a.createdAt)
                        )
                    })
                    break
                case 'price-asc':
                    sortedResults.sort(
                        (a, b) => parsePrice(a.price) - parsePrice(b.price)
                    )
                    break
                case 'price-desc':
                    sortedResults.sort(
                        (a, b) => parsePrice(b.price) - parsePrice(a.price)
                    )
                    break
                case 'ocop-3':
                    sortedResults.sort(
                        (a, b) =>
                            (b.ocop === 3 ? 1 : 0) - (a.ocop === 3 ? 1 : 0) ||
                            new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    break
                case 'ocop-4':
                    sortedResults.sort(
                        (a, b) =>
                            (b.ocop === 4 ? 1 : 0) - (a.ocop === 4 ? 1 : 0) ||
                            new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    break
                case 'rating-desc':
                    sortedResults.sort(
                        (a, b) => (b.rating || 0) - (a.rating || 0)
                    )
                    break
                case 'rating-asc':
                    sortedResults.sort(
                        (a, b) => (a.rating || 0) - (b.rating || 0)
                    )
                    break
                default:
                    break
            }

            setFilteredProducts(sortedResults)
        } else {
            setFilteredProducts([])
        }
        setProductsToShow(ITEMS_PER_LOAD)
    }, [apiResponse, sortBy, minPrice, maxPrice, searchTerm])

    const productsToDisplay = filteredProducts.slice(0, productsToShow)
    const hasMoreProducts = productsToShow < filteredProducts.length

    const remainingProductsCount = filteredProducts.length - productsToShow
    const amountToLoadNext = Math.min(remainingProductsCount, ITEMS_PER_LOAD)

    const handleLoadMore = () =>
        setProductsToShow(prev => prev + ITEMS_PER_LOAD)

    const handleRemoveFilter = keys => {
        const updated = new URLSearchParams(searchParams)
        if (Array.isArray(keys)) {
            keys.forEach(k => updated.delete(k))
        } else {
            updated.delete(keys)
        }
        setSearchParams(updated)
    }

    const handleSortChange = newSortBy => {
        const updated = new URLSearchParams(searchParams)
        updated.set('sortBy', newSortBy)
        setSearchParams(updated)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-lg font-semibold text-gray-600">
                    Đang tải sản phẩm...
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen font-sans">
            <main className="max-w-7xl mx-auto p-4">
                {}
                <section className="mb-6 p-5 bg-white rounded-xl shadow border border-gray-100">
                    {}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 uppercase flex items-center">
                            <span className="w-1.5 h-6 bg-green-600 mr-2 rounded-sm"></span>
                            Kết quả tìm kiếm
                        </h2>
                        <span className="text-sm text-gray-500 font-medium">
                            {filteredProducts.length} sản phẩm
                        </span>
                    </div>

                    {}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-start md:gap-x-6 gap-y-3">
                        {}
                        <div className="relative flex-1 max-w-[320px]">
                            <input
                                type="text"
                                placeholder="Tìm trong kết quả..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full border border-green-400 rounded-lg py-1.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-green-600 w-4 h-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                                />
                            </svg>
                        </div>

                        {}
                        {(category ||
                            (minPrice !== null && maxPrice !== null)) && (
                            <div className="flex flex-wrap justify-start gap-1 text-xs leading-normal">
                                <span className="text-gray-500 font-medium mr-1">
                                    Bộ lọc:
                                </span>

                                {category && (
                                    <span className="inline-flex items-center bg-green-50 text-green-700 border border-green-200 rounded px-1.5 py-[2px] font-medium transition hover:bg-green-100">
                                        <span className="capitalize w-full">
                                            {category.replace(/-/g, ' ')}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleRemoveFilter('category')
                                            }
                                            style={{
                                                paddingRight: 3,
                                                margin: 0,
                                                border: 'none',
                                                background: 'transparent',
                                            }}
                                            className="ml-0.5 text-green-500 hover:text-green-700 text-[10px] leading-[0]"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}

                                {minPrice !== null && maxPrice !== null && (
                                    <span className="inline-flex items-center bg-green-50 text-green-700 border border-green-200 rounded px-1.5 py-[2px] font-medium transition hover:bg-green-100">
                                        Giá: {formatCurrency(minPrice)} -{' '}
                                        {formatCurrency(maxPrice)}
                                        <button
                                            onClick={() =>
                                                handleRemoveFilter([
                                                    'minPrice',
                                                    'maxPrice',
                                                ])
                                            }
                                            style={{
                                                paddingRight: 3,
                                                margin: 0,
                                                border: 'none',
                                                background: 'transparent',
                                            }}
                                            className="ml-0.5 text-green-500 hover:text-green-700 text-[10px] leading-[0]"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                <SortBar sortBy={sortBy} onSortChange={handleSortChange} />

                <section>
                    {productsToDisplay.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                {productsToDisplay.map(product => (
                                    <Link
                                        to={`/product/${product.slug}`}
                                        key={product.id}
                                    >
                                        <ProductCard
                                            image={product.image}
                                            name={product.name}
                                            price={product.price}
                                            oldPrice={product.oldPrice}
                                            ocop={product.ocop}
                                            rating={product.rating}
                                            reviewCount={product.reviewCount}
                                            size="small"
                                        />
                                    </Link>
                                ))}
                            </div>
                            {hasMoreProducts && (
                                <div className="text-center mt-10">
                                    <button
                                        onClick={handleLoadMore}
                                        className="px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300 shadow-lg"
                                    >
                                        {}
                                        Xem thêm ({amountToLoadNext} sản phẩm)
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 px-6 bg-white rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-700">
                                Không tìm thấy sản phẩm nào phù hợp
                            </h3>
                            <p className="text-gray-500 mt-2">
                                Vui lòng thử thay đổi bộ lọc hoặc tìm kiếm với
                                từ khóa khác.
                            </p>
                            <Link
                                to="/category/all"
                                className="mt-4 inline-block bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                            >
                                Xem tất cả sản phẩm
                            </Link>
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default SearchPage
