import React from 'react'
import SalesByLocationChart from '~/components/admin/dashboard/SaleByLocationChart'
import AnalyticsCardGrid from '~/components/admin/revenue/AnalyticsCardGrid'
import RevenueAnalyticsChart from '~/components/admin/revenue/RevenueAnalyticsChart'
import RevenueByChannel from '~/components/admin/revenue/RevenueByChannel'
import UserBehaviorFlow from '~/components/admin/revenue/UserBehaviorFlow'
import ProductRevenueList from '~/components/admin/revenue/ProductRevenueList'
import PaymentPieChart from '~/components/admin/revenue/PaymentPieChart'
import ShippingRevenueChart from '~/components/admin/revenue/ShippingRevenueChart'
import PromotionRevenueCharts from '~/components/admin/revenue/PromotionRevenueCharts'
function RevenueAnalysis() {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col gap-6">
            <AnalyticsCardGrid />
            <div className="flex gap-6">
                <div className="flex-[8.7]">
                    <RevenueAnalyticsChart />
                </div>
                <div className="flex-[5]">
                    <RevenueByChannel />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <UserBehaviorFlow />
                </div>
                <div className="flex-1">
                    <ProductRevenueList />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div>
                    <PaymentPieChart />
                </div>
                <PromotionRevenueCharts />

                <div>
                    <ShippingRevenueChart />
                </div>
            </div>

            <div>
                <SalesByLocationChart />
            </div>
        </div>
    )
}

export default RevenueAnalysis
