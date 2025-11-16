import React from 'react'
import {
    FiX,
    FiShoppingBag,
    FiUser,
    FiCreditCard,
    FiTruck,
    FiCheckCircle,
    FiClock,
    FiBox,
} from 'react-icons/fi'
import { formatCurrency } from '~/utils/formatCurrency'
const StatusBadge = ({ status }) => {
    switch (status) {
        case 'Hoàn thành':
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                    <FiCheckCircle className="mr-1.5" size={16} /> {status}
                </span>
            )
        case 'Chờ xác nhận':
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                    <FiClock className="mr-1.5" size={16} /> {status}
                </span>
            )
        case 'Đang vận chuyển':
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-sky-100 text-sky-800">
                    <FiTruck className="mr-1.5" size={16} /> {status}
                </span>
            )
        case 'Đã hủy':
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800">
                    <FiX className="mr-1.5" size={16} /> {status}
                </span>
            )
        default:
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <FiBox className="mr-1.5" size={16} /> {status}
                </span>
            )
    }
}

const SectionTitle = ({ icon, title }) => (
    <div className="flex items-center mb-2">
        {icon}
        <h3 className="font-semibold text-gray-700 ml-2">{title}</h3>
    </div>
)

const OrderDetailModal = ({ order, onClose }) => {
    const isOpen = !!order

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    if (!isOpen) return null

    const subtotal =
        order.items?.reduce(
            (acc, item) => acc + parseFloat(item.amount_total),
            0
        ) || 0

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                {}
                <div className="flex justify-between items-start p-5 border-b rounded-t">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Chi tiết Đơn hàng #{order.tracking_number}
                        </h2>
                        <div className="text-xs text-gray-500 mt-1">
                            Ngày đặt: {order.date} lúc {order.time}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm !p-1.5 ml-auto inline-flex items-center"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {}
                <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto mb-2">
                    {}
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <span className="font-semibold text-gray-600">
                            Trạng thái:
                        </span>
                        <StatusBadge status={order.status} />
                    </div>

                    {}
                    <div className="border-t pt-4">
                        <SectionTitle
                            icon={<FiShoppingBag className="text-gray-500" />}
                            title="Sản phẩm trong đơn"
                        />
                        <div className="text-sm text-gray-600 mt-1 rounded-md space-y-2">
                            {order.items && order.items.length > 0 ? (
                                order.items.map(item => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                                    >
                                        <div>
                                            {}
                                            <p className="font-medium text-gray-800">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Số lượng: {item.qty_total}
                                            </p>
                                        </div>
                                        <span className="font-semibold text-gray-800">
                                            {formatCurrency(item.amount_total)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="p-2">
                                    Không có sản phẩm trong đơn hàng này.
                                </p>
                            )}
                        </div>
                    </div>

                    {}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t pt-4">
                        <div>
                            <SectionTitle
                                icon={<FiUser className="text-gray-500" />}
                                title="Thông tin nhận hàng"
                            />
                            <div className="text-sm text-gray-700 space-y-1 mt-1">
                                <p>
                                    <strong>Người nhận:</strong>{' '}
                                    {order.deli_name}
                                </p>
                                <p>
                                    <strong>Điện thoại:</strong>{' '}
                                    {order.deli_phone}
                                </p>
                                <p>
                                    <strong>Địa chỉ:</strong>{' '}
                                    {`${order.deli_address}, ${order.deli_ward}, ${order.deli_district}, ${order.deli_city}`}
                                </p>
                                {order.message && (
                                    <p className="mt-1 pt-1 italic">
                                        <strong>Ghi chú:</strong>{' '}
                                        {order.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <SectionTitle
                                icon={<FiTruck className="text-gray-500" />}
                                title="Thông tin vận chuyển"
                            />
                            <div className="text-sm text-gray-700 space-y-1 mt-1">
                                <p>
                                    <strong>Đơn vị:</strong>{' '}
                                    {order.shipment?.name || 'Chưa cập nhật'}
                                </p>
                                <p>
                                    <strong>Mã theo dõi:</strong> #
                                    {order.tracking_number}
                                </p>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="border-t pt-4">
                        <SectionTitle
                            icon={<FiCreditCard className="text-gray-500" />}
                            title="Thông tin thanh toán"
                        />
                        <div className="text-sm text-gray-700 space-y-1.5 mt-2">
                            <div className="flex justify-between">
                                <span>Tạm tính:</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phí vận chuyển:</span>
                                <span>
                                    {formatCurrency(order.shipping_fee)}
                                </span>
                            </div>
                            <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-gray-200 text-emerald-600">
                                <span>Tổng cộng:</span>
                                <span>{formatCurrency(order.amount)}</span>
                            </div>
                            <div className="flex justify-between text-xs mt-1 text-gray-500">
                                <span>Phương thức:</span>
                                <span>
                                    {order.payment?.method ||
                                        'Thanh toán khi nhận hàng'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailModal
