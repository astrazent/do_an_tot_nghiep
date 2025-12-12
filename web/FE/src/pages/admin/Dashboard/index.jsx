import React from 'react'
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
function Dashboard() {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col gap-6">
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

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    <SaleThisMonth />
                </div>
                <div className="flex-[2]">
                    <Overview />
                </div>
                <div className="flex-1">
                    <TopAgent />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    <IncomeCard />
                </div>
                <div className="flex-1">
                    <TotalRevenue />
                </div>
                <div className="flex-1">
                    <OrderStatusChart />
                </div>
            </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <UserGrowthChart />
                </div>
                <div>
                    <RecentOrdersTable />
                </div>
            </div>
            <div>
                <SalesByLocationChart />
            </div>
        </div>
    )
}

export default Dashboard
