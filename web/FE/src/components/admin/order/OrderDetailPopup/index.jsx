import React from 'react'
import {
    FiX,
    FiUser,
    FiShoppingCart,
    FiCreditCard,
    FiInfo,
    FiMessageSquare,
} from 'react-icons/fi'
import { formatCurrency } from '~/utils/formatCurrency'
import { formatDateTime } from '~/utils/formatDateTime'

const getShipmentProviderName = providerId => {
    const providers = {
        ghn: 'Giao Hàng Nhanh',
        ghtk: 'Giao Hàng Tiết Kiệm',
        viettel_post: 'Viettel Post',
    }
    return providers[providerId] || 'Không xác định'
}

const getPaymentMethodName = paymentId => {
    const methods = {
        cod: 'Thanh toán khi nhận hàng (COD)',
        momo: 'Ví điện tử Momo',
        credit_card: 'Thẻ tín dụng/ghi nợ',
    }
    return methods[paymentId] || 'Không xác định'
}

const StatusBadge = ({ status }) => {
    const styles = {
        completed: 'bg-green-100 text-green-800',
        confirmed: 'bg-blue-100 text-blue-800',
        pending: 'bg-yellow-100 text-yellow-800',
        canceled: 'bg-red-100 text-red-800',
        refunded: 'bg-purple-100 text-purple-800',

        delivered: 'bg-green-100 text-green-800',
        shipping: 'bg-blue-100 text-blue-800',
        preparing: 'bg-indigo-100 text-indigo-800',
        failed: 'bg-red-100 text-red-800',
    }
    const text = {
        completed: 'Hoàn thành',
        confirmed: 'Đã xác nhận',
        pending: 'Đang chờ xử lý',
        canceled: 'Đã hủy',
        refunded: 'Đã hoàn tiền',
        delivered: 'Đã giao hàng',
        shipping: 'Đang vận chuyển',
        preparing: 'Đang chuẩn bị',
        failed: 'Giao thất bại',
    }
    return (
        <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}
        >
            {text[status] || status}
        </span>
    )
}

const OrderDetailPopup = ({ order, onClose }) => {
    if (!order) return null

    const subtotal = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-gray-50 rounded-lg shadow-xl w-full max-w-3xl transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b bg-white rounded-t-lg">
                    <h2 className="text-xl font-bold text-gray-800">
                        Chi tiết đơn hàng:{' '}
                        <span className="text-indigo-600">{order.id}</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200"
                    >
                        <FiX className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <FiInfo className="mr-2 text-indigo-600" />
                            Thông tin đơn hàng
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                            <div>
                                <p className="text-gray-500">Ngày tạo:</p>
                                <p className="font-medium text-gray-800">
                                    {formatDateTime(order.created_at)}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">
                                    Cập nhật lần cuối:
                                </p>
                                <p className="font-medium text-gray-800">
                                    {formatDateTime(order.updated_at)}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">
                                    Giao thành công:
                                </p>
                                <p className="font-medium text-gray-800">
                                    {formatDateTime(order.shipped_at)}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">
                                    Trạng thái đơn hàng:
                                </p>
                                <StatusBadge status={order.status} />
                            </div>
                            <div>
                                <p className="text-gray-500">
                                    Trạng thái vận chuyển:
                                </p>
                                <StatusBadge status={order.shipment_status} />
                            </div>
                            <div>
                                <p className="text-gray-500">
                                    Đơn vị vận chuyển:
                                </p>
                                <p className="font-medium text-gray-800">
                                    {getShipmentProviderName(order.shipment_id)}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Mã vận đơn:</p>
                                <p className="font-medium text-gray-800">
                                    {order.tracking_number || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                <FiUser className="mr-2 text-indigo-600" />
                                Thông tin người nhận
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p className="font-bold text-gray-800">
                                    {order.deli_name}
                                </p>
                                <p className="text-gray-600">
                                    {order.deli_phone}
                                </p>
                                <p className="text-gray-600">{`${order.deli_address}, ${order.deli_ward}, ${order.deli_district}, ${order.deli_city}`}</p>
                                {order.message && (
                                    <div className="pt-2">
                                        <p className="flex items-center text-gray-500">
                                            <FiMessageSquare className="mr-2 w-4 h-4" />{' '}
                                            Ghi chú:
                                        </p>
                                        <p className="text-gray-700 italic pl-1">
                                            {order.message}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                <FiCreditCard className="mr-2 text-indigo-600" />
                                Thông tin thanh toán
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <p className="text-gray-500">
                                        Phương thức:
                                    </p>
                                    <p className="font-medium text-gray-800">
                                        {getPaymentMethodName(order.payment_id)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Tình trạng:</p>
                                    {order.status === 'refunded' ? (
                                        <span className="font-medium text-purple-600">
                                            Đã hoàn tiền
                                        </span>
                                    ) : (
                                        <span className="font-medium text-green-600">
                                            Đã thanh toán
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700 p-4 flex items-center">
                            <FiShoppingCart className="mr-2 text-indigo-600" />
                            Danh sách sản phẩm
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-100 text-left text-gray-600">
                                    <tr>
                                        <th className="p-3 font-semibold">
                                            Sản phẩm
                                        </th>
                                        <th className="p-3 font-semibold text-center">
                                            Số lượng
                                        </th>
                                        <th className="p-3 font-semibold text-right">
                                            Đơn giá
                                        </th>
                                        <th className="p-3 font-semibold text-right">
                                            Thành tiền
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {order.items.map(item => (
                                        <tr key={item.id}>
                                            <td className="p-3">
                                                {item.product_name}
                                            </td>
                                            <td className="p-3 text-center">
                                                {item.quantity}
                                            </td>
                                            <td className="p-3 text-right">
                                                {formatCurrency(item.price)}
                                            </td>
                                            <td className="p-3 text-right font-medium">
                                                {formatCurrency(
                                                    item.price * item.quantity
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 space-y-2 border-t">
                            <div className="flex justify-between text-gray-600">
                                <span>Tạm tính</span>
                                <span className="font-medium text-gray-800">
                                    {formatCurrency(subtotal)}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Phí vận chuyển</span>
                                <span className="font-medium text-gray-800">
                                    {formatCurrency(order.shipping_fee)}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                <span>Tổng cộng</span>
                                <span>{formatCurrency(order.amount)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 flex justify-end rounded-b-lg border-t">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailPopup
