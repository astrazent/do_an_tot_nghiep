import React, { useState, useMemo } from 'react'
import ProductList from '~/components/user/product/ProductList'
import SortBar from '~/components/shared/SortBar'
import { useInfinitePromotionProducts } from '~/hooks/user/useProduct'
import { FaSearch } from 'react-icons/fa'

const PRODUCTS_PER_LOAD = 8

const Promotion = () => {
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('newest')

    const {
        data: productPages,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfinitePromotionProducts({
        limit: PRODUCTS_PER_LOAD,
        sort: sortBy,
    })

    const productsFromApi = useMemo(
        () => productPages?.pages.flatMap(page => page.data) || [],
        [productPages]
    )

    const finalProducts = useMemo(() => {
        if (!search) return productsFromApi
        return productsFromApi.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [productsFromApi, search])

    if (isLoading) {
        return (
            <div className="text-center my-10 p-4">
                <h2 className="text-xl font-semibold text-gray-700">
                    Đang tải sản phẩm khuyến mãi...
                </h2>
            </div>
        )
    }

    return (
        <div className="App p-4">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-green-800 uppercase">
                    Sản phẩm khuyến mãi
                </h2>
                <div className="mt-2 w-24 h-1 bg-green-500 mx-auto"></div>
            </div>

            <div className="container mx-auto space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-1/2">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm trong danh mục..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="border border-green-500 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-1 focus:ring-green-400"
                        />
                    </div>
                    <div className="flex-shrink-0 mr-5">
                        <p className="text-md font-semibold text-gray-600">
                            Tìm thấy {finalProducts.length} sản phẩm
                        </p>
                    </div>
                </div>

                <SortBar
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    hidePromotionButton
                />
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

            {hasNextPage && !search && (
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

export default Promotion
