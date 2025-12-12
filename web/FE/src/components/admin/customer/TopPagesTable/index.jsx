import React from 'react'

const pagesData = [
    {
        path: '/dashboard',
        title: 'Bảng điều khiển chính',
        views: '12,847',
        uniqueViews: '8,921',
        avgTime: '4m 32s',
        bounceRate: 22.1,
        conversion: '8.4%',
    },
    {
        path: '/analytics',
        title: 'Trang phân tích',
        views: '9,234',
        uniqueViews: '7,156',
        avgTime: '6m 18s',
        bounceRate: 18.7,
        conversion: '12.3%',
    },
    {
        path: '/products',
        title: 'Danh mục sản phẩm',
        views: '7,892',
        uniqueViews: '5,467',
        avgTime: '3m 45s',
        bounceRate: 45.2,
        conversion: '6.7%',
    },
    {
        path: '/checkout',
        title: 'Quy trình thanh toán',
        views: '4,567',
        uniqueViews: '3,891',
        avgTime: '2m 23s',
        bounceRate: 15.6,
        conversion: '67.8%',
    },
    {
        path: '/contact',
        title: 'Form liên hệ',
        views: '3,421',
        uniqueViews: '2,876',
        avgTime: '1m 54s',
        bounceRate: 68.4,
        conversion: '3.2%',
    },
]

const BounceRateBadge = ({ rate }) => {
    let colorClasses = ''

    if (rate < 25) {
        colorClasses = 'bg-green-100 text-green-800'
    } else if (rate >= 25 && rate < 50) {
        colorClasses = 'bg-orange-100 text-orange-800'
    } else {
        colorClasses = 'bg-red-100 text-red-800'
    }

    return (
        <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${colorClasses}`}
        >
            {rate}%
        </span>
    )
}

const TopPagesTable = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md font-sans w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Trang phổ biến nhất
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trang
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Lượt xem
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Lượt xem duy nhất
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thời gian trung bình
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tỷ lệ thoát
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tỷ lệ chuyển đổi
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {pagesData.map(page => (
                            <tr key={page.path} className="hover:bg-gray-50">
                                <td className="py-4 px-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-indigo-600">
                                        {page.path}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {page.title}
                                    </div>
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                                    {page.views}
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                                    {page.uniqueViews}
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                                    {page.avgTime}
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap">
                                    <BounceRateBadge rate={page.bounceRate} />
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                                    {page.conversion}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TopPagesTable
