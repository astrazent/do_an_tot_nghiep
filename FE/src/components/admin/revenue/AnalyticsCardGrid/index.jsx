import React, { useEffect, useState } from 'react'
import AnalyticsStatCard from '~/components/admin/revenue/AnalyticsStatCard'
import {
    HiOutlineCurrencyDollar,
    HiOutlineTrendingUp,
    HiOutlineChartPie,
    HiOutlineShoppingCart,
} from 'react-icons/hi'
import { getRevenueAnalysisKPIs } from '~/services/admin/RevenueService'


const AnalyticsCardGrid = ({ dateRange }) => {
    const [kpi, setKpi] = useState(null)

    const fetchData = async () => {
        try {
            const res = await getRevenueAnalysisKPIs(dateRange)
            setKpi(res.data)
        } catch (err) {
            console.error('Lỗi lấy KPI:', err)
        }
    }

    useEffect(() => {
        fetchData()
    }, [dateRange])

    if (!kpi) return <p className="text-gray-500">Đang tải dữ liệu...</p>

    const cards = [
        {
            title: 'Lợi nhuận gộp',
            value: Number(kpi.gross_profit).toLocaleString('vi-VN') + ' đ',
            icon: <HiOutlineCurrencyDollar />,
            iconBgColor: 'bg-green-100 dark:bg-green-900/50',
            iconColor: 'text-green-600 dark:text-green-400',
        },
        {
            title: 'Tỉ suất lợi nhuận',
            value: Number(kpi.profit_margin).toFixed(2) + '%',
            icon: <HiOutlineChartPie />,
            iconBgColor: 'bg-yellow-100 dark:bg-yellow-900/50',
            iconColor: 'text-yellow-600 dark:text-yellow-400',
        },
        {
            title: 'Doanh thu bình quân/đơn hàng',
            value: Number(kpi.avg_order_revenue).toLocaleString('vi-VN') + ' đ',
            icon: <HiOutlineShoppingCart />,
            iconBgColor: 'bg-red-100 dark:bg-red-900/50',
            iconColor: 'text-red-600 dark:text-red-400',
        },
        {
            title: 'Tăng trưởng doanh thu',
            value: Number(kpi.revenue_growth_rate).toFixed(2) + '%',
            icon: <HiOutlineTrendingUp />,
            iconBgColor: 'bg-indigo-100 dark:bg-indigo-900/50',
            iconColor: 'text-indigo-600 dark:text-indigo-400',
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map(card => (
                <AnalyticsStatCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    iconBgColor={card.iconBgColor}
                    iconColor={card.iconColor}
                />
            ))}
        </div>
    )
}

export default AnalyticsCardGrid
