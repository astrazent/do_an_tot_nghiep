import React, { useState } from 'react'
import {
    FiCheckCircle,
    FiClock,
    FiTruck,
    FiList,
    FiX,
    FiShoppingBag,
} from 'react-icons/fi'
import gaUMuoi from '~/assets/image/shared/product/ga-u-muoi.png'
import gaUXiDau from '~/assets/image/shared/product/ga-u-xi-dau.jpg'

//Dữ liệu mẫu (thêm vài đơn hàng để thấy rõ việc lọc)
const orders = [
    {
        id: '1',
        product: {
            name: 'phối ren, Quần kaki Nam Lịch Lãm - D36...',
            quantity: 4,
            image: gaUMuoi,
        },
        total: '573,000 VND',
        paymentMethod: 'Tiền mặt',
        status: 'Chờ xác nhận',
        date: '13/06/2025',
        time: '01:30',
    },
    {
        id: '2',
        product: {
            name: 'COMBO ĐÔI ĐẦM MẸ VÀ BÉ MICKEY...',
            quantity: 2,
            image: gaUXiDau,
        },
        total: '304,000 VND',
        paymentMethod: 'Tiền mặt',
        status: 'Hoàn thành',
        date: '10/06/2025',
        time: '13:35',
    },
]

//Component StatusBadge không thay đổi
const StatusBadge = ({ status }) => {
    switch (status) {
        case 'Hoàn thành':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {' '}
                    <FiCheckCircle className="mr-1.5" /> {status}{' '}
                </span>
            )
        case 'Chờ xác nhận':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {' '}
                    <FiClock className="mr-1.5" /> {status}{' '}
                </span>
            )
        case 'Đang vận chuyển':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                    {' '}
                    <FiTruck className="mr-1.5" /> {status}{' '}
                </span>
            )
        default:
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {' '}
                    {status}{' '}
                </span>
            )
    }
}

//Component mới cho trạng thái rỗng
const EmptyState = () => {
    return (
        <div className="flex justify-center">
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiShoppingBag className="h-24 w-24 text-gray-300" />
                <h3 className="mt-4 text-xl font-semibold text-gray-700">
                    Bạn chưa có đơn hàng nào
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                    Tất cả đơn hàng của bạn trong mục này sẽ được hiển thị ở
                    đây.
                </p>
            </div>
        </div>
    )
}

const Purchase = () => {
    const [activeTab, setActiveTab] = useState('Tất cả')

    const tabs = ['Tất cả', 'Chờ xác nhận', 'Đang vận chuyển', 'Hoàn thành']
    const tabIcons = {
        'Tất cả': <FiList className="mr-2" />,
        'Chờ xác nhận': <FiClock className="mr-2" />,
        'Đang vận chuyển': <FiTruck className="mr-2" />,
        'Hoàn thành': <FiCheckCircle className="mr-2" />,
    }

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'Tất cả') {
            return true
        }
        return order.status === activeTab
    })

    const getCount = status => {
        if (status === 'Tất cả') return orders.length
        return orders.filter(order => order.status === status).length
    }

    return (
        <div className="bg-gray-50 min-h-screen p-8 font-sans">
            <div className="max-w-7xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Quản lý Đơn hàng
                </h1>

                <div className="flex items-center space-x-2 mb-6 border-b border-gray-200">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                                activeTab === tab
                                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                                    : 'text-gray-500 hover:text-emerald-600'
                            }`}
                        >
                            {tabIcons[tab]}
                            {tab}
                            {getCount(tab) > 0 && (
                                <span
                                    className={`ml-2 text-xs font-bold rounded-full px-2 py-0.5 ${
                                        activeTab === tab
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    {getCount(tab)}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                                >
                                    {' '}
                                    TT{' '}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                                >
                                    {' '}
                                    Sản phẩm{' '}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                                >
                                    {' '}
                                    Tổng tiền{' '}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                                >
                                    {' '}
                                    Trạng thái{' '}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                                >
                                    {' '}
                                    Ngày đặt{' '}
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    {' '}
                                    <span className="sr-only">
                                        Thao tác
                                    </span>{' '}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-16 w-16">
                                                    <img
                                                        className="h-16 w-16 rounded-md object-cover"
                                                        src={
                                                            order.product.image
                                                        }
                                                        alt={order.product.name}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div
                                                        className="text-sm font-medium text-gray-900 truncate"
                                                        style={{
                                                            maxWidth: '250px',
                                                        }}
                                                    >
                                                        {order.product.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Số lượng:{' '}
                                                        {order.product.quantity}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-semibold">
                                                {order.total}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.paymentMethod}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge
                                                status={order.status}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{order.date}</div>
                                            <div className="text-xs">
                                                {order.time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center space-x-3">
                                                {order.status ===
                                                    'Chờ xác nhận' && (
                                                    <button className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-all duration-200">
                                                        <FiX size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">
                                        <div className="flex justify-center items-center py-20">
                                            <EmptyState />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Purchase
