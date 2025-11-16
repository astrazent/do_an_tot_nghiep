import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import ProductCard from '~/components/shared/ProductCard'
import SortBar from '~/components/shared/SortBar'
import { useInfiniteProductCollections } from '~/hooks/user/useProduct'
import { formatCurrency } from '~/utils/formatCurrency'

const ITEMS_PER_PAGE = 8

// --- HÀM MỚI ĐỂ CHUẨN HÓA CHUỖI ---
// Chuyển chuỗi thành chữ thường và loại bỏ dấu tiếng Việt
const normalizeText = (text) => {
    if (!text) return ''
    return text
        .toLowerCase()
        .normalize('NFD') // Chuẩn hóa Unicode (NFD)
        .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các ký tự dấu
        .replace(/đ/g, 'd') // Chuyển 'đ' thành 'd'
}


const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchTerm, setSearchTerm] = useState('')

    // Lấy các tham số từ URL
    const category = searchParams.get('category') || 'all'
    const minPrice = searchParams.get('minPrice')
        ? parseInt(searchParams.get('minPrice'))
        : null
    const maxPrice = searchParams.get('maxPrice')
        ? parseInt(searchParams.get('maxPrice'))
        : null
    const sortBy = searchParams.get('sortBy') || 'newest'

    const [filteredProducts, setFilteredProducts] = useState([])

    // Truyền trực tiếp minPrice và maxPrice vào hook để API xử lý lọc
    const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
        useInfiniteProductCollections({
            slug: category,
            limit: ITEMS_PER_PAGE,
            sort: sortBy,
            minPrice: minPrice,
            maxPrice: maxPrice,
        })

    // Dữ liệu trả về từ hook đã được lọc sẵn theo giá, chỉ cần biến đổi cấu trúc
    const allProducts = useMemo(() => {
        const rawProducts = data?.pages.flatMap(page => page.data) ?? []
        return rawProducts.map(product => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            image:
                product.images && product.images.length > 0
                    ? product.images[0]
                    : '/path/to/default-image.jpg',
            price: product.price,
            oldPrice: product.origin_price,
            ocop: product.ocop_rating,
            rating:
                product.rate_count > 0
                    ? product.rate_point_total / product.rate_count
                    : 0,
            reviewCount: product.rate_count,
        }))
    }, [data])

    useEffect(() => {
        if (allProducts) {
            let results = allProducts

            // --- SỬA ĐỔI LOGIC TÌM KIẾM TẠI ĐÂY ---
            if (searchTerm) {
                // Chuẩn hóa từ khóa tìm kiếm
                const normalizedSearchTerm = normalizeText(searchTerm)
                results = allProducts.filter(product => {
                    // Chuẩn hóa tên sản phẩm trước khi so sánh
                    const normalizedProductName = normalizeText(product.name)
                    return normalizedProductName.includes(normalizedSearchTerm)
                })
            }

            setFilteredProducts(results)
        }
    }, [allProducts, searchTerm])


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
                {/* Phần JSX còn lại giữ nguyên */}
                <section className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 uppercase flex items-center">
                            <span className="w-1.5 h-6 bg-green-600 mr-2"></span>
                            Kết quả tìm kiếm
                        </h2>
                        <span className="text-sm text-gray-500 font-medium">
                            {filteredProducts.length} sản phẩm
                        </span>
                    </div>

                    <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between md:gap-x-6 gap-y-3">
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

                        {(category ||
                            (minPrice !== null && maxPrice !== null)) && (
                            <div className="flex flex-wrap justify-start gap-1 text-xs leading-normal">
                                <span className="text-gray-500 font-medium mr-1">
                                    Bộ lọc:
                                </span>

                                {category && (
                                    <span className="inline-flex items-center bg-green-50 text-green-700 border border-green-200 rounded px-1.5 py-[2px] font-medium transition hover:bg-green-100 mr-5">
                                        <span className="capitalize w-full">
                                            {category === 'all'
                                                ? 'Tất cả sản phẩm'
                                                : category.replace(/-/g, ' ')}
                                        </span>
                                        {category !== 'all' && (
                                            <button
                                                onClick={() =>
                                                    handleRemoveFilter(
                                                        'category'
                                                    )
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
                                        )}
                                    </span>
                                )}

                                {minPrice !== null && maxPrice !== null && (
                                    <span className="inline-flex items-center bg-green-50 text-green-700 border border-green-200 rounded px-1.5 py-[2px] font-medium transition hover:bg-green-100 mr-5">
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
                    {filteredProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                {filteredProducts.map(product => (
                                    <div key={product.id}>
                                        <ProductCard
                                            image={product.image}
                                            name={product.name}
                                            slug={product.slug}
                                            price={formatCurrency(
                                                product.price
                                            )}
                                            oldPrice={
                                                product.oldPrice
                                                    ? formatCurrency(
                                                        product.oldPrice
                                                    )
                                                    : null
                                            }
                                            ocop={product.ocop}
                                            rating={product.rating}
                                            reviewCount={product.reviewCount}
                                            size="small"
                                        />
                                    </div>
                                ))}
                            </div>
                            {hasNextPage && (
                                <div className="text-center mt-10">
                                    <button
                                        onClick={() => fetchNextPage()}
                                        disabled={isFetchingNextPage}
                                        className="px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300 shadow-lg disabled:bg-gray-400"
                                    >
                                        {isFetchingNextPage
                                            ? 'Đang tải...'
                                            : 'Xem thêm'}
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