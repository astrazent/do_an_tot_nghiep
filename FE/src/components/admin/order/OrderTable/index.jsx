import React, { useState } from 'react'
import {
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiMoreVertical,
    FiPackage,
    FiChevronRight,
} from 'react-icons/fi'

import OrderDetailPopup from '../OrderDetailPopup'
import { formatCurrency } from '~/utils/formatCurrency'

const mockOrders = [
    {
        maDonHang: '#ORD123456',
        ngayDatHang: '2025-10-17',
        nguoiNhan: 'Nguyễn Văn An',
        tongTien: 2500000,
        trangThaiDonHang: 'Hoàn thành',
        trangThaiVanChuyen: 'Đã giao hàng',
    },
    {
        maDonHang: '#ORD123457',
        ngayDatHang: '2025-10-17',
        nguoiNhan: 'Trần Thị Bình',
        tongTien: 1200000,
        trangThaiDonHang: 'Đang xử lý',
        trangThaiVanChuyen: 'Đang lấy hàng',
    },
    {
        maDonHang: '#ORD123458',
        ngayDatHang: '2025-10-16',
        nguoiNhan: 'Lê Hoàng Cường',
        tongTien: 850000,
        trangThaiDonHang: 'Đang chờ thanh toán',
        trangThaiVanChuyen: 'Chưa vận chuyển',
    },
    {
        maDonHang: '#ORD123459',
        ngayDatHang: '2025-10-15',
        nguoiNhan: 'Phạm Minh Dũng',
        tongTien: 3150000,
        trangThaiDonHang: 'Đã hủy',
        trangThaiVanChuyen: 'Đã hủy',
    },
    {
        maDonHang: '#ORD123460',
        ngayDatHang: '2025-10-14',
        nguoiNhan: 'Võ Thị Em',
        tongTien: 990000,
        trangThaiDonHang: 'Hoàn thành',
        trangThaiVanChuyen: 'Đang giao hàng',
    },
]

const mockDetailedOrder = {
    id: '#ORD123456',
    created_at: '2025-10-17T10:30:00Z',
    updated_at: '2025-10-17T11:00:00Z',
    status: 'completed',
    shipment_status: 'delivered',
    tracking_number: 'VN123456789EX',
    shipment_id: 'ghn',
    shipping_fee: 30000,
    amount: 580000,
    shipped_at: '2025-10-18T14:00:00Z',

    deli_name: 'Nguyễn Văn An',
    deli_phone: '0987654321',
    deli_address: 'Số 123, Đường ABC',
    deli_ward: 'Phường XYZ',
    deli_district: 'Quận 1',
    deli_city: 'Thành phố Hồ Chí Minh',
    message: 'Vui lòng gọi trước khi giao.',

    payment_id: 'cod',

    items: [
        {
            id: 1,
            product_name: 'Áo Thun Nam Cổ Tròn Cao Cấp',
            quantity: 2,
            price: 150000,
        },
        {
            id: 2,
            product_name: 'Quần Jean Nam Slim Fit Co Dãn',
            quantity: 1,
            price: 250000,
        },
    ],
}

