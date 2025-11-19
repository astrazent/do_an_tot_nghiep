import React, { useState } from 'react'
import dayjs from 'dayjs'
import { DatePicker } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'

// Dashboard Components
import SaleThisMonth from '~/components/admin/dashboard/SaleThisMonth'
import Overview from '~/components/admin/dashboard/Overview'
import TopAgent from '~/components/admin/dashboard/TopAgent'
import IncomeCard from '~/components/admin/dashboard/IncomeCard'
import TotalRevenue from '~/components/admin/dashboard/TotalRevenue'
import StatCard from '~/components/admin/dashboard/StatCard'
import UserGrowthChart from '~/components/admin/dashboard/UserGrowthChart'
import RecentOrdersTable from '~/components/admin/dashboard/RecentOrderTable'
import OrderStatusChart from '~/components/admin/dashboard/OrderStatusChart'
import SalesByLocationChart from '~/components/admin/dashboard/SaleByLocationChart'

const { RangePicker } = DatePicker

function Dashboard() {
    // GLOBAL DATE FILTER
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
    })

    const handleDateChange = values => {
        if (!values) return
        setDateRange({
            startDate: values[0].toDate(),
            endDate: values[1].toDate(),
        })
    }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col gap-6 p-6">
            {/* ========================== */}
            {/* ⭐ GLOBAL FILTER (ANT DESIGN) */}
            {/* ========================== */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* LEFT SIDE – GIỮ NGUYÊN */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Bộ lọc thời gian
                            </h3>
                            <p className="text-sm text-gray-500">
                                Áp dụng cho toàn bộ thống kê trên trang
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SIDE – RANGE PICKER ANTD */}
                    <RangePicker
                        format="DD/MM/YYYY"
                        className="h-[42px] w-full sm:w-80 border-gray-300 hover:border-blue-500"
                        onChange={values => {
                            if (values) {
                                setDateRange({
                                    startDate: values[0].toDate(),
                                    endDate: values[1].toDate(),
                                })
                            }
                        }}
                        presets={[
                            { label: 'Hôm nay', value: [dayjs(), dayjs()] },
                            {
                                label: 'Hôm qua',
                                value: [
                                    dayjs().subtract(1, 'day'),
                                    dayjs().subtract(1, 'day'),
                                ],
                            },
                            {
                                label: '7 ngày qua',
                                value: [dayjs().subtract(7, 'day'), dayjs()],
                            },
                            {
                                label: '30 ngày qua',
                                value: [dayjs().subtract(30, 'day'), dayjs()],
                            },
                            {
                                label: 'Tháng này',
                                value: [dayjs().startOf('month'), dayjs()],
                            },
                            {
                                label: 'Tháng trước',
                                value: [
                                    dayjs()
                                        .subtract(1, 'month')
                                        .startOf('month'),
                                    dayjs().subtract(1, 'month').endOf('month'),
                                ],
                            },
                        ]}
                    />
                </div>
            </div>

            {/* ======================= */}
            {/* 🔴 KPI KHÔNG DÙNG FILTER */}
            {/* ======================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng số sản phẩm đã bán"
                    value="5,215"
                    icon="sales"
                />
                <StatCard
                    title="Tổng số người dùng"
                    value="489"
                    icon="clients"
                />
                <StatCard title="Tổng tồn kho" value="1,248" icon="inventory" />
                <StatCard
                    title="Tổng số lượt truy cập"
                    value="15,392"
                    icon="customers"
                />
            </div>

            {/* ======================= */}
            {/* 🟢 FILTERABLE WIDGETS */}
            {/* ======================= */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    <SaleThisMonth dateRange={dateRange} />
                </div>
                <div className="flex-[2]">
                    <Overview dateRange={dateRange} />
                </div>
                <div className="flex-1">
                    <TopAgent dateRange={dateRange} />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    <IncomeCard dateRange={dateRange} />
                </div>
                <div className="flex-1">
                    <TotalRevenue dateRange={dateRange} />
                </div>
                <div className="flex-1">
                    <OrderStatusChart dateRange={dateRange} />
                </div>
            </div>

            {/* =============================== */}
            {/* 🟡 KPI THỜI GIAN CỐ ĐỊNH (NO FILTER) */}
            {/* =============================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tỉ lệ bỏ giỏ hàng"
                    value="12.5%"
                    icon="cart-abandon"
                />
                <StatCard
                    title="Tỉ lệ thoát"
                    value="45.2%"
                    icon="bounce-rate"
                />
                <StatCard
                    title="Tỉ lệ chuyển đổi"
                    value="3.1%"
                    icon="conversion-rate"
                />
                <StatCard
                    title="Tỉ lệ huỷ/trả hàng"
                    value="1.2%"
                    icon="return-rate"
                />
            </div>

            {/* ======================= */}
            {/* 🟣 USER + RECENT ORDERS */}
            {/* ======================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UserGrowthChart />
                <RecentOrdersTable />
            </div>

            {/* LOCATION */}
            <div>
                <SalesByLocationChart />
            </div>
        </div>
    )
}

export default Dashboard
