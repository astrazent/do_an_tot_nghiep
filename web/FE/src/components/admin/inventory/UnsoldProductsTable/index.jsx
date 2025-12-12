import React from 'react'
import { format } from 'date-fns'

const UnsoldProductsTable = ({ products = [] }) => {
  const getBadgeClass = (days) => {
    if (days >= 90) return 'bg-red-100 text-red-700 border border-red-200'
    if (days >= 60) return 'bg-orange-100 text-orange-700 border border-orange-200'
    if (days >= 30) return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
    return 'bg-gray-100 text-gray-700 border border-gray-300'
  }

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'Chưa từng bán') {
      return <span className="text-red-600 font-medium">Chưa từng bán</span>
    }
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) throw new Error()
      return format(date, 'dd/MM/yyyy')
    } catch {
      const match = dateStr.toString().match(/\d{4}-\d{2}-\d{2}/)
      return match ? match[0].split('-').reverse().join('/') : dateStr
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Tiêu đề */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">
          Sản phẩm không bán được trong tháng này
          <span className="ml-3 text-sm font-normal text-gray-500">
            ({products.length} sản phẩm)
          </span>
        </h2>
      </div>

      {/* Bảng + cuộn dọc khi > 9 sản phẩm */}
      <div className="max-h-187 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
            <tr className="text-gray-600 text-xs uppercase tracking-wider">
              <th className="px-6 py-3.5 text-left font-medium">Sản phẩm</th>
              <th className="px-6 py-3.5 text-center font-medium">Tồn kho</th>
              <th className="px-6 py-3.5 text-center font-medium">Ngày bán cuối</th>
              <th className="px-6 py-3.5 text-center font-medium">Chưa bán</th>
              <th className="px-6 py-3.5 text-right font-medium pr-8">Giá bán</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-16 text-gray-500">
                  <div className="text-2xl font-medium mb-2">Tuyệt vời!</div>
                  <div className="text-base">Tất cả sản phẩm đều đã có đơn trong tháng này</div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-800">
                    {product.stock?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    {formatDate(product.lastSoldDate)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${getBadgeClass(
                        product.daysUnsold || 0
                      )}`}
                    >
                      {product.daysUnsold || 0} ngày
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right pr-8 font-medium text-gray-900">
                    {product.price?.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      minimumFractionDigits: 0,
                    }) || '0 ₫'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Thanh cuộn dọc đẹp */}
      <style jsx>{`
        /* Thanh cuộn mỏng, đẹp */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  )
}

export default UnsoldProductsTable