import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { DatePicker } from 'antd'
import DashboardStats from '~/components/admin/order/DashboardStats'
import OrderStatus from '~/components/admin/order/OrderStatus'
import OrderTrends from '~/components/admin/order/OrderTrends'
import OrdersTable from '~/components/admin/order/OrderTable'

const { RangePicker } = DatePicker

const AdminOrder = () => {
    const [dateRange, setDateRange] = useState({
        startDate: dayjs().startOf('month').toDate(),
        endDate: new Date(),
    })

    return (
        <div className="flex flex-col gap-4">
            <div>
                <OrdersTable />
            </div>
        </div>
    )
}

export default AdminOrder
