import { FiMoreVertical, FiEye, FiX } from 'react-icons/fi'

const DropdownMenu = ({ order, onViewDetails, onCancel }) => {
    return (
        <div
            className="absolute z-10 right-0 top-full mt-1 w-40 bg-white rounded-md shadow-lg
                ring-1 ring-black ring-opacity-5
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200 ease-in-out
                transform scale-95 group-hover:scale-100"
        >
            <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
            >
                <button
                    onClick={e => {
                        e.stopPropagation()
                        onViewDetails(order)
                    }}
                    className="w-full flex items-center px-3 py-1 !text-[14px] font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    role="menuitem"
                >
                    <FiEye className="mr-2 text-gray-500" size={12} />
                    Xem chi tiết
                </button>

                {order.status === 'Chờ xác nhận' && (
                    <button
                        onClick={e => {
                            e.stopPropagation()
                            onCancel(order)
                        }}
                        className="w-full flex items-center px-3 py-1 !text-[14px] font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        role="menuitem"
                    >
                        <FiX className="mr-2" size={12} />
                        Hủy đơn hàng
                    </button>
                )}
            </div>
        </div>
    )
}

const ActionDropdown = ({ order, onViewDetails, onCancel }) => {
    console.log('check: ', order)
    return (
        <div className="relative group flex justify-end">
            <button
                onClick={e => e.stopPropagation()}
                className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                aria-label="Tùy chọn"
            >
                <FiMoreVertical size={16} className="text-gray-600" />
            </button>

            <DropdownMenu
                order={order}
                onViewDetails={onViewDetails}
                onCancel={onCancel}
            />
        </div>
    )
}

export default ActionDropdown
