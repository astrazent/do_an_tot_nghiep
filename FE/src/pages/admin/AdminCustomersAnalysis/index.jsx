import React from 'react'
import UserBehaviorFlowChart from '~/components/admin/customer/UserBehaviorFlowChart'
import StatsDisplay from '~/components/admin/customer/StatsDisplay'
import DashboardCharts from '~/components/admin/customer/DashboardCharts'
import RealtimeActivity from '~/components/admin/customer/RealTimeActivity'
import TopPagesTable from '~/components/admin/customer/TopPagesTable'
import DeviceAnalytics from '~/components/admin/revenue/DeviceAnalytics'
function AdminCustomersAnalysis() {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col gap-6">
            <StatsDisplay />
            <DashboardCharts />

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <UserBehaviorFlowChart />
                </div>
                <div className="flex-1">
                    <RealtimeActivity />
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="basis-[70%]">
                    <TopPagesTable />
                </div>
                <div className="basis-[30%]">
                    <DeviceAnalytics />
                </div>
            </div>
        </div>
    )
}

export default AdminCustomersAnalysis
