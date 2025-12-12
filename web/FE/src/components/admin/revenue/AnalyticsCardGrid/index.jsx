import React from 'react'
import AnalyticsStatCard from '~/components/admin/revenue/AnalyticsStatCard'
import {
    HiOutlineCurrencyDollar,
    HiOutlineTrendingUp,
    HiOutlineChartPie,
    HiOutlineShoppingCart,
} from 'react-icons/hi'

const analyticsData = [
    {
        title: 'Lợi nhuận gộp',
        value: '$124,592.00',
        icon: <HiOutlineCurrencyDollar />,
        iconBgColor: 'bg-green-100 dark:bg-green-900/50',
        iconColor: 'text-green-600 dark:text-green-400',
        percentageChange: 12.5,
    },
    {
        title: 'Lợi nhuận ròng',
        value: '45,672',
        icon: <HiOutlineTrendingUp />,
        iconBgColor: 'bg-indigo-100 dark:bg-indigo-900/50',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        percentageChange: 8.2,
    },
    {
        title: 'Tỉ suất lợi nhuận',
        value: '3.45%',
        icon: <HiOutlineChartPie />,
        iconBgColor: 'bg-yellow-100 dark:bg-yellow-900/50',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        percentageChange: 2.1,
    },
    {
        title: 'Doanh thu bình quân/đơn hàng',
        value: '24.8%',
        icon: <HiOutlineShoppingCart />,
        iconBgColor: 'bg-red-100 dark:bg-red-900/50',
        iconColor: 'text-red-600 dark:text-red-400',
        percentageChange: -1.8,
    },
]

const AnalyticsCardGrid = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.map(card => (
                <AnalyticsStatCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    iconBgColor={card.iconBgColor}
                    iconColor={card.iconColor}
                    percentageChange={card.percentageChange}
                />
            ))}
        </div>
    )
}

export default AnalyticsCardGrid
