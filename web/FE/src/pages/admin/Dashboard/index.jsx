import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { DatePicker } from 'antd'

// API IMPORT
import {
    getTotalProductsSold,
    getTotalUsers,
    getTotalInventory,
    getMonthlyRevenue,
    getTopCustomers,
    getTopProduct,
    getOrderCountByStatus,
    getNewUsersByMonths,
    getReturningCustomerRate,
    getCustomerConversionRate,
    getOrderConversionRate,
    getCancelRefundRate,
} from '../../../services/admin/dashboardAdminService'

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
    // ===============================
    // GLOBAL DATE FILTER
    // ===============================
    const [dateRange, setDateRange] = useState({
        startDate: dayjs().startOf('month').toDate(),
        endDate: new Date(),
    })

    // ===============================
    // DASHBOARD DATA STATES
    // ===============================
    const [totalProductsSold, setTotalProductsSold] = useState(0)
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalInventory, setTotalInventory] = useState(0)
    const [monthlyRevenue, setMonthlyRevenue] = useState(0)
    const [returningCustomerRate, setReturningCustomerRate] = useState(0)
    const [customerConversionRate, setCustomerConversionRate] = useState(0)
    const [orderConversionRate, setOrderConversionRate] = useState(0)
    const [cancelRefundRate, setCancelRefundRate] = useState(0)

    // ===============================
    // FETCH ALL DASHBOARD DATA
    // ===============================
    const fetchDashboard = async () => {
        try {
            const payload = {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
            }

            // Gọi API
            const sold = await getTotalProductsSold(payload)
            const users = await getTotalUsers(payload)
            const inventory = await getTotalInventory()
            const revenue = await getMonthlyRevenue(payload)
            const data = await Promise.all([
                getReturningCustomerRate(payload),
                getCustomerConversionRate(payload),
                getOrderConversionRate(payload),
                getCancelRefundRate(payload),
            ])

            // Gán dữ liệu ra UI
            setTotalProductsSold(sold.data.total_sold)
            setTotalUsers(users.data.total_users)
            setTotalInventory(inventory.data.total_stock)
            setMonthlyRevenue(
                new Intl.NumberFormat('vi-VN').format(
                    revenue.data.total_revenue
                )
            )
            setReturningCustomerRate(data[0].data.returning_customer_rate)
            setCustomerConversionRate(data[1].data.returning_customer_rate)
            setOrderConversionRate(data[2].data.order_conversion_rate)
            setCancelRefundRate(data[3].data.cancel_refund_rate)
        } catch (error) {
            console.error('Lỗi tải dashboard:', error)
        }
    }

    // Fetch khi mount + khi đổi ngày
    useEffect(() => {
        fetchDashboard()
    }, [dateRange])

    // ===============================
    // RENDER
    // ===============================
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col gap-6 p-6">
            {/* ========================== */}
            {/* ⭐ GLOBAL FILTER (ANT DESIGN) */}
            {/* ========================== */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                {' '}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {' '}
                    {/* LEFT SIDE – GIỮ NGUYÊN */}{' '}
                    <div className="flex items-center gap-4">
                        {' '}
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                            {' '}
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {' '}
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />{' '}
                            </svg>{' '}
                        </div>{' '}
                        <div>
                            {' '}
                            <h3 className="text-lg font-semibold text-gray-900">
                                {' '}
                                Bộ lọc thời gian{' '}
                            </h3>{' '}
                            <p className="text-sm text-gray-500">
                                {' '}
                                Mặc định tính từ đầu tháng tới hiện tại{' '}
                            </p>{' '}
                        </div>{' '}
                    </div>{' '}
                    {/* RIGHT SIDE – RANGE PICKER ANTD */}{' '}
                    <RangePicker
                        format="DD/MM/YYYY"
                        className="h-[42px] w-full sm:w-80 border-gray-300 hover:border-blue-500"
                        onChange={values => {
                            if (values) {
                                setDateRange({
                                    startDate: values[0]
                                        .startOf('day')
                                        .format('YYYY-MM-DD HH:mm:ss'),
                                    endDate: values[1]
                                        .endOf('day')
                                        .format('YYYY-MM-DD HH:mm:ss'),
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
                    />{' '}
                </div>{' '}
            </div>

            {/* ======================= */}
            {/* 🔴 4 KPI TRÊN CÙNG */}
            {/* ======================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng số sản phẩm đã bán"
                    value={totalProductsSold}
                    icon="sales"
                />
                <StatCard
                    title="Tổng số người dùng"
                    value={totalUsers}
                    icon="clients"
                />
                <StatCard
                    title="Tổng tồn kho"
                    value={totalInventory}
                    icon="inventory"
                />
                <StatCard
                    title="Doanh thu"
                    value={monthlyRevenue + ' đ'}
                    icon="customers"
                />
            </div>

            {/* ======================= */}
            {/* 🟢 COMPONENT CÓ FILTER */}
            {/* ======================= */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* <div className="flex-1">
                    <SaleThisMonth dateRange={dateRange} />
                </div> */}
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
            {/* 🟡 KPI NO FILTER */}
            {/* =============================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tỷ lệ khách quay lại"
                    value={returningCustomerRate + '%'}
                    icon="cart-abandon"
                />
                <StatCard
                    title="Tỷ lệ chuyển đổi khách hàng"
                    value={customerConversionRate + '%'}
                    icon="customer-conversion"
                />
                <StatCard
                    title="Tỷ lệ chuyển đổi đơn hàng"
                    value={orderConversionRate + '%'}
                    icon="bounce-rate"
                />
                <StatCard
                    title="Tỉ lệ huỷ/trả hàng"
                    value={cancelRefundRate + '%'}
                    icon="return-rate"
                />
            </div>

            {/* ======================= */}
            {/* USER + RECENT ORDERS */}
            {/* ======================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UserGrowthChart />
                <RecentOrdersTable />
            </div>

            {/* LOCATION CHART */}
            <div>
                <SalesByLocationChart dateRange={dateRange}/>
            </div>
        </div>
    )
}

export default Dashboard
