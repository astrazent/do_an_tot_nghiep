import React from 'react'
import SaleThisMonth from '~/components/admin/dashboard/SaleThisMonth'
import Overview from '~/components/admin/dashboard/Overview'
import TopAgents from '~/components/admin/dashboard/TopAgents'
import IncomeCard from '~/components/admin/dashboard/IncomeCard'
import TotalRevenue from '~/components/admin/dashboard/TotalRevenue'
import History from '~/components/admin/dashboard/History'

function Dashboard() {
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột chính bên trái */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <SaleThisMonth />
                        </div>
                        <div className="md:col-span-2">
                            <Overview />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <IncomeCard />
                        </div>
                        <div>
                            <TotalRevenue />
                        </div>
                    </div>
                </div>

                {/* Cột phụ bên phải */}
                <div className="lg:col-span-1 space-y-6">
                    <TopAgents />
                    <History />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
