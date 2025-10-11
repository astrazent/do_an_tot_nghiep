import React from 'react'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { FaMoneyBillWave } from 'react-icons/fa' // Sử dụng icon khác phù hợp hơn

const IncomeCard = () => {
    return (
        <div className="space-y-6">
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
                        $6,458.00
                    </p>
                    <p className="text-sm text-gray-500">Total Income</p>
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
                        $4,329.00
                    </p>
                    <p className="text-sm text-gray-500">Spending Income</p>
                </div>
            </div>
        </div>
    )
}

export default IncomeCard
