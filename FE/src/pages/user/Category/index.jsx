import React, { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import ProductList from '~/components/user/product/ProductList'
import SortBar from '~/components/shared/SortBar'
import { useAllCategories } from '~/hooks/user/useCategory'
import { useInfiniteProductCollections } from '~/hooks/user/useProduct'
import { FaSearch } from 'react-icons/fa'

const PRODUCTS_PER_LOAD = 8

// Dữ liệu tĩnh cho các slug đặc biệt (giữ nguyên)
const CATEGORY_DATA = {
    sale: { title: 'Sản phẩm khuyến mãi' },
    'san-pham-ocop-3-sao': { title: 'Sản phẩm OCOP 3 Sao' },
    'san-pham-ocop-4-sao': { title: 'Sản phẩm OCOP 4 Sao' },
}

const Category = () => {
    const { slug } = useParams()
    const currentSlug = slug || 'all'

    // State cho việc tìm kiếm và sắp xếp
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('newest')

    // ---- THAY ĐỔI CHÍNH BẮT ĐẦU TỪ ĐÂY ----

    // 1. Truyền `sortBy` trực tiếp vào hook để API xử lý việc sắp xếp.
    // Khi `sortBy` thay đổi, React Query sẽ tự động fetch lại dữ liệu từ đầu
    // với tham số sắp xếp mới, đảm bảo dữ liệu luôn đúng.
    const {
        data: productPages,
        isLoading: isLoadingProducts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteProductCollections({
        slug: currentSlug,
        limit: PRODUCTS_PER_LOAD,
        sort: sortBy, // Thêm tham số sort vào đây
    })

    // Hook để lấy tất cả categories (chỉ dùng cho việc hiển thị title, không đổi)
    const { data: allCategories, isLoading: isLoadingCategories } =
        useAllCategories()

    // 2. Lấy dữ liệu sản phẩm từ API.
    // Dữ liệu này đã được sắp xếp sẵn bởi server.
    const productsFromApi = useMemo(
        () => productPages?.pages.flatMap(page => page.data) || [],
        [productPages]
    )

    // 3. Cập nhật trạng thái loading ban đầu (không đổi)
    const isInitialLoading = isLoadingProducts || isLoadingCategories

    // 4. Đơn giản hóa logic `finalProducts`.
    // Bỏ hoàn toàn khối `sort()` ở client vì API đã làm việc đó.
    // Giờ đây `useMemo` này chỉ còn nhiệm vụ lọc theo từ khóa tìm kiếm.
    const finalProducts = useMemo(() => {
        if (!search) {
            return productsFromApi // Trả về trực tiếp nếu không có tìm kiếm
        }
        // Chỉ thực hiện lọc theo `search` ở phía client
        return productsFromApi.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [productsFromApi, search]) // Bỏ `sortBy` khỏi dependency array

    // ---- KẾT THÚC THAY ĐỔI CHÍNH ----

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

    // Hiển thị component loading (không thay đổi)
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
            {/* Phần JSX cho tiêu đề và thanh tìm kiếm không thay đổi */}
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
                {/* Khi `onSortChange` được gọi, `setSortBy` sẽ cập nhật state.
                    Component re-render, `useInfiniteProductCollections` nhận `sortBy` mới
                    và tự động fetch lại dữ liệu đã được sắp xếp. */}
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

            {/* Logic nút "Xem thêm" không thay đổi, vẫn hoạt động chính xác */}
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

export default Category
