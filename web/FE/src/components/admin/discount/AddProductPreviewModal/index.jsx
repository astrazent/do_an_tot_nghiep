import React from 'react'
import BaseModal from '~/components/admin/discount/BaseModal'
import { formatCurrency } from '~/utils/formatCurrency'

const calculateDiscountedPrice = (price, value) =>
    value <= 100 ? price * (1 - value / 100) : Math.max(0, price - value)

const AddProductPreviewModal = ({
    isOpen,
    data,
    onClose,
    onConfirm,
    isAdding,
}) => {
    if (!isOpen || !data?.discount) return null

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Xác nhận thêm sản phẩm"
        >
            <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                        <tr>
                            <th className="p-4">Sản phẩm</th>
                            <th className="p-4 text-right">Giá dự kiến</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.products.map(p => (
                            <tr key={p.id}>
                                <td className="p-4">{p.name}</td>
                                <td className="p-4 text-right font-bold text-red-600">
                                    {formatCurrency(
                                        calculateDiscountedPrice(
                                            p.price,
                                            data.discount.value
                                        )
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-5 bg-gray-50 flex justify-end gap-3">
                <button
                    onClick={onClose}
                    disabled={isAdding}
                    className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-white transition"
                >
                    Quay lại
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isAdding}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                >
                    {isAdding && (
                        <svg
                            className="animate-spin h-4 w-4 text-white"
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
                    )}
                    Xác nhận
                </button>
            </div>
        </BaseModal>
    )
}

export default AddProductPreviewModal
