import React from 'react'
import BaseModal from '../BaseModal'
import { formatCurrency } from '~/utils/formatCurrency'

const ViewDiscountDetailModal = ({
    discount,
    onClose,
    products,
    selectedProductIds,
    onSelectProduct,
    onSelectAll,
    onRemoveProducts,
    isRemoving,
}) => {
    if (!discount) return null
    const isAllSelected =
        products.length > 0 && selectedProductIds.length === products.length
    const hasSelection = selectedProductIds.length > 0

    return (
        <BaseModal
            isOpen={!!discount}
            onClose={onClose}
            title={discount.name}
            saleValue={discount.value}
        >
            <div className="max-h-[500px] flex flex-col">
                <div
                    className={`
                flex justify-between items-center px-4 py-3 transition-colors duration-200
                ${hasSelection ? 'bg-red-50' : 'bg-gray-100'}
                rounded-t
                `}
                >
                    <div className="text-sm">
                        {hasSelection ? (
                            <span className="text-red-600 font-medium">
                                Đã chọn {selectedProductIds.length} sản phẩm
                            </span>
                        ) : (
                            <span className="text-gray-700 font-medium">
                                Tổng số: {products.length} sản phẩm
                            </span>
                        )}
                    </div>

                    <button
                        onClick={onRemoveProducts}
                        disabled={!hasSelection || isRemoving}
                        style={{ padding: '6px 12px' }}
                        className={`
                            text-xs font-medium rounded transition-all duration-200 flex items-center gap-2
                            ${
                                hasSelection
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200 opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-2 pointer-events-none'
                            }
                        `}
                    >
                        {isRemoving && (
                            <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></span>
                        )}
                        Xoá lựa chọn
                    </button>
                </div>
                <div className="overflow-y-auto flex-1 pb-4">
                    <table className="w-full text-left">
                        <thead className="bg-white sticky top-0 shadow-sm z-10 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="p-4 w-12">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={onSelectAll}
                                        className="cursor-pointer rounded border-gray-300 text-red-600 focus:ring-red-500"
                                    />
                                </th>
                                <th className="p-4">Sản phẩm</th>
                                <th className="p-4 text-right">Giá nhập</th>
                                <th className="p-4 text-right">Giá gốc</th>
                                <th className="p-4 text-right">Giá sau giảm</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map(p => (
                                <tr
                                    key={p.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedProductIds.includes(
                                                p.id
                                            )}
                                            onChange={() =>
                                                onSelectProduct(p.id)
                                            }
                                            className="cursor-pointer rounded border-gray-300 text-red-600 focus:ring-red-500"
                                        />
                                    </td>

                                    <td className="p-4 font-medium text-gray-900">
                                        {p.name}
                                    </td>

                                    <td className="p-4 text-right text-xs text-gray-500">
                                        {formatCurrency(p.import_price)}
                                    </td>

                                    <td className="p-4 text-right text-sm text-gray-700">
                                        {formatCurrency(p.origin_price)}
                                    </td>

                                    <td className="p-4 text-right font-bold text-green-700">
                                        {formatCurrency(p.price)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </BaseModal>
    )
}
export default ViewDiscountDetailModal
