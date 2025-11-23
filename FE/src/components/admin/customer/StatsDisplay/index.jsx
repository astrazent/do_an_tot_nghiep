import React, { useEffect, useState } from 'react'
import StatCard from '../StatCard'
import { getDashboardSummary } from '~/services/admin/userAdminService'


const TotalUsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
)

const ActiveUsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    </svg>
)

const NewUsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M18 10h3m-1.5-1.5v3"/>
    </svg>
)

const StatsDisplay = ({ dateRange }) => {
    const [stats, setStats] = useState(null)

    useEffect(() => {
        if (!dateRange?.startDate || !dateRange?.endDate) return

        const fetchData = async () => {
            try {
                const res = await getDashboardSummary(dateRange)
                setStats(res.data)
            } catch (error) {
                console.error("Lỗi tải Dashboard Summary:", error)
            }
        }

        fetchData()
    }, [dateRange])

    if (!stats)
        return (
            <p className="text-gray-500 italic px-4">Đang tải dữ liệu dashboard...</p>
        )

    return (
        <div className="bg-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* 1. Người dùng mới */}
                <StatCard
                    title="Tổng số người dùng mới"
                    value={stats.new_users ?? 0}
                    change="+12% from last month"
                    changeType="positive"
                    icon={<TotalUsersIcon />}
                    iconBgColor="bg-indigo-100"
                />

                {/* 2. Tỉ lệ chuyển đổi */}
                <StatCard
                    title="Tỉ lệ chuyển đổi theo người dùng"
                    value={`${stats.conversion_rate ?? 0}%`}
                    change="+8% from last week"
                    changeType="positive"
                    icon={<ActiveUsersIcon />}
                    iconBgColor="bg-green-100"
                />

                {/* 3. Tỉ lệ khách mới / quay lại */}
                <StatCard
                    title="Tỉ lệ khách mới/khách quay lại"
                    value={`${stats.first_buyers ?? 0} / ${stats.returning_customers ?? 0}`}
                    change="+15% growth"
                    changeType="positive"
                    icon={<NewUsersIcon />}
                    iconBgColor="bg-cyan-100"
                />

                {/* 4. Doanh thu bình quân */}
                <StatCard
                    title="Doanh thu bình quân/khách hàng"
                    value={`${Number(stats.avg_revenue_per_customer || 0).toLocaleString('vi-VN')} đ`}
                    change="+15% growth"
                    changeType="positive"
                    icon={<NewUsersIcon />}
                    iconBgColor="bg-cyan-100"
                />
            </div>
        </div>
    )
}

export default StatsDisplay
