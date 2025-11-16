import React, { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import ProductList from '~/components/user/product/ProductList'
import SortBar from '~/components/shared/SortBar'
import { useAllCategories } from '~/hooks/user/useCategory'
// --- THAY ĐỔI 1: Cập nhật danh sách import hook ---
import {
    useInfiniteProductCollections,
    useInfiniteSearchProductsByCategory, // Import hook mới
} from '~/hooks/user/useProduct'
import { useDebounce } from '~/hooks/shared/useDebounce'
import { FaSearch } from 'react-icons/fa'

const PRODUCTS_PER_LOAD = 8

const CATEGORY_DATA = {
    sale: { title: 'Sản phẩm khuyến mãi' },
    'san-pham-ocop-3-sao': { title: 'Sản phẩm OCOP 3 Sao' },
    'san-pham-ocop-4-sao': { title: 'Sản phẩm OCOP 4 Sao' },
}

const Category = () => {
    const { slug } = useParams()
    const currentSlug = slug || 'all'

    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('newest')

    const debouncedSearch = useDebounce(search, 500)

    // ---- BẮT ĐẦU CẬP NHẬT LOGIC TRUY VẤN DỮ LIỆU ----

    // Hook 1: Lấy sản phẩm để duyệt (infinite scroll) khi KHÔNG tìm kiếm
    const {
        data: productPages,
        isLoading: isLoadingProducts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteProductCollections({
        slug: currentSlug,
        limit: PRODUCTS_PER_LOAD,
        sort: sortBy,
        enabled: !debouncedSearch, // Chỉ chạy khi không có từ khóa tìm kiếm
    })

    // --- THAY ĐỔI 2: Sử dụng hook tìm kiếm phân trang vô hạn ---
    // Hook này sẽ được kích hoạt khi `debouncedSearch` có giá trị.
    const {
        data: searchedProductPages,
        isLoading: isSearching,
        fetchNextPage: fetchNextSearchedPage,
        hasNextPage: hasNextSearchedPage,
        isFetchingNextPage: isFetchingNextSearchedPage,
    } = useInfiniteSearchProductsByCategory({
        slug: currentSlug,
        keyword: debouncedSearch,
        limit: PRODUCTS_PER_LOAD,
        enabled: !!debouncedSearch, // Chỉ chạy khi CÓ từ khóa tìm kiếm
    })

    // Hook để lấy tất cả categories (giữ nguyên)
    const { data: allCategories, isLoading: isLoadingCategories } =
        useAllCategories()

    // Lấy và làm phẳng dữ liệu từ API duyệt trang
    const productsFromApi = useMemo(
        () => productPages?.pages.flatMap(page => page.data) || [],
        [productPages]
    )

    // --- THAY ĐỔI 3: Lấy và làm phẳng dữ liệu từ API tìm kiếm ---
    const searchedProductsFromApi = useMemo(
        // Dựa trên cấu trúc hook mới, mỗi page là một mảng sản phẩm
        () => searchedProductPages?.pages.flatMap(page => page) || [],
        [searchedProductPages]
    )

    // Quyết định danh sách sản phẩm cuối cùng để hiển thị
    const finalProducts = useMemo(() => {
        if (debouncedSearch) {
            return searchedProductsFromApi
        }
        return productsFromApi
    }, [debouncedSearch, searchedProductsFromApi, productsFromApi])

    // Cập nhật trạng thái loading tổng thể
    const isInitialLoading =
        (isLoadingProducts && !debouncedSearch) || isLoadingCategories

    // ---- KẾT THÚC CẬP NHẬT LOGIC ----

    // Logic xác định tiêu đề trang (không thay đổi)
    const title = useMemo(() => {
        if (CATEGORY_DATA[currentSlug]) {
            return CATEGORY_DATA[currentSlug].title
        }
        if (currentSlug === 'all') {
            return 'Tất cả sản phẩm'
        }
        if (allCategories) {
            const found = allCategories.find(cat => cat.slug === currentSlug)
            if (found) return found.name
        }
        return currentSlug
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ')
    }, [currentSlug, allCategories])

    // Component loading ban đầu
    if (isInitialLoading) {
        return (
            <div className="text-center my-10 p-4">
                <h2 className="text-xl font-semibold text-gray-700">
                    Đang tải dữ liệu...
                </h2>
            </div>
        )
    }

    // Component loading khi đang thực hiện tìm kiếm lần đầu
    if (isSearching && !isFetchingNextSearchedPage) {
        return (
            <div className="text-center my-10 p-4">
                <h2 className="text-xl font-semibold text-gray-700">
                    Đang tìm kiếm sản phẩm...
                </h2>
            </div>
        )
    }

    // --- THAY ĐỔI 4: Logic cho nút "Xem thêm" linh hoạt hơn ---
    const isSearchingActive = !!debouncedSearch
    const canLoadMore = isSearchingActive ? hasNextSearchedPage : hasNextPage
    const isFetchingMore = isSearchingActive
        ? isFetchingNextSearchedPage
        : isFetchingNextPage
    const loadMoreFn = isSearchingActive ? fetchNextSearchedPage : fetchNextPage

    return (
        <div className="App p-4">
            {/* Tiêu đề và thanh tìm kiếm (không thay đổi) */}
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-green-800 uppercase">
                    {title}
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

            {/* Hiển thị nút "Xem thêm" dựa trên logic đã được cập nhật */}
            {canLoadMore && (
                <div className="text-center mt-8">
                    <button
                        onClick={() => loadMoreFn()}
                        disabled={isFetchingMore}
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isFetchingMore
                            ? 'Đang tải thêm...'
                            : 'Xem thêm sản phẩm'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default Category