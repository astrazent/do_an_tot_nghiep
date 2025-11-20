import React, { useEffect, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { getTopCustomers } from '~/services/admin/dashboardAdminService'

const TopAgent = ({dateRange}) => {
    const [topCustomer, setTopCustomer] = useState([])
    const fetchData = async () => {
        const res = await getTopCustomers(dateRange)
        setTopCustomer(res.data)
    }

    useEffect(() => {
        fetchData()
    },[dateRange])

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Khách hàng mua nhiều nhất
            </h3>
            <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-400 font-medium">
                    <span>Tên</span>
                    <span>Số đơn</span>
                </div>
                {topCustomer.map((customer, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-3">
                            <FaUserCircle className="text-gray-300" size={24} />
                            <span className="text-gray-700">{customer.customer_name}</span>
                        </div>
                        <span className="font-semibold text-gray-800">
                            {customer.total_orders}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TopAgent
