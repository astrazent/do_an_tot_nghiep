import React from 'react'

import { FiTrendingUp, FiTag, FiGift, FiDollarSign } from 'react-icons/fi'

const StatCard = ({
    icon,
    title,
    value,
    change,
    status,
    iconBgColor,
    changeColor,
    statusColor,
}) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm flex-1">
            <div className="flex items-center">
                <div className={`p-3 rounded-lg ${iconBgColor}`}>{icon}</div>
                <div className="ml-4">
                    <p className="text-gray-500 text-sm">{title}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm min-h-[20px]">
                {change && (
                    <p className={`${changeColor} font-medium`}>
                        <span className="font-semibold">↑</span> {change}
                    </p>
                )}
                {status && <p className={`${statusColor}`}>{status}</p>}
            </div>
        </div>
    )
}

const DashboardStats = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                icon={<FiTrendingUp className="text-green-600" size={24} />}
                title="Tỉ lệ chuyển đổi / truy cập"
                value="5.75%"
                change="+1.2% so với tháng trước"
                iconBgColor="bg-green-100"
                changeColor="text-green-600"
            />
            <StatCard
                icon={<FiTag className="text-blue-600" size={24} />}
                title="Tỉ lệ CĐ trước & sau KM"
                value="8.2% (Sau KM)"
                change="+3.7% so với trước KM"
                iconBgColor="bg-blue-100"
                changeColor="text-green-600"
            />
            <StatCard
                icon={<FiGift className="text-indigo-600" size={24} />}
                title="Mã được dùng nhiều nhất"
                value="SALE50"
                status="1,245 lượt sử dụng"
                iconBgColor="bg-indigo-100"
                statusColor="text-gray-500"
            />
            <StatCard
                icon={<FiDollarSign className="text-orange-600" size={24} />}
                title="Doanh thu từ khuyến mãi"
                value="15.200.000₫"
                change="Chiếm 25% tổng doanh thu"
                iconBgColor="bg-orange-100"
                changeColor="text-orange-600"
            />
        </div>
    )
}

export default DashboardStats
