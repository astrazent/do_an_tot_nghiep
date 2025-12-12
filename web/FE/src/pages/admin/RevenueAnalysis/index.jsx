import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { DatePicker } from 'antd'

// COMPONENTS
import SalesByLocationChart from '~/components/admin/dashboard/SaleByLocationChart'
import AnalyticsCardGrid from '~/components/admin/revenue/AnalyticsCardGrid'
import RevenueAnalyticsChart from '~/components/admin/revenue/RevenueAnalyticsChart'
import RevenueByChannel from '~/components/admin/revenue/RevenueByChannel'
import UserBehaviorFlow from '~/components/admin/revenue/UserBehaviorFlow'
import ProductRevenueList from '~/components/admin/revenue/ProductRevenueList'
import PaymentPieChart from '~/components/admin/revenue/PaymentPieChart'
import ShippingRevenueChart from '~/components/admin/revenue/ShippingRevenueChart'
import PromotionRevenueCharts from '~/components/admin/revenue/PromotionRevenueCharts'

const { RangePicker } = DatePicker

function RevenueAnalysis() {
    // =============================
    // DEFAULT DATE RANGE (start of month → now)
    // =============================
    const [dateRange, setDateRange] = useState({
        startDate: dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    })

    useEffect(() => {
        // console.log("DateRange changed:", dateRange)
    }, [dateRange])

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col gap-6">
            
            {/* =======================
                 TIME FILTER
            ======================= */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    
                    {/* LEFT TITLE */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Bộ lọc thời gian</h3>
                            <p className="text-sm text-gray-500">Mặc định từ đầu tháng → hiện tại</p>
                        </div>
                    </div>

                    {/* RIGHT — RANGE PICKER */}
                    <RangePicker
                        format="DD/MM/YYYY"
                        className="h-[42px] w-full sm:w-80 border-gray-300 hover:border-blue-500"
                        onChange={(values) => {
                            if (values) {
                                setDateRange({
                                    startDate: values[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                                    endDate: values[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                                })
                            }
                        }}
                        presets={[
                            { label: 'Hôm nay', value: [dayjs(), dayjs()] },
                            { label: 'Hôm qua', value: [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')] },
                            { label: '7 ngày qua', value: [dayjs().subtract(7, 'day'), dayjs()] },
                            { label: '30 ngày qua', value: [dayjs().subtract(30, 'day'), dayjs()] },
                            { label: 'Tháng này', value: [dayjs().startOf('month'), dayjs()] },
                            { label: 'Tháng trước', value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')] },
                        ]}
                    />

                </div>
            </div>

            {/* =======================
                 ANALYTICS TOP CARDS
            ======================= */}
            <AnalyticsCardGrid dateRange={dateRange} />

            {/* =======================
                 REVENUE OVERVIEW
            ======================= */}
            <div className="flex gap-6">
                <div className="flex-[8.7]">
                    <RevenueAnalyticsChart dateRange={dateRange} />
                </div>
                <div className="flex-[5]">
                    <RevenueByChannel dateRange={dateRange} />
                </div>
            </div>

            {/* =======================
                 USER + PRODUCT FLOW
            ======================= */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <UserBehaviorFlow dateRange={dateRange} />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <ProductRevenueList dateRange={dateRange} />
                </div>
            </div>

            {/* =======================
                 PAYMENT / SHIPPING / PROMO
            ======================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 items-center">
                <div>
                    <PaymentPieChart dateRange={dateRange} />
                </div>

                <div>
                    <ShippingRevenueChart dateRange={dateRange} />
                </div>
            </div>

            {/* =======================
                 REVENUE BY LOCATION
            ======================= */}
            <SalesByLocationChart dateRange={dateRange} />

        </div>
    )
}

export default RevenueAnalysis