const OrderStatus = ({ status }) => {
    const getStatusStyle = () => {
        switch (status) {
            case 'Hoàn thành':
                return {
                    icon: <FiCheckCircle />,
                    classes: 'bg-green-100 text-green-800',
                }
            case 'Đang xử lý':
                return {
                    icon: <FiPackage />,
                    classes: 'bg-blue-100 text-blue-800',
                }
            case 'Đang chờ thanh toán':
                return {
                    icon: <FiClock />,
                    classes: 'bg-yellow-100 text-yellow-800',
                }
            case 'Đã hủy':
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
    const { icon, classes } = getStatusStyle()
    return (
        <span
            className={`px-3 py-1 text-sm font-medium rounded-full inline-flex items-center gap-x-2 ${classes}`}
        >
            {icon}
            {status}
        </span>
    )
}

const ActionsDropdown = ({ order, onOpenDetails, onUpdateStatus }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isStatusMenuOpen, setStatusMenuOpen] = useState(false)

    const availableStatuses = [
        'Đang xử lý',
        'Đang chờ thanh toán',
        'Hoàn thành',
        'Đã hủy',
    ]

    const handleViewDetailsClick = e => {
        e.preventDefault()
        onOpenDetails()
        setIsOpen(false)
    }

    const handleUpdateStatusClick = newStatus => {
        onUpdateStatus(order.maDonHang, newStatus)
        setStatusMenuOpen(false)
        setIsOpen(false)
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <FiMoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                    <div className="py-1">
                        <a
                            href="#"
                            onClick={handleViewDetailsClick}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Xem chi tiết
                        </a>

                        <div
                            className="relative"
                            onMouseEnter={() => setStatusMenuOpen(true)}
                            onMouseLeave={() => setStatusMenuOpen(false)}
                        >
                            <button className="w-full text-left flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <span>Cập nhật trạng thái</span>
                                <FiChevronRight className="h-4 w-4" />
                            </button>

                            {isStatusMenuOpen && (
                                <div className="origin-top-right absolute right-full top-0 mt-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30 mr-1">
                                    <div className="py-1">
                                        {availableStatuses.map(status => (
                                            <a
                                                key={status}
                                                href="#"
                                                onClick={e => {
                                                    e.preventDefault()
                                                    handleUpdateStatusClick(
                                                        status
                                                    )
                                                }}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                {status}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            Hủy đơn
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}

const OrdersTable = () => {
    const [orders, setOrders] = useState(mockOrders)
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)

    const handleViewDetails = order => {
        setSelectedOrder(mockDetailedOrder)
        setIsPopupOpen(true)
    }

    const handleClosePopup = () => {
        setIsPopupOpen(false)
        setSelectedOrder(null)
    }

    const handleUpdateOrderStatus = (orderId, newStatus) => {
        const updatedOrders = orders.map(order => {
            if (order.maDonHang === orderId) {
                let newShipmentStatus = order.trangThaiVanChuyen
                if (newStatus === 'Hoàn thành')
                    newShipmentStatus = 'Đã giao hàng'
                if (newStatus === 'Đang xử lý')
                    newShipmentStatus = 'Đang lấy hàng'
                if (newStatus === 'Đã hủy') newShipmentStatus = 'Đã hủy'

                return {
                    ...order,
                    trangThaiDonHang: newStatus,
                    trangThaiVanChuyen: newShipmentStatus,
                }
            }
            return order
        })
        setOrders(updatedOrders)
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Quản lý Đơn hàng
                </h1>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-full align-middle">
                    <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-lg">
                        <div className="col-span-2">Mã đơn hàng</div>
                        <div className="col-span-2">Người nhận</div>
                        <div className="col-span-2">Ngày đặt</div>
                        <div className="col-span-2">Tổng tiền</div>
                        <div className="col-span-2">Trạng thái</div>
                        <div className="col-span-1">Vận chuyển</div>
                        <div className="col-span-1 text-center">Hành động</div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {orders.map(order => (
                            <div
                                key={order.maDonHang}
                                className="grid grid-cols-12 gap-4 px-4 py-4 items-center text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                            >
                                <div className="col-span-2 font-medium text-gray-900">
                                    {order.maDonHang}
                                </div>
                                <div className="col-span-2">
                                    {order.nguoiNhan}
                                </div>
                                <div className="col-span-2 text-gray-500">
                                    {order.ngayDatHang}
                                </div>
                                <div className="col-span-2 font-semibold">
                                    {formatCurrency(order.tongTien)}
                                </div>
                                <div className="col-span-2">
                                    <OrderStatus
                                        status={order.trangThaiDonHang}
                                    />
                                </div>
                                <div className="col-span-1 text-gray-500">
                                    {order.trangThaiVanChuyen}
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <ActionsDropdown
                                        order={order}
                                        onOpenDetails={() =>
                                            handleViewDetails(order)
                                        }
                                        onUpdateStatus={handleUpdateOrderStatus}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isPopupOpen && selectedOrder && (
                <OrderDetailPopup
                    order={selectedOrder}
                    onClose={handleClosePopup}
                />
            )}
        </div>
    )
}

export default OrdersTable
