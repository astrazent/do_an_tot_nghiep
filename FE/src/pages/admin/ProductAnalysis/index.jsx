import React, { useState } from 'react'
import InventoryStats from '~/components/admin/inventory/InventoryStats'
import CategoryDistributionChart from '~/components/admin/inventory/CategoryDistributionChart'
import SalesPerformanceChart from '~/components/admin/inventory/SalesPerformanceChart'
import UnsoldProductsTable from '~/components/admin/inventory/UnsoldProductsTable'
import SwitchableTopList from '~/components/admin/inventory/SwitchableTopList'
import { FiBox, FiMapPin } from 'react-icons/fi'
const categoryData = [
    { name: 'Thực phẩm khác', value: 400 },
    { name: 'Hải sản', value: 300 },
    { name: 'Ruốc', value: 300 },
    { name: 'Sản phẩm từ gà', value: 200 },
    { name: 'Các loại hạt', value: 278 },
    { name: 'Sản phẩm từ vịt', value: 189 },
    { name: 'Sản phẩm từ cá', value: 239 },
    { name: 'Sản phẩm từ heo', value: 349 },
    { name: 'Sản phẩm từ ngan', value: 150 },
]

const sampleProducts = [
    {
        id: 1,
        name: 'Áo thun Cotton Basic',
        category: 'Thời trang nam',
        stock: 120,
        lastSoldDate: '2025-10-06',
        price: 250000,
    },
    {
        id: 2,
        name: 'Quần Jeans Slim-fit',
        category: 'Thời trang nam',
        stock: 80,
        lastSoldDate: '2025-10-10',
        price: 550000,
    },
    {
        id: 3,
        name: 'Sách "Nhà Giả Kim"',
        category: 'Sách văn học',
        stock: 250,
        lastSoldDate: '2025-09-20',
        price: 89000,
    },
    {
        id: 4,
        name: 'Tai nghe Bluetooth Pro',
        category: 'Phụ kiện điện tử',
        stock: 50,
        lastSoldDate: '2025-10-09',
        price: 1200000,
    },
    {
        id: 5,
        name: 'Bàn phím cơ Gaming X',
        category: 'Phụ kiện máy tính',
        stock: 30,
        lastSoldDate: '2025-08-15',
        price: 1800000,
    },
    {
        id: 6,
        name: 'Giày thể thao Runner',
        category: 'Giày dép',
        stock: 95,
        lastSoldDate: '2025-10-01',
        price: 850000,
    },
    {
        id: 7,
        name: 'Đồng hồ thông minh Watch 5',
        category: 'Thiết bị đeo',
        stock: 45,
        lastSoldDate: '2025-10-11',
        price: 3500000,
    },
]

const topListsData = [
    {
        title: 'Người dùng mua nhiều nhất',
        columnHeaders: { left: 'Tên', right: 'Số lượng' },
        items: [
            { id: 2, name: 'Lan', value: 158 },
            { id: 1, name: 'Mai', value: 74 },
            { id: 4, name: 'Hương', value: 35 },
            { id: 3, name: 'Trang', value: 32 },
            { id: 5, name: 'Nam', value: 15 },
        ],
    },
    {
        title: 'Sản phẩm bán chạy nhất',
        columnHeaders: { left: 'Sản phẩm', right: 'Số lượng bán' },
        items: [
            {
                id: 1,
                name: 'Đồng hồ thông minh',
                value: 2450,
                icon: <FiBox size={20} />,
            },
            {
                id: 2,
                name: 'Tai nghe không dây',
                value: 1892,
                icon: <FiBox size={20} />,
            },
            {
                id: 3,
                name: 'Thảm tập yoga',
                value: 986,
                icon: <FiBox size={20} />,
            },
            {
                id: 4,
                name: 'Bình nước thể thao',
                value: 753,
                icon: <FiBox size={20} />,
            },
        ],
    },
    {
        title: 'Khu vực có doanh thu cao nhất',
        columnHeaders: { left: 'Thành phố', right: 'Doanh thu' },
        items: [
            {
                id: 1,
                name: 'Hà Nội',
                value: '1.2 tỷ',
                icon: <FiMapPin size={20} />,
            },
            {
                id: 2,
                name: 'TP. Hồ Chí Minh',
                value: '950 triệu',
                icon: <FiMapPin size={20} />,
            },
            {
                id: 3,
                name: 'Đà Nẵng',
                value: '810 triệu',
                icon: <FiMapPin size={20} />,
            },
            {
                id: 4,
                name: 'Cần Thơ',
                value: '620 triệu',
                icon: <FiMapPin size={20} />,
            },
        ],
    },
]
function ProductAnalysis() {
    const [daysFilter, setDaysFilter] = useState(5)

    const handleIncreaseDays = () => {
        setDaysFilter(prevDays => prevDays + 1)
    }

    const handleDecreaseDays = () => {
        setDaysFilter(prevDays => (prevDays > 1 ? prevDays - 1 : 1))
    }
    return (
        <div className="w-full">
            <div className="bg-gray-100 min-h-screen flex flex-col gap-6">
                <InventoryStats />
                <div className="min-h-screen font-sans w-full">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 w-full">
                        <div className="flex flex-col gap-4 sm:gap-6 xl:col-span-2">
                            <div className="xl:row-span-1">
                                <SalesPerformanceChart />
                            </div>

                            <div className="xl:row-span-2">
                                <div className="overflow-auto">
                                    <UnsoldProductsTable
                                        products={sampleProducts}
                                        inactiveDays={daysFilter}
                                        onIncreaseDays={handleIncreaseDays}
                                        onDecreaseDays={handleDecreaseDays}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 sm:gap-6 xl:col-span-1">
                            <div className="xl:row-span-2">
                                <CategoryDistributionChart
                                    data={categoryData}
                                />
                            </div>

                            <div className="xl:row-span-1">
                                <SwitchableTopList listsData={topListsData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductAnalysis
