import React, { useState, useMemo, useRef, useEffect } from 'react'
import { formatCurrency } from '~/utils/formatCurrency'
import { formatDateTime } from '~/utils/formatDateTime'

const productsData = [
    {
        sku: 'AT-001',
        name: 'Áo Thun Cotton Cao Cấp',
        price: 299000,
        origin_price: 180000,
        stock_qty: 150,
        low_stock_threshold: 20,
        last_restock_at: '2025-10-15T09:00:00Z',
        status: 'selling',
        created_at: '2025-01-10T10:00:00Z',
        updated_at: '2025-10-15T09:00:00Z',
        description:
            'Vải cotton 100% co giãn 4 chiều, thấm hút mồ hôi tốt. Phù hợp cho cả nam và nữ.',
        buyed: 1250,
        rate_point_total: 485,
        rate_count: 110,
    },
    {
        sku: 'QJ-002',
        name: 'Quần Jeans Slimfit Rách Gối',
        price: 750000,
        origin_price: 450000,
        stock_qty: 8,
        low_stock_threshold: 10,
        last_restock_at: '2025-09-20T14:30:00Z',
        status: 'selling',
        created_at: '2025-02-20T11:00:00Z',
        updated_at: '2025-10-12T11:20:00Z',
        description:
            'Form quần slimfit ôm dáng, chất liệu jeans denim bền màu. Chi tiết rách gối tạo điểm nhấn thời trang.',
        buyed: 820,
        rate_point_total: 390,
        rate_count: 95,
    },
    {
        sku: 'GS-003',
        name: 'Giày Sneaker Cổ Thấp',
        price: 1250000,
        origin_price: 800000,
        stock_qty: 0,
        low_stock_threshold: 10,
        last_restock_at: '2025-08-10T10:00:00Z',
        status: 'out_of_stock',
        created_at: '2025-03-15T14:20:00Z',
        updated_at: '2025-10-10T18:00:00Z',
        description:
            'Đế cao su lưu hóa, thân giày bằng vải canvas thoáng khí. Thiết kế tối giản, dễ phối đồ.',
        buyed: 2100,
        rate_point_total: 980,
        rate_count: 220,
    },
    {
        sku: 'AK-004',
        name: 'Áo Khoác Dù 2 Lớp',
        price: 550000,
        origin_price: 350000,
        stock_qty: 45,
        low_stock_threshold: 15,
        last_restock_at: '2025-10-05T08:45:00Z',
        status: 'selling',
        created_at: '2025-04-01T09:30:00Z',
        updated_at: '2025-10-05T08:45:00Z',
        description:
            'Lớp ngoài chống nước nhẹ, lớp trong lót lưới. Có nón và túi kéo khóa tiện lợi.',
        buyed: 450,
        rate_point_total: 210,
        rate_count: 50,
    },
    {
        sku: 'AT-002',
        name: 'Áo Thun Cổ Tròn (Mẫu cũ)',
        price: 199000,
        origin_price: 120000,
        stock_qty: 25,
        low_stock_threshold: 10,
        last_restock_at: '2025-07-01T16:20:00Z',
        status: 'stopped',
        created_at: '2024-05-18T12:00:00Z',
        updated_at: '2025-09-15T10:10:00Z',
        description:
            'Mẫu áo thun cơ bản, sản phẩm đã ngừng kinh doanh để tập trung cho mẫu mới.',
        buyed: 3000,
        rate_point_total: 1200,
        rate_count: 350,
    },
]

const StatusBadge = ({ status }) => {
    const statusMap = {
        selling: { text: 'Đang bán', class: 'bg-green-100 text-green-800' },
        out_of_stock: {
            text: 'Hết hàng',
            class: 'bg-yellow-100 text-yellow-800',
        },
        stopped: { text: 'Ngừng bán', class: 'bg-gray-200 text-gray-800' },
    }
    const { text, class: className } = statusMap[status] || {
        text: 'Không xác định',
        class: 'bg-gray-100 text-gray-800',
    }
    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}
        >
            {text}
        </span>
    )
}

