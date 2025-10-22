import React from 'react'
import DashboardStats from '~/components/admin/order/DashboardStats'
import OrderStatus from '~/components/admin/order/OrderStatus'
import OrderTrends from '~/components/admin/order/OrderTrends'
import OrdersTable from '~/components/admin/order/OrderTable'
const AdminOrder = () => {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <DashboardStats />
            </div>

            <div className="flex gap-4">
                <div className="flex-[7]">
                    <OrderTrends />
                </div>

                <div className="flex-[3]">
                    <OrderStatus />
                </div>
            </div>
            <div>
                <OrdersTable />
            </div>
        </div>
    )
}

export default AdminOrder
