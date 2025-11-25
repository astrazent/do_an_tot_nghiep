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

// Component để hiển thị trạng thái
const StatusBadge = ({ status }) => {
    const lowerCaseStatus = status ? status.toLowerCase() : 'default'

    const styles = {
        completed: 'bg-green-100 text-green-800',
        confirmed: 'bg-blue-100 text-blue-800',
        pending: 'bg-yellow-100 text-yellow-800',
        canceled: 'bg-red-100 text-red-800',
        refunded: 'bg-purple-100 text-purple-800',
        delivered: 'bg-green-100 text-green-800',
        shipping: 'bg-blue-100 text-blue-800',
        shipped: 'bg-indigo-100 text-indigo-800', // Dùng màu khác cho shipped để dễ phân biệt
        returned: 'bg-gray-200 text-gray-700',
        default: 'bg-gray-100 text-gray-800',
    }

    return (
        <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
                styles[lowerCaseStatus] || styles.default
            }`}
        >
            {status}
        </span>
    )
}

// Component Pop-up Chi tiết Đơn hàng
const OrderDetailPopup = ({ order, onClose }) => {
    if (!order) return null

    const subtotal = order.items
        ? order.items.reduce(
              (sum, item) =>
                  sum + Number(item.price || 0) * Number(item.quantity || 1),
              0
          )
        : 0

    return (
        // Sửa: Thẻ bao ngoài: Đảm bảo định vị cố định, bao phủ toàn màn hình, lớp phủ mờ đen (bg-black), và z-index cao.
        <div
            className="bg-opacity-70 flex justify-center items-center z-[1000]" // Tăng z-index lên rất cao (z-[1000] hoặc z-50)
            onClick={onClose}
        >
            {/* Sửa: Thẻ chứa nội dung: Đảm bảo nền là màu trắng và kích thước tối đa */}
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform scale-100" 
                onClick={e => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
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

                {/* BODY: Phần nội dung có thể cuộn */}
                <div className="p-6 space-y-6 flex-grow overflow-y-auto">
                    {/* --- ORDER INFO --- */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <FiInfo className="mr-2 text-indigo-600" />
                            Thông tin đơn hàng
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            {/* ... (Các thông tin Ngày tạo, Cập nhật, Trạng thái đơn hàng) ... */}
                            <div>
                                <p className="text-gray-500">Ngày tạo:</p>
                                <p className="mt-1 font-medium">
                                    {formatDateTime(order.created_at)}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">
                                    Cập nhật lần cuối:
                                </p>
                                <p className="mt-1 font-medium">
                                    {formatDateTime(order.updated_at)}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">
                                    Trạng thái đơn hàng:
                                </p>
                                <div className="mt-1">
                                    <StatusBadge status={order.status} />
                                </div>
                            </div>
                            {/* ... (Các thông tin Trạng thái vận chuyển, Đơn vị vận chuyển, Mã vận đơn) ... */}
                            <div>
                                <p className="text-gray-500">
                                    Trạng thái vận chuyển:
                                </p>
                                <div className="mt-1">
                                    <StatusBadge
                                        status={order.shipment_status}
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="text-gray-500">
                                    Đơn vị vận chuyển:
                                </p>
                                <p className="mt-1 font-medium">
                                    {order.shipment_name || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Mã vận đơn:</p>
                                <p className="mt-1 font-medium">
                                    {order.tracking_number || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* --- CUSTOMER + PAYMENT --- */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* CUSTOMER */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
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

                                {/* Sửa: Hiển thị địa chỉ chính xác hơn */}
                                <p className="text-gray-600">
                                    {`${order.deli_address || ''}, ${order.deli_ward || ''}, ${order.deli_district || ''}, ${order.deli_city || ''}`.replace(/,\s*$/, '')}
                                </p>

                                {order.message && (
                                    <div className="pt-2">
                                        <p className="flex items-center text-gray-500">
                                            <FiMessageSquare className="mr-2 w-4 h-4" />
                                            Ghi chú:
                                        </p>
                                        <p className="text-gray-700 italic pl-1">
                                            {order.message}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PAYMENT */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                <FiCreditCard className="mr-2 text-indigo-600" />
                                Thông tin thanh toán
                            </h3>

                            <div className="space-y-2 text-sm">
                                <div>
                                    <p className="text-gray-500">
                                        Phương thức:
                                    </p>
                                    <p className="mt-1 font-medium text-gray-800">
                                        {order.payment_method}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Tình trạng:</p>
                                    <div className="mt-1">
                                        <StatusBadge
                                            status={order.payment_status}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- PRODUCT LIST --- */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700 p-4 flex items-center">
                            <FiShoppingCart className="mr-2 text-indigo-600" />
                            Danh sách sản phẩm
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-100 text-gray-600">
                                    <tr className="border-b border-gray-100">
                                        <th className="p-3 text-left">
                                            Sản phẩm
                                        </th>
                                        <th className="p-3 text-center">
                                            Số lượng
                                        </th>
                                        <th className="p-3 text-right">
                                            Đơn giá
                                        </th>
                                        <th className="p-3 text-right">
                                            Thành tiền
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {/* Sửa: Đảm bảo order.items tồn tại và là một mảng trước khi map */}
                                    {order.items && Array.isArray(order.items) && order.items.map((item, index) => (
                                        <tr key={item.id || index}>
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
                                                    Number(item.price) *
                                                        item.quantity
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* SUMMARY */}
                        <div className="p-4 space-y-2 border-t border-gray-100">
                            <div className="flex justify-between text-gray-600">
                                <span>Tạm tính</span>
                                <span className="font-medium">
                                    {formatCurrency(subtotal)}
                                </span>
                            </div>

                            <div className="flex justify-between text-gray-600">
                                <span>Phí vận chuyển</span>
                                <span className="font-medium">
                                    {formatCurrency(Number(order.shipping_fee || 0))} 
                                </span>
                            </div>

                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                <span>Tổng cộng</span>
                                <span>
                                    {formatCurrency(
                                        // Sử dụng order.amount nếu có, hoặc tính lại.
                                        order.amount || subtotal + Number(order.shipping_fee || 0)
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                {/* Sửa: Nút 'Đóng' đặt ở góc phải dưới pop-up */}
                <div className="bg-gray-50 p-4 flex justify-end rounded-b-lg border-t border-gray-200 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailPopup