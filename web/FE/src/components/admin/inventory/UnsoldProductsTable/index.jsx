import React, { useMemo } from 'react'
import { format } from 'date-fns'

const UnsoldProductsTable = ({
    products,
    inactiveDays,
    onIncreaseDays,
    onDecreaseDays,
}) => {
    const unsoldProducts = useMemo(() => {
        const today = new Date()
        return products.filter(product => {
            const lastSoldDate = new Date(product.lastSoldDate)
            const diffTime = Math.abs(today - lastSoldDate)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            product.daysUnsold = diffDays
            return diffDays >= inactiveDays
        })
    }, [products, inactiveDays])

    const getBadgeColor = days => {
        if (days >= inactiveDays * 2) return 'bg-red-100 text-red-800'
        if (days >= inactiveDays) return 'bg-yellow-100 text-yellow-800'
        return 'bg-green-100 text-green-800'
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full h-[810px] mx-auto">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <span>Sản phẩm không bán được trong&nbsp;</span>
                    <div className="flex items-center space-x-2 mx-1">
                        <button
                            onClick={onDecreaseDays}
                            disabled={inactiveDays <= 1}
                            className="bg-gray-200 text-gray-800 font-bold rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Giảm số ngày"
                        >
                            -
                        </button>
                        <span className="text-xl font-bold text-indigo-600 w-8 text-center select-none">
                            {inactiveDays}
                        </span>
                        <button
                            onClick={onIncreaseDays}
                            className="bg-gray-200 text-gray-800 font-bold rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-300 transition-colors"
                            aria-label="Tăng số ngày"
                        >
                            +
                        </button>
                    </div>
                    <span>&nbsp;ngày</span>
                </h2>
            </div>

            <div className="overflow-x-auto mt-10">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                                Sản phẩm
                            </th>
                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                                Tồn kho
                            </th>
                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                                Ngày bán cuối
                            </th>
                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                                Số ngày chưa bán
                            </th>
                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                                Giá
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {unsoldProducts.map(product => (
                            <tr
                                key={product.id}
                                className="border-b border-gray-200 last:border-0 hover:bg-gray-50"
                            >
                                <td className="py-4 px-4">
                                    <div className="font-semibold text-blue-600">
                                        {product.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {product.category}
                                    </div>
                                </td>
                                <td className="py-4 px-4 font-semibold text-gray-700">
                                    {product.stock.toLocaleString()}
                                </td>
                                <td className="py-4 px-4 text-gray-700">
                                    {format(
                                        new Date(product.lastSoldDate),
                                        'dd/MM/yyyy'
                                    )}
                                </td>
                                <td className="py-4 px-4">
                                    <span
                                        className={`px-3 py-1 text-sm font-semibold rounded-full ${getBadgeColor(product.daysUnsold)}`}
                                    >
                                        {product.daysUnsold} ngày
                                    </span>
                                </td>
                                <td className="py-4 px-4 font-semibold text-gray-700">
                                    {product.price.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {unsoldProducts.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        Không có sản phẩm nào không bán được trong{' '}
                        {inactiveDays} ngày qua.
                    </div>
                )}
            </div>
        </div>
    )
}

export default UnsoldProductsTable
