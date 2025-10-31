import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import ProductCard from '~/components/shared/ProductCard'
import SortBar from '~/components/shared/SortBar'
import { useSearchProductsByCategoryAndPrice } from '~/hooks/user/useProduct'

const parsePrice = priceString =>
    parseInt(String(priceString).replace(/[^0-9]/g, ''), 10)
const formatCurrency = value =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(value)

const ITEMS_PER_LOAD = 8

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [filteredProducts, setFilteredProducts] = useState([])
    const [productsToShow, setProductsToShow] = useState(ITEMS_PER_LOAD)

    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
        ? parseInt(searchParams.get('minPrice'))
        : null
    const maxPrice = searchParams.get('maxPrice')
        ? parseInt(searchParams.get('maxPrice'))
        : null
    const sortBy = searchParams.get('sortBy') || 'newest'

    const { data: apiResponse, isLoading } =
        useSearchProductsByCategoryAndPrice({
            category,
            minPrice,
            maxPrice,
        })

    useEffect(() => {
        const productsFromApi = apiResponse || []

        let results = [...productsFromApi]

        switch (sortBy) {
            case 'newest':
                results.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )
                break
            case 'promotion':
                results.sort((a, b) => {
                    const aIsPromo = !!a.oldPrice
                    const bIsPromo = !!b.oldPrice
                    return (
                        (bIsPromo ? 1 : 0) - (aIsPromo ? 1 : 0) ||
                        new Date(b.createdAt) - new Date(a.createdAt)
                    )
                })
                break
            case 'price-asc':
                results.sort(
                    (a, b) => parsePrice(a.price) - parsePrice(b.price)
                )
                break
            case 'price-desc':
                results.sort(
                    (a, b) => parsePrice(b.price) - parsePrice(a.price)
                )
                break
            case 'ocop-3':
                results.sort(
                    (a, b) =>
                        (b.ocop === 3 ? 1 : 0) - (a.ocop === 3 ? 1 : 0) ||
                        new Date(b.createdAt) - new Date(a.createdAt)
                )
                break
            case 'ocop-4':
                results.sort(
                    (a, b) =>
                        (b.ocop === 4 ? 1 : 0) - (a.ocop === 4 ? 1 : 0) ||
                        new Date(b.createdAt) - new Date(a.createdAt)
                )
                break
            default:
                break
        }

        setFilteredProducts(results)
        setProductsToShow(ITEMS_PER_LOAD)
    }, [apiResponse, sortBy])

    const productsToDisplay = filteredProducts.slice(0, productsToShow)
    const hasMoreProducts = productsToShow < filteredProducts.length

    const handleLoadMore = () =>
        setProductsToShow(prev => prev + ITEMS_PER_LOAD)

    const handleRemoveFilter = keys => {
        const updated = new URLSearchParams(searchParams)
        if (Array.isArray(keys)) keys.forEach(k => updated.delete(k))
        else updated.delete(keys)
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
            <main className="max-w-7xl mx-auto">
                <section className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold flex items-center uppercase mb-4">
                        <span className="w-1 h-6 bg-green-600 mr-2 inline-block"></span>
                        Kết quả tìm kiếm
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-md">
                        <span className="font-medium text-gray-600">
                            Bộ lọc đang áp dụng:
                        </span>
                        {category && (
                            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                                {category.replace(/-/g, ' ')}
                                <button
                                    onClick={() =>
                                        handleRemoveFilter('category')
                                    }
                                    className="ml-2 text-green-600 hover:text-green-900 transition"
                                >
                                    &times;
                                </button>
                            </span>
                        )}
                        {minPrice !== null && maxPrice !== null && (
                            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                                Giá: {formatCurrency(minPrice)} -{' '}
                                {formatCurrency(maxPrice)}
                                <button
                                    onClick={() =>
                                        handleRemoveFilter([
                                            'minPrice',
                                            'maxPrice',
                                        ])
                                    }
                                    className="ml-2 text-green-600 hover:text-green-900 transition"
                                >
                                    &times;
                                </button>
                            </span>
                        )}
                        <span className="text-gray-500 ml-auto font-semibold">
                            Tìm thấy {filteredProducts.length} sản phẩm
                        </span>
                    </div>
                </section>

                <SortBar sortBy={sortBy} onSortChange={handleSortChange} />

                <section>
                    {productsToDisplay.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                {}
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
                                        Xem thêm sản phẩm
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 px-6 bg-white">
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
