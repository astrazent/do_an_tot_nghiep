import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import ProductList from '~/components/user/product/ProductList'
import SortBar from '~/components/shared/SortBar'
import { useAllCategories } from '~/hooks/user/useCategory'

import {
    useSearchProductsByCategory,
    useInfiniteProductCollections,
} from '~/hooks/user/useProduct'

const PRODUCTS_PER_LOAD = 8

const CATEGORY_DATA = {
    sale: { title: 'Sản phẩm khuyến mãi' },
    'san-pham-ocop-3-sao': { title: 'Sản phẩm OCOP 3 Sao' },
    'san-pham-ocop-4-sao': { title: 'Sản phẩm OCOP 4 Sao' },
}

const parsePrice = priceString => {
    if (!priceString) return 0
    return parseInt(String(priceString).replace(/[^0-9]/g, ''), 10)
}

function ProductLists() {
    const { slug } = useParams()
    const currentSlug = slug || 'all'

    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('newest')

    const { data: categoryProducts, isLoading: isLoadingCategoryProducts } =
        useSearchProductsByCategory(
            { slug: currentSlug },
            { enabled: currentSlug !== 'all' }
        )

    const {
        data: allProductsPages,
        isLoading: isLoadingAllProducts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteProductCollections(
        { limit: PRODUCTS_PER_LOAD },
        { enabled: currentSlug === 'all' }
    )

    const { data: allCategories, isLoading: isLoadingCategories } =
        useAllCategories()

    const productsFromApi = useMemo(() => {
        if (currentSlug === 'all') {
            return allProductsPages?.pages.flatMap(page => page.data) || []
        }

        return categoryProducts?.data || []
    }, [currentSlug, allProductsPages, categoryProducts])

    const isInitialLoading =
        (currentSlug === 'all' && isLoadingAllProducts) ||
        (currentSlug !== 'all' && isLoadingCategoryProducts) ||
        isLoadingCategories

    const title = useMemo(() => {
        if (CATEGORY_DATA[currentSlug]) return CATEGORY_DATA[currentSlug].title
        if (currentSlug === 'all') return 'Tất cả sản phẩm'
        if (allCategories) {
            const found = allCategories.find(cat => cat.slug === currentSlug)
            if (found) return found.name
        }
        return currentSlug
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ')
    }, [currentSlug, allCategories])

    const finalProducts = useMemo(() => {
        let processedProducts = [...productsFromApi]

        if (search) {
            processedProducts = processedProducts.filter(product =>
                product.name.toLowerCase().includes(search.toLowerCase())
            )
        }

        processedProducts.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return parsePrice(a.price) - parsePrice(b.price)
                case 'price-desc':
                    return parsePrice(b.price) - parsePrice(a.price)
                case 'promotion':
                    return (b.oldPrice ? 1 : 0) - (a.oldPrice ? 1 : 0)
                case 'rating-desc':
                    return (b.rating || 0) - (b.rating || 0)
                case 'rating-asc':
                    return (a.rating || 0) - (b.rating || 0)
                case 'ocop-3':
                    return (b.ocop === 3 ? 1 : -1) - (a.ocop === 3 ? 1 : -1)
                case 'ocop-4':
                    return (b.ocop === 4 ? 1 : -1) - (a.ocop === 4 ? 1 : -1)
                case 'newest':
                default:
                    return new Date(b.created_at) - new Date(a.created_at)
            }
        })

        return processedProducts
    }, [productsFromApi, search, sortBy])

    if (isInitialLoading) {
        return (
            <div className="text-center my-10 p-4">
                <h2 className="text-xl font-semibold text-gray-700">
                    Đang tải dữ liệu...
                </h2>
            </div>
        )
    }

    return (
        <div className="App p-4">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-green-800 uppercase">
                    {title}
                </h2>
                <div className="mt-2 w-24 h-1 bg-green-500 mx-auto"></div>
            </div>

            <div className="container mx-auto space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <input
                        type="text"
                        placeholder="Tìm trong danh mục..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border border-green-500 rounded-full py-2 pl-10 pr-4 w-full md:w-1/2 focus:outline-none focus:ring-1 focus:ring-green-400"
                    />
                    <div className="flex-shrink-0 mr-5">
                        <p className="text-md font-semibold text-gray-600">
                            Tìm thấy {finalProducts.length} sản phẩm
                        </p>
                    </div>
                </div>
                <SortBar sortBy={sortBy} onSortChange={setSortBy} />
            </div>

            <div className="mt-8">
                {finalProducts.length > 0 ? (
                    <ProductList products={finalProducts} />
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                    </div>
                )}
            </div>

            {}
            {}
            {currentSlug === 'all' && hasNextPage && !search && (
                <div className="text-center mt-8">
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isFetchingNextPage
                            ? 'Đang tải thêm...'
                            : 'Xem thêm sản phẩm'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProductLists
