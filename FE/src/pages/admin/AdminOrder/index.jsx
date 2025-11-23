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
