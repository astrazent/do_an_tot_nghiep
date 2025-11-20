import React, { useEffect, useState } from 'react'
import StatCard from '../StatCard'

import {
    getOrderStats,
    getAverageProcessingTime,
    getCancelRefundRate,
    getAverageProductRating,
} from '../../../../services/admin/adminOrderService'

// ========== ICONS ==========
const ClipboardIcon = props => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-1.105 0-2 .895-2 2v11.25c0 1.105.895 2 2 2h14.25c1.105 0 2-.895 2-2V10.25a2.25 2.25 0 00-2.25-2.25H8.25z"
        />
    </svg>
)

const ClockIcon = props => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
)

const ReturnIcon = props => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-11.667-11.666l-3.182 3.182a8.25 8.25 0 000 11.667l3.182 3.182"
        />
    </svg>
)

const StarIcon = props => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
    </svg>
)

// ========== COMPONENT ==========
const DashboardStats = () => {
    const [data, setData] = useState({
        orders: null,
        processing: null,
        cancel: null,
        rating: null,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orderStats, averageProcessing, cancelRate, rating] =
                    await Promise.all([
                        getOrderStats(),
                        getAverageProcessingTime(),
                        getCancelRefundRate(),
                        getAverageProductRating(),
                    ])

                setData({
                    orders: orderStats.data,
                    processing: averageProcessing.data,
                    cancel: cancelRate.data,
                    rating: rating.data,
                })

                setLoading(false)
            } catch (error) {
                console.error('Lỗi tải dashboard:', error)
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    console.log(data)

    const formatProcessingTime = minutes => {
        if (!minutes) return '0m'
        const h = Math.floor(minutes / 60)
        const m = minutes % 60
        return `${h}h ${m}m`
    }

    if (loading) return <p>Đang tải dữ liệu...</p>

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tổng số đơn */}
            <StatCard
                title="Tổng số đơn hàng"
                value={data.orders.count}
                change={`${data.orders.percent_change > 0 ? '+' : ''}${data.orders.percent_change}%`}
                changeType={
                    data.orders.percent_change >= 0 ? 'increase' : 'decrease'
                }
                icon={ClipboardIcon}
                iconBgColor="#e8eaf6"
                iconColor="#7c4dff"
            />

            {/* Thời gian xử lý TB */}
            <StatCard
                title="Thời gian xử lý đơn TB"
                value="2h15"
                change="8.23%"
                changeType="increase"
                icon={ClockIcon}
                iconBgColor="#e0f7fa"
                iconColor="#0097a7"
            />

            {/* Tỉ lệ hủy */}
            <StatCard
                title="Tỉ lệ huỷ / trả hàng"
                value={`${data.cancel.value}%`}
                change={`${data.cancel.percent_change > 0 ? '+' : ''}${data.cancel.percent_change}%`}
                changeType={
                    data.cancel.percent_change >= 0 ? 'increase' : 'decrease'
                }
                icon={ReturnIcon}
                iconBgColor="#ffebee"
                iconColor="#f44336"
            />

            {/* Rating TB */}
            <StatCard
                title="Đánh giá TB sản phẩm"
                value={`${data.rating.value} / 5`}
                change={`${data.rating.percent_change > 0 ? '+' : ''}${data.rating.percent_change}`}
                changeType={
                    data.rating.percent_change >= 0 ? 'increase' : 'decrease'
                }
                icon={StarIcon}
                iconBgColor="#fffde7"
                iconColor="#fbc02d"
            />
        </div>
    )
}

export default DashboardStats
