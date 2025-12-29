import React, { useEffect, useRef } from 'react'
import { HiEye, HiSelector } from 'react-icons/hi'

const ProductTable = ({
    products,
    selectedIds,
    onSelect,
    onSelectAll,
    onSort,
    onViewDetail,
    disabledIds,
    selectableCount,
    formatCurrency,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
}) => {
    const observerRef = useRef()

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage()
                }
            },
            { threshold: 0.1 }
        )
        if (observerRef.current) observer.observe(observerRef.current)
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current)
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    if (isLoading) {
        return (
            <div className="p-8 text-center text-gray-500">
                Đang tải danh sách sản phẩm...
            </div>
        )
    }

    return (
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto relative">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th className="p-4 w-12 text-center bg-gray-50">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                onChange={onSelectAll}
                                checked={
                                    selectableCount > 0 &&
                                    selectedIds.length === selectableCount
                                }
                                disabled={selectableCount === 0}
                            />
                        </th>
                        <th
                            className="p-4 cursor-pointer hover:text-blue-600 bg-gray-50"
                            onClick={() => onSort('name')}
                        >
                            Tên Sản phẩm{' '}
                            <HiSelector className="inline h-4 w-4" />
                        </th>
                        <th
                            className="p-4 cursor-pointer hover:text-blue-600 bg-gray-50"
                            onClick={() => onSort('category_name')}
                        >
                            Danh mục <HiSelector className="inline h-4 w-4" />
                        </th>
                        <th
                            className="p-4 cursor-pointer hover:text-blue-600 bg-gray-50"
                            onClick={() => onSort('price')}
                        >
                            Giá bán <HiSelector className="inline h-4 w-4" />
                        </th>
                        <th
                            className="p-4 cursor-pointer hover:text-blue-600 bg-gray-50"
                            onClick={() => onSort('stock_qty')}
                        >
                            Tồn kho <HiSelector className="inline h-4 w-4" />
                        </th>
                        <th className="p-4 text-center bg-gray-50">Chi tiết</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {products.map(product => {
                        const isDisabled = disabledIds.includes(product.id)
                        const isSelected = selectedIds.includes(product.id)
                        return (
                            <tr
                                key={product.id}
                                className={`transition ${
                                    isDisabled
                                        ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                                        : isSelected
                                          ? 'bg-blue-50/30 hover:bg-blue-50/50'
                                          : 'hover:bg-gray-50'
                                }`}
                            >
                                <td className="p-4 text-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
                                        checked={isSelected}
                                        onChange={() => onSelect(product.id)}
                                        disabled={isDisabled}
                                    />
                                </td>
                                <td className="p-4 font-medium text-gray-900">
                                    {product.name}
                                    {isDisabled && (
                                        <span className="ml-2 text-[10px] text-red-500 font-bold border border-red-200 bg-red-50 px-1 rounded">
                                            Đã thêm
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-gray-600">
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                        {product.category_name}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600 font-mono">
                                    {formatCurrency(product.price)}
                                </td>
                                <td className="p-4 text-gray-600">
                                    {product.stock_qty}
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => onViewDetail(product)}
                                        className="p-2 bg-white border rounded-lg text-gray-400 hover:text-blue-600 hover:border-blue-300 transition shadow-sm"
                                    >
                                        <HiEye size={20} />
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                    <tr ref={observerRef} className="bg-gray-50">
                        <td
                            colSpan="6"
                            className="p-4 text-center text-sm text-gray-500"
                        >
                            {isFetchingNextPage ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5 text-blue-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Đang tải thêm sản phẩm...
                                </span>
                            ) : hasNextPage ? (
                                'Cuộn để tải thêm'
                            ) : (
                                'Đã hiển thị tất cả sản phẩm'
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ProductTable
