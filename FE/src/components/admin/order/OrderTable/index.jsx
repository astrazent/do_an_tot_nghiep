// Full rewritten OrdersTable component with limit filter
import React, { useState, useEffect, useRef } from 'react'
import {
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiMoreVertical,
    FiPackage,
    FiChevronRight,
    FiChevronDown,
} from 'react-icons/fi'

import OrderDetailPopup from '../OrderDetailPopup'
import {
    getListTransaction,
    updateTransaction,
    getDetailTransaction,
} from '../../../../services/admin/adminOrderService'

import { formatCurrency } from '~/utils/formatCurrency'

/* ================================================================
    DROPDOWN TRẠNG THÁI (CUSTOM SELECT)
================================================================= */
const DropdownStatus = ({ value, onChange }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef()

    const statuses = [
        { key: '', label: 'Tất cả trạng thái' },
        { key: 'pending', label: 'pending' },
        { key: 'confirmed', label: 'confirmed' },
        { key: 'completed', label: 'completed' },
        { key: 'refunded', label: 'refunded' },
        { key: 'canceled', label: 'canceled' },
    ]

    useEffect(() => {
        const handler = e => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const label =
        statuses.find(s => s.key === value)?.label || 'Tất cả trạng thái'

    return (
        <div className="relative w-full text-sm" ref={ref}>
            <div
                onClick={() => setOpen(!open)}
                className="px-3 h-[42.6px] border bg-white rounded-lg cursor-pointer flex justify-between items-center hover:border-gray-400"
            >
                {label}
                <FiChevronDown className="text-gray-500" />
            </div>

            {open && (
                <div className="absolute w-full mt-1 bg-white shadow-lg border rounded-lg z-50 max-h-60 overflow-y-auto">
                    {statuses.map(item => (
                        <div
                            key={item.key}
                            onClick={() => {
                                onChange(item.key)
                                setOpen(false)
                            }}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${value === item.key ? 'bg-gray-100 font-medium' : ''}`}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

/* ================================================================
    STATUS BADGE
================================================================= */
const OrderStatus = ({ status }) => {
    const getStyle = () => {
        switch (status) {
            case 'completed':
                return {
                    icon: <FiCheckCircle />,
                    classes: 'bg-green-100 text-green-800',
                }
            case 'pending':
                return {
                    icon: <FiPackage />,
                    classes: 'bg-blue-100 text-blue-800',
                }
            case 'confirmed':
                return {
                    icon: <FiClock />,
                    classes: 'bg-indigo-100 text-indigo-800',
                }
            case 'refunded':
                return {
                    icon: <FiClock />,
                    classes: 'bg-purple-100 text-purple-800',
                }
            case 'canceled':
                return {
                    icon: <FiXCircle />,
                    classes: 'bg-red-100 text-red-800',
                }
            default:
                return {
                    icon: <FiClock />,
                    classes: 'bg-gray-100 text-gray-800',
                }
        }
    }

    const { icon, classes } = getStyle()

    return (
        <span
            className={`px-3 py-1 text-sm rounded-full inline-flex items-center gap-x-2 ${classes}`}
        >
            {icon}
            {status}
        </span>
    )
}

/* ================================================================
    ACTIONS DROPDOWN
================================================================= */
const ActionsDropdown = ({ order, onOpenDetails, onUpdateStatus }) => {
    const [open, setOpen] = useState(false)
    const [showStatus, setShowStatus] = useState(false)

    const statuses = [
        'pending',
        'confirmed',
        'completed',
        'refunded',
        'canceled',
    ]

    return (
        <div className="relative">
            <button
                onClick={() => {
                    setOpen(!open)
                    setShowStatus(false)
                }}
                className="p-2 rounded-md hover:bg-gray-200"
            >
                <FiMoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-30">
                    <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                        onClick={() => {
                            onOpenDetails()
                            setOpen(false)
                        }}
                    >
                        Xem chi tiết
                    </button>

                    <button
                        onClick={() => setShowStatus(!showStatus)}
                        className="w-full px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between"
                    >
                        Cập nhật trạng thái
                        <FiChevronRight />
                    </button>

                    {showStatus && (
                        <div className="absolute right-full mr-2 top-0 w-56 bg-white border rounded-lg shadow-lg z-40">
                            {statuses.map(s => (
                                <button
                                    key={s}
                                    onClick={() => {
                                        onUpdateStatus(s)
                                        setOpen(false)
                                        setShowStatus(false)
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 text-sm">
                        Hủy đơn
                    </button>
                </div>
            )}
        </div>
    )
}

/* ================================================================
    MAIN TABLE
================================================================= */
const OrdersTable = () => {
    const [orders, setOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isPopupOpen, setIsPopupOpen] = useState(false)

    // FILTERS
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')

    // LIMIT
    const [limit, setLimit] = useState(100)
    const [offset, setOffset] = useState(0)

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    /* ---------------- GET DATA ---------------- */
    useEffect(() => {
        const fetchData = async () => {
            const res = await getListTransaction({ limit, offset })
            setOrders(res.data.map(t => ({ raw: t })))
        }
        fetchData()
    }, [limit])

    /* ---------------- FILTER ---------------- */
    const filtered = orders.filter(o => {
        const t = o.raw
        const searchLower = search.toLowerCase()

        const matchSearch =
            t.tracking_number?.toLowerCase().includes(searchLower) ||
            t.deli_name?.toLowerCase().includes(searchLower)

        const matchStatus = statusFilter ? t.status === statusFilter : true

        const orderDate = t.created_at?.split('T')[0]
        const matchFrom = dateFrom ? orderDate >= dateFrom : true
        const matchTo = dateTo ? orderDate <= dateTo : true

        return matchSearch && matchStatus && matchFrom && matchTo
    })

    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const currentOrders = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const pages = () => {
        if (totalPages <= 5)
            return [...Array(totalPages).keys()].map(i => i + 1)
        if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages]
        if (currentPage >= totalPages - 2)
            return [
                1,
                '...',
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ]

        return [
            1,
            '...',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            '...',
            totalPages,
        ]
    }

    /* ---------------- DETAIL ---------------- */
    const handleViewDetails = async order => {
        const res = await getDetailTransaction(order.raw.id)
        setSelectedOrder(res.data)
        setIsPopupOpen(true)
    }

    /* ---------------- UPDATE STATUS ---------------- */
    const handleUpdateOrderStatus = async (order, newStatus) => {
        const res = await updateTransaction(order.raw.id, { status: newStatus })
        const updated = res.data

        setOrders(prev =>
            prev.map(o => (o.raw.id === updated.id ? { raw: updated } : o))
        )
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold mb-6">Quản lý Đơn hàng</h1>

            {/* FILTER BAR */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                    <label className="text-xs text-gray-500">Tìm kiếm</label>
                    <input
                        type="text"
                        placeholder="Mã đơn / Người nhận..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>

                <div>
                    <label className="text-xs text-gray-500">Trạng thái</label>
                    <DropdownStatus
                        value={statusFilter}
                        onChange={setStatusFilter}
                    />
                </div>

                <div>
                    <label className="text-xs text-gray-500">Từ ngày</label>
                    <input
                        type="date"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={dateFrom}
                        onChange={e => setDateFrom(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-xs text-gray-500">Đến ngày</label>
                    <input
                        type="date"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={dateTo}
                        onChange={e => setDateTo(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-xs text-gray-500">Số bản ghi</label>
                    <input
                        type="number"
                        min={1}
                        className="w-full px-3 py-2 border rounded-lg"
                        value={limit}
                        onChange={e => setLimit(Number(e.target.value))}
                        placeholder="Nhập số bản ghi..."
                    />
                </div>
            </div>

            {/* TABLE HEADER */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 text-xs font-semibold uppercase">
                <div className="col-span-2">Mã đơn hàng</div>
                <div className="col-span-2">Người nhận</div>
                <div className="col-span-2">Ngày đặt</div>
                <div className="col-span-2">Tổng tiền</div>
                <div className="col-span-2">Trạng thái</div>
                <div className="col-span-1">Vận chuyển</div>
                <div className="col-span-1 text-center">Hành động</div>
            </div>

            {/* TABLE ROWS */}
            <div className="divide-y divide-gray-200">
                {currentOrders.map(order => (
                    <div
                        key={order.raw.id}
                        className="grid grid-cols-12 gap-4 px-4 py-4 items-center text-sm hover:bg-gray-50"
                    >
                        <div className="col-span-2 font-medium">
                            {order.raw.tracking_number}
                        </div>
                        <div className="col-span-2">{order.raw.deli_name}</div>
                        <div className="col-span-2">
                            {order.raw.created_at?.split('T')[0]}
                        </div>
                        <div className="col-span-2">
                            {formatCurrency(Number(order.raw.amount))}
                        </div>
                        <div className="col-span-2">
                            <OrderStatus status={order.raw.status} />
                        </div>
                        <div className="col-span-1">
                            {order.raw.shipment_status}
                        </div>

                        <div className="col-span-1 flex justify-center">
                            <ActionsDropdown
                                order={order}
                                onOpenDetails={() => handleViewDetails(order)}
                                onUpdateStatus={newStatus =>
                                    handleUpdateOrderStatus(order, newStatus)
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center gap-2 mt-6">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    className="px-3 py-2 border rounded-lg hover:bg-gray-100 disabled:text-gray-400"
                >
                    «
                </button>
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="px-3 py-2 border rounded-lg hover:bg-gray-100 disabled:text-gray-400"
                >
                    ‹
                </button>

                {pages().map((p, i) =>
                    p === '...' ? (
                        <span key={i} className="px-3 py-2">
                            …
                        </span>
                    ) : (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(p)}
                            className={`px-3 py-2 border rounded-lg ${currentPage === p ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100'}`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="px-3 py-2 border rounded-lg hover:bg-gray-100 disabled:text-gray-400"
                >
                    ›
                </button>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-2 border rounded-lg hover:bg-gray-100 disabled:text-gray-400"
                >
                    »
                </button>
            </div>

            {/* POPUP DETAILS */}
            {isPopupOpen && selectedOrder && (
                <OrderDetailPopup
                    order={selectedOrder}
                    onClose={() => setIsPopupOpen(false)}
                />
            )}
        </div>
    )
}

export default OrdersTable
