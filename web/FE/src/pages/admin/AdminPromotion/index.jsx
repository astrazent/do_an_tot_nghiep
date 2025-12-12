import React from 'react'
import DashboardStats from '~/components/admin/promotion/DashboardStats'
import PromoUsersBarChart from '~/components/admin/promotion/PromoUserBarChart'
import PromoCodeDistribution from '~/components/admin/promotion/PromoCodeDistribution'
import CouponManager from '~/components/admin/promotion/CouponManager'
const AdminPromotion = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <DashboardStats />

            <div className="flex gap-6 mt-6">
                <div className="flex-[6]">
                    <PromoUsersBarChart />
                </div>
                <div className="flex-[4]">
                    <PromoCodeDistribution />
                </div>
            </div>

            <div className="mt-6">
                <CouponManager />
            </div>
        </div>
    )
}

export default AdminPromotion
