import React, { useState } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'
import './productRevenueList.scss'

const productData = [
    {
        productName: 'Bánh mì đặc biệt',
        category: 'Thực phẩm khác',
        unitsSold: 12847,
        revenue: 384900000,
        contributionRate: '28.4%',
    },
    {
        productName: 'Tôm sú tươi',
        category: 'Hải sản',
        unitsSold: 9234,
        revenue: 630136000,
        contributionRate: '32.3%',
    },
    {
        productName: 'Ruốc sợi vàng',
        category: 'Ruốc',
        unitsSold: 7892,
        revenue: 475908000,
        contributionRate: '16.7%',
    },
    {
        productName: 'Gà ta thảo mộc',
        category: 'Sản phẩm từ gà',
        unitsSold: 4567,
        revenue: 36964330,
        contributionRate: '4.78%',
    },
    {
        productName: 'Hạt điều rang muối',
        category: 'Các loại hạt',
        unitsSold: 3421,
        revenue: 256575000,
        contributionRate: '8.4%',
    },
    {
        productName: 'Vịt quay Bắc Kinh',
        category: 'Sản phẩm từ vịt',
        unitsSold: 2105,
        revenue: 215750000,
        contributionRate: '11.2%',
    },
    {
        productName: 'Cá hồi phi lê',
        category: 'Sản phẩm từ cá',
        unitsSold: 6543,
        revenue: 490725000,
        contributionRate: '25.5%',
    },
    {
        productName: 'Heo sữa quay',
        category: 'Sản phẩm từ heo',
        unitsSold: 1588,
        revenue: 238200000,
        contributionRate: '41.9%',
    },
]

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
            className={`px-3 py-1 text-xs font-semibold rounded-full ${badgeClasses}`}
        >
            {rate}
        </span>
    )
}

const ProductRevenueList = () => {
    const [searchTerm, setSearchTerm] = useState('')

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

            
            <div className="overflow-x-auto">
                
                <div className="grid grid-cols-6 min-w-[700px] bg-gray-50 p-4 rounded-t-lg sticky top-0">
                    <h3 className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider col-span-2">
                        Sản phẩm
                    </h3>
                    <h3 className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Danh mục
                    </h3>
                    <h3 className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Đã bán
                    </h3>
                    <h3 className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Tỷ lệ đóng góp
                    </h3>
                    <h3 className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Doanh thu
                    </h3>
                </div>

                
                <div className="min-w-[700px] overflow-y-auto max-h-[400px] scrollbar-custom">
                    {filteredProducts.map((item, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-6 items-center p-4 border-b border-gray-200 hover:bg-gray-50"
                        >
                            <div className="col-span-2">
                                <p className="font-medium text-blue-600">
                                    {item.productName}
                                </p>
                            </div>
                            <p className="text-sm text-gray-600">
                                {item.category}
                            </p>
                            <p className="font-semibold text-gray-800">
                                {item.unitsSold.toLocaleString()}
                            </p>
                            <div>
                                <ContributionBadge
                                    rate={item.contributionRate}
                                />
                            </div>
                            <p className="font-semibold text-gray-800">
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
