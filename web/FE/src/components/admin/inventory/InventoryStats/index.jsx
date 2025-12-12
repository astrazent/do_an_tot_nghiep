import React, { useEffect, useState } from 'react'
import { getInventoryDashboard } from '~/services/admin/productAdminService'

// ==== ICON COMPONENT (giữ nguyên như bạn đã đưa) ====
const BoxIcon = () => (
    <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
    </svg>
)

const CheckCircleIcon = () => (
    <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
)

const WarningIcon = () => (
    <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
    </svg>
)

const DollarIcon = () => (
    <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"
        />
    </svg>
)

const ArrowUpIcon = () => (
    <svg
        className="w-4 h-4 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
    </svg>
)

const InfoIcon = () => (
    <svg
        className="w-4 h-4 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
)

// ==== STAT CARD ====
const StatCard = ({
    icon,
    title,
    value,
    footerText,
    footerIcon,
    iconStyle,
    footerStyle,
}) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm flex-1">
            <div className="flex items-start justify-between">
                <div className="flex flex-col">
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">
                        {value}
                    </p>

                    <div
                        className={`flex items-center text-sm mt-3 ${footerStyle}`}
                    >
                        {footerIcon}
                        <span>{footerText}</span>
                    </div>
                </div>

                <div className={`p-3 rounded-xl ${iconStyle}`}>{icon}</div>
            </div>
        </div>
    )
}

// ==== MAIN COMPONENT ====
const InventoryStats = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalInStock: 0,
        lowStock: 0,
        inventoryValue: 0,
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getInventoryDashboard()
                setStats(data.data)
            } catch (error) {
                console.error('Error loading dashboard:', error)
            }
        }

        fetchData()
    }, [])

    const statsData = [
        {
            title: 'Tổng số sản phẩm',
            value: stats.totalProducts,
            icon: <BoxIcon />,
            iconStyle: 'bg-indigo-100 text-indigo-600',
            footerStyle: 'text-green-600',
        },
        {
            title: 'Tổng tồn kho',
            value: stats.totalInStock,
            icon: <CheckCircleIcon />,
            iconStyle: 'bg-green-100 text-green-600',
            footerStyle: 'text-green-600',
        },
        {
            title: 'Dưới ngưỡng báo động',
            value: stats.lowStock,
            icon: <WarningIcon />,
            iconStyle: 'bg-orange-100 text-orange-500',
            footerStyle: 'text-orange-500',
        },
        {
            title: 'Tổng giá trị kho',
            value: Number(stats.inventoryValue || 0).toLocaleString('vi', {
                style: 'currency',
                currency: 'VND',
            }),
            icon: <DollarIcon />,
            iconStyle: 'bg-cyan-100 text-cyan-600',
            footerStyle: 'text-cyan-600',
        },
    ]

    return (
        <div className="font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>
        </div>
    )
}

export default InventoryStats
