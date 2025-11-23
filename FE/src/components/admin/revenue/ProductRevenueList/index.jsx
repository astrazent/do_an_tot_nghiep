import React, { useState, useEffect } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'
import './productRevenueList.scss'
import { getProductRevenueList } from '~/services/admin/RevenueService'

const ContributionBadge = ({ rate }) => {
    const rateValue = parseFloat(rate)
    let badgeClasses = 'bg-gray-100 text-gray-800'

    if (rateValue > 30) {
        badgeClasses = 'bg-green-100 text-green-800'
    } else if (rateValue >= 15 && rateValue <= 30) {
        badgeClasses = 'bg-yellow-100 text-yellow-800'
    } else if (rateValue < 15) {
        badgeClasses = 'bg-red-100 text-red-800'
    }

    return (
        <span
            className={`inline-block w-fit px-3 py-1 text-xs font-semibold rounded-full ${badgeClasses}`}
        >
            {rate}%
        </span>
    )
}

const ProductRevenueList = ({ dateRange }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [productData, setProductData] = useState([])

    // ===== FETCH API =====
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getProductRevenueList({
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                })

                const formatted = res.data.map(item => ({
                    productName: item.product_name,
                    category: item.category_name,
                    unitsSold: Number(item.total_sold),
                    revenue: Number(item.total_revenue),
                    contributionRate: Number(item.contribution_percent).toFixed(
                        2
                    ),
                }))

                setProductData(formatted)
            } catch (error) {
                console.error('Lỗi khi load ProductRevenueList', error)
            }
        }

        fetchData()
    }, [dateRange])

    // ===== FILTER =====
    const filteredProducts = productData.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full font-sans flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Doanh thu theo sản phẩm
                </h2>

                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <HiOutlineSearch className="absolute right-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none" />
                </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
                {/* HEADER */}
                <div className="grid grid-cols-6 min-w-[700px] bg-gray-50 p-4 rounded-t-lg sticky top-0 z-10">
                    <h3 className="text-left text-xs font-bold text-gray-500 uppercase col-span-2">
                        Sản phẩm
                    </h3>
                    <h3 className="text-left text-xs font-bold text-gray-500 uppercase">
                        Danh mục
                    </h3>
                    <h3 className="text-left text-xs font-bold text-gray-500 uppercase flex justify-center">
                        Đã bán
                    </h3>
                    <h3 className="text-left text-xs font-bold text-gray-500 uppercase flex justify-center">
                        Tỷ lệ đóng góp
                    </h3>
                    <h3 className="text-left text-xs font-bold text-gray-500 uppercase flex justify-center">
                        Doanh thu
                    </h3>
                </div>

                {/* ROWS */}
                <div className="min-w-[700px] overflow-y-auto max-h-[400px] scrollbar-custom">
                    {filteredProducts.map((item, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-6 items-center p-4 border-b border-gray-200 hover:bg-gray-50"
                        >
                            <div className="col-span-2">
                                <p className="font-medium text-blue-600 cursor-pointer hover:underline">
                                    {item.productName}
                                </p>
                            </div>

                            <p className="text-sm text-gray-600">
                                {item.category}
                            </p>

                            <p className="font-semibold text-gray-800 flex justify-center">
                                {item.unitsSold.toLocaleString('vi-VN')}
                            </p>

                            <div className="flex justify-center">
                                <ContributionBadge
                                    rate={item.contributionRate}
                                />
                            </div>

                            <p className="font-semibold text-gray-800 flex justify-center">
                                {item.revenue.toLocaleString('vi-VN')} đ
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProductRevenueList
