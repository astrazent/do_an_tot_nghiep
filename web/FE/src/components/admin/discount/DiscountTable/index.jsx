import React, { useState, useMemo } from 'react'
import { HiTrash, HiEye, HiChevronUp, HiChevronDown, HiSelector } from 'react-icons/hi'

const DiscountTable = ({
    discounts,
    discountRelations,
    selectedIds,
    onSelect,
    onSelectAll,
    onView,
    formatDate,
    onDeleteSelected,
    isDeleting,
}) => {
    // 1. State lưu cấu hình sort
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

    // 2. Xử lý dữ liệu: Tính toán số lượng SP trước -> Sắp xếp
    const sortedDiscounts = useMemo(() => {
        // Tạo mảng mới kèm theo thuộc tính productCount để dễ sort
        let sortableItems = discounts.map(d => {
            const productCount = discountRelations
                ? discountRelations.filter(r => r.discount_id === d.id).length
                : 0
            return { ...d, productCount }
        })

        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key]
                let bValue = b[sortConfig.key]

                // Xử lý riêng cho trường hợp chuỗi (tên) để sort không phân biệt hoa thường
                if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase()
                    bValue = bValue.toLowerCase()
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1
                }
                return 0
            })
        }
        return sortableItems
    }, [discounts, discountRelations, sortConfig])

    // Hàm xử lý khi click vào header
    const requestSort = key => {
        let direction = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    // Component nhỏ để hiển thị Icon sort
    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return <HiSelector className="text-gray-400 opacity-50" size={16} />
        }
        return sortConfig.direction === 'asc' ? (
            <HiChevronUp className="text-blue-600" size={16} />
        ) : (
            <HiChevronDown className="text-blue-600" size={16} />
        )
    }

    // Helper tạo th có khả năng sort
    const SortableHeader = ({ label, sortKey, align = 'left', className = '' }) => (
        <th
            className={`p-4 cursor-pointer hover:bg-gray-100 transition select-none ${className}`}
            onClick={() => requestSort(sortKey)}
        >
            <div
                className={`flex items-center gap-1 ${
                    align === 'center' ? 'justify-center' : 'justify-start'
                }`}
            >
                <span>{label}</span>
                <SortIcon columnKey={sortKey} />
            </div>
        </th>
    )

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 flex items-center justify-between bg-white min-h-[80px]">
                <h2 className="text-lg font-bold text-gray-900">
                    Danh sách Chương trình Khuyến mãi
                </h2>

                <div className="flex items-center gap-3">
                    {selectedIds.length > 0 && (
                        <button
                            onClick={onDeleteSelected}
                            disabled={isDeleting}
                            style={{ padding: '6px 12px' }}
                            className="flex items-center gap-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium disabled:opacity-50 text-sm"
                        >
                            {isDeleting ? (
                                <span className="animate-spin h-4 w-4 border-2 border-red-700 border-t-transparent rounded-full"></span>
                            ) : (
                                <HiTrash size={18} />
                            )}
                            <span>Xoá ({selectedIds.length})</span>
                        </button>
                    )}

                    <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium whitespace-nowrap">
                        {discounts.length} chương trình
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider">
                        <tr>
                            <th className="p-4 w-12 text-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    checked={
                                        discounts.length > 0 &&
                                        selectedIds.length === discounts.length
                                    }
                                    onChange={onSelectAll}
                                />
                            </th>
                            
                            {/* Các cột có chức năng sort */}
                            <SortableHeader label="Tên chương trình" sortKey="name" />
                            <SortableHeader label="Giá trị giảm" sortKey="value" />
                            <SortableHeader label="Số lượng SP" sortKey="productCount" align="center" />
                            <SortableHeader label="Bắt đầu" sortKey="start_date" />
                            <SortableHeader label="Trạng thái" sortKey="status" />
                            
                            <th className="p-4 text-center">Chi tiết</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {sortedDiscounts.map(d => (
                            <tr
                                key={d.id}
                                className="hover:bg-gray-50 transition"
                            >
                                <td className="p-4 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(d.id)}
                                        onChange={() => onSelect(d.id)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                </td>

                                <td className="p-4 font-medium text-gray-900">
                                    {d.name}
                                </td>

                                <td className="p-4">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-bold ${
                                            d.value <= 100
                                                ? 'bg-orange-100 text-orange-700'
                                                : 'bg-green-100 text-green-700'
                                        }`}
                                    >
                                        {d.value <= 100
                                            ? `-${d.value}%`
                                            : `-${Number(d.value).toLocaleString()}đ`}
                                    </span>
                                </td>

                                <td className="p-4 text-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            d.productCount > 0
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-400'
                                        }`}
                                    >
                                        {d.productCount}
                                    </span>
                                </td>

                                <td className="p-4 text-sm text-gray-600">
                                    <div>{formatDate(d.start_date)}</div>
                                    <div className="text-xs text-gray-400">đến {formatDate(d.end_date)}</div>
                                </td>

                                <td className="p-4">
                                    <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            d.status
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${
                                                d.status
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-500'
                                            }`}
                                        ></span>
                                        {d.status ? 'Đang chạy' : 'Tạm dừng'}
                                    </span>
                                </td>

                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => onView(d)}
                                        className="p-2 bg-white border rounded-lg text-gray-400 hover:text-blue-600 hover:border-blue-300 transition shadow-sm cursor-pointer"
                                    >
                                        <HiEye size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DiscountTable