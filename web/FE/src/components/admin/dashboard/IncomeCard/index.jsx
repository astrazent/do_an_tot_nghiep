import React, { useEffect, useState } from 'react'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { FaMoneyBillWave } from 'react-icons/fa'
import { getFinancialData } from '~/services/admin/dashboardAdminService'

const IncomeCard = ({ dateRange }) => {
    const [FinancialData, setFinancialData] = useState({})
    const fetchData = async () => {
        const res = await getFinancialData(dateRange)
        setFinancialData(res.data[0])
    }

    useEffect(() => {
        fetchData()
    }, [dateRange])

    return (
        <div className="grid grid-cols-2 gap-6 h-full w-full">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                    <div className="bg-green-100 p-2 rounded-md">
                        <FaMoneyBillWave className="text-green-500" size={24} />
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                        <HiOutlineDotsHorizontal size={20} />
                    </button>
                </div>
                <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-800">
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            minimumFractionDigits: 0,
                        }).format(FinancialData.gross_profit)}
                    </p>
                    <p className="text-sm text-gray-500">Lợi nhuận gộp</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                    <div className="bg-blue-100 p-2 rounded-md">
                        <FaMoneyBillWave className="text-blue-500" size={24} />
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                        <HiOutlineDotsHorizontal size={20} />
                    </button>
                </div>
                <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-800">
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            minimumFractionDigits: 0,
                        }).format(FinancialData.total_cost)}
                    </p>
                    <p className="text-sm text-gray-500">Tổng chi phí</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                    <div className="bg-yellow-100 p-2 rounded-md">
                        <FaMoneyBillWave
                            className="text-yellow-500"
                            size={24}
                        />
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                        <HiOutlineDotsHorizontal size={20} />
                    </button>
                </div>
                <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-800">{FinancialData.avg_order_value}</p>
                    <p className="text-sm text-gray-500">Đơn hàng trung bình</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                    <div className="bg-purple-100 p-2 rounded-md">
                        <FaMoneyBillWave
                            className="text-purple-500"
                            size={24}
                        />
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                        <HiOutlineDotsHorizontal size={20} />
                    </button>
                </div>
                <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-800">{FinancialData.total_orders}</p>
                    <p className="text-sm text-gray-500">Đơn hàng</p>
                </div>
            </div>
        </div>
    )
}

export default IncomeCard
