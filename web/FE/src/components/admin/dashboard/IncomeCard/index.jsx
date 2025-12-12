import React from 'react'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { FaMoneyBillWave } from 'react-icons/fa'

const IncomeCard = () => {
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
                        28.087.333đ
                    </p>
                    <p className="text-sm text-gray-500">Lợi nhuận ròng</p>
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
                        12.324.390đ
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
                    <p className="text-2xl font-bold text-gray-800">150.000đ</p>
                    <p className="text-sm text-gray-500">/đơn hàng</p>
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
                    <p className="text-2xl font-bold text-gray-800">9.875</p>
                    <p className="text-sm text-gray-500">Đơn hàng</p>
                </div>
            </div>
        </div>
    )
}

export default IncomeCard
