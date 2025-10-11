import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import ProductCard from '~/components/shared/ProductCard'
import taiHeoUTuong from '~/assets/image/shared/product/tai-heo-u-tuong.png'
import gaUMuoi from '~/assets/image/shared/product/ga-u-muoi.png'
import SortBar from '~/components/shared/SortBar'
const allProducts = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    image: i % 2 === 0 ? taiHeoUTuong : gaUMuoi,
    name: i % 2 === 0 ? `Tai heo ủ tương #${i + 1}` : `Gà ủ muối #${i + 1}`,
    price: `${90 + i * 5}.000₫`,
    oldPrice: `${100 + i * 5}.000₫`,
    category: i % 2 === 0 ? 'san-pham-tu-heo' : 'san-pham-tu-ga',
    ocop: Math.random() > 0.5 ? 3 : 4,
    rating: Math.floor(Math.random() * 5) + 1,
    reviewCount: Math.floor(Math.random() * 100),
    salesCount: Math.floor(Math.random() * 500),
    isPromotion: Math.random() > 0.7,
}))
function useQuery() {
    return new URLSearchParams(useLocation().search)
}
const parsePrice = priceString => {
    return parseInt(String(priceString).replace(/[^0-9]/g, ''), 10)
}
const formatCurrency = value => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(value)
}

const ITEMS_PER_LOAD = 8

const SearchPage = () => {
    const query = useQuery()
    const navigate = useNavigate()
    const location = useLocation()

    const [filteredProducts, setFilteredProducts] = useState([])
    const [productsToShow, setProductsToShow] = useState(ITEMS_PER_LOAD)

    const category = query.get('category') || null
    const minPrice =
        query.get('minPrice') !== null
            ? parseInt(query.get('minPrice'), 10)
            : null
    const maxPrice =
        query.get('maxPrice') !== null
            ? parseInt(query.get('maxPrice'), 10)
            : null
    const sortBy = query.get('sortBy') || 'newest'

    useEffect(() => {
        if (!category) {
            setFilteredProducts([])
            setProductsToShow(ITEMS_PER_LOAD)
            return
        }
        let results = allProducts.filter(p => p.category === category)
        if (minPrice !== null && maxPrice !== null) {
            results = results.filter(p => {
                const price = parsePrice(p.price)
                return price >= minPrice && price <= maxPrice
            })
        }
        switch (sortBy) {
            case 'newest':
                results.sort((a, b) => b.id - a.id)
                break
            case 'promotion':
                results.sort(
                    (a, b) =>
                        (b.isPromotion ? 1 : 0) - (a.isPromotion ? 1 : 0) ||
                        b.id - a.id
                )
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
                        b.id - a.id
                )
                break
            case 'ocop-4':
                results.sort(
                    (a, b) =>
                        (b.ocop === 4 ? 1 : 0) - (a.ocop === 4 ? 1 : 0) ||
                        b.id - a.id
                )
                break
            default:
                break
        }
        setFilteredProducts(results)
        setProductsToShow(ITEMS_PER_LOAD)
    }, [location.search])

    const productsToDisplay = filteredProducts.slice(0, productsToShow)
    const hasMoreProducts = productsToShow < filteredProducts.length
    const handleLoadMore = () => {
        setProductsToShow(prev => prev + ITEMS_PER_LOAD)
    }
    const handleRemoveFilter = filterToRemove => {
        const newQuery = new URLSearchParams(location.search)
        if (Array.isArray(filterToRemove)) {
            filterToRemove.forEach(filter => newQuery.delete(filter))
        } else {
            newQuery.delete(filterToRemove)
        }
        navigate(`${location.pathname}?${newQuery.toString()}`)
    }

    const handleSortChange = newSortBy => {
        const newQuery = new URLSearchParams(location.search)
        newQuery.set('sortBy', newSortBy)
        navigate(`${location.pathname}?${newQuery.toString()}`)
    }

    return (
        <div className="min-h-screen font-sans ">
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
                                {productsToDisplay.map(product => (
                                    <Link
                                        to={`/product/${product.id}`}
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
                                Không tìm thấy sản phẩm nào
                            </h3>
                            <p className="text-gray-500 mt-2">
                                Vui lòng chọn một danh mục để bắt đầu tìm kiếm.
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