const ActionMenu = ({ onViewDetails }) => (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
        <ul className="py-1">
            <li>
                <a
                    href="#"
                    onClick={e => {
                        e.preventDefault()
                        onViewDetails()
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    <svg
                        className="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                    Xem thêm
                </a>
            </li>
        </ul>
    </div>
)

const ProductDetailModal = ({ product, onClose }) => {
    if (!product) return null

    const averageRating =
        product.rate_count > 0
            ? (product.rate_point_total / product.rate_count).toFixed(1)
            : 'N/A'

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative animate-fade-in-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        {product.name}
                    </h2>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                </div>

                <div className="space-y-4 text-sm">
                    <div>
                        <h3 className="font-semibold text-gray-600 mb-1">
                            Mô tả sản phẩm
                        </h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                            {product.description}
                        </p>
                    </div>
                    <hr />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-600">
                                Đã bán
                            </h3>
                            <p className="text-lg font-bold text-indigo-600">
                                {new Intl.NumberFormat().format(product.buyed)}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-600">
                                Đánh giá
                            </h3>
                            <p className="text-lg font-bold text-amber-500 flex items-center">
                                {averageRating} ★
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                    ({product.rate_count} lượt)
                                </span>
                            </p>
                        </div>
                    </div>
                    <hr />
                    <div>
                        <h3 className="font-semibold text-gray-600">
                            Ngày tạo sản phẩm
                        </h3>
                        <p className="text-gray-700">
                            {formatDateTime(product.created_at)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const TransactionTable = () => {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [openMenuId, setOpenMenuId] = useState(null)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const menuRef = useRef(null)
    const itemsPerPage = 7

    const filteredProducts = useMemo(() => {
        return productsData.filter(p => {
            const matchSearch =
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.sku.toLowerCase().includes(search.toLowerCase())
            const matchStatus =
                statusFilter === 'all' || p.status === statusFilter
            return matchSearch && matchStatus
        })
    }, [search, statusFilter])

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentProducts = filteredProducts.slice(
        startIndex,
        startIndex + itemsPerPage
    )

    const handleToggleMenu = sku =>
        setOpenMenuId(openMenuId === sku ? null : sku)
    const handleViewDetails = product => {
        setSelectedProduct(product)
        setOpenMenuId(null)
    }

    useEffect(() => {
        const handleClickOutside = event => {
            if (menuRef.current && !menuRef.current.contains(event.target))
                setOpenMenuId(null)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="min-h-screen">
            <ProductDetailModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 self-start sm:self-center">
                        Quản lý Kho hàng
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm, SKU..."
                                value={search}
                                onChange={e => {
                                    setSearch(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="pl-10 pr-4 py-2 w-full sm:w-64 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <svg
                                className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <select
                            value={statusFilter}
                            onChange={e => {
                                setStatusFilter(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="w-full sm:w-auto px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="selling">Đang bán</option>
                            <option value="out_of_stock">Hết hàng</option>
                            <option value="stopped">Ngừng bán</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Sản phẩm
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Giá bán
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Giá gốc
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Tồn kho
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Ngưỡng báo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Lần nhập cuối
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Trạng thái
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Cập nhật cuối
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentProducts.length > 0 ? (
                                currentProducts.map(p => (
                                    <tr
                                        key={p.sku}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {p.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                SKU: {p.sku}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-semibold text-blue-600">
                                            {formatCurrency(p.price)}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500">
                                            <del>
                                                {formatCurrency(p.origin_price)}
                                            </del>
                                        </td>
                                        <td
                                            className={`px-4 py-4 text-sm font-bold ${p.stock_qty <= p.low_stock_threshold && p.status === 'selling' ? 'text-red-600' : 'text-gray-900'}`}
                                        >
                                            {p.stock_qty}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500">
                                            {p.low_stock_threshold}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500">
                                            {formatDateTime(p.last_restock_at)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <StatusBadge status={p.status} />
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500">
                                            {formatDateTime(p.updated_at)}
                                        </td>
                                        <td
                                            className="px-4 py-4 relative"
                                            ref={
                                                openMenuId === p.sku
                                                    ? menuRef
                                                    : null
                                            }
                                        >
                                            <button
                                                onClick={() =>
                                                    handleToggleMenu(p.sku)
                                                }
                                                className="p-1 rounded-md hover:bg-gray-100"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                </svg>
                                            </button>
                                            {openMenuId === p.sku && (
                                                <ActionMenu
                                                    onViewDetails={() =>
                                                        handleViewDetails(p)
                                                    }
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="9"
                                        className="text-center py-6 text-gray-500"
                                    >
                                        Không tìm thấy sản phẩm nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                    <p>
                        Hiển thị{' '}
                        {filteredProducts.length === 0 ? 0 : startIndex + 1}–
                        {Math.min(
                            startIndex + itemsPerPage,
                            filteredProducts.length
                        )}{' '}
                        của {filteredProducts.length} sản phẩm
                    </p>
                    {totalPages > 1 && (
                        <div className="inline-flex mt-2 sm:mt-0 -space-x-px">
                            <button
                                onClick={() =>
                                    setCurrentPage(p => Math.max(p - 1, 1))
                                }
                                disabled={currentPage === 1}
                                className="px-3 py-1 border rounded-l-md hover:bg-gray-100 disabled:opacity-50"
                            >
                                Trước
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 border ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() =>
                                    setCurrentPage(p =>
                                        Math.min(p + 1, totalPages)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border rounded-r-md hover:bg-gray-100 disabled:opacity-50"
                            >
                                Tiếp
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TransactionTable
