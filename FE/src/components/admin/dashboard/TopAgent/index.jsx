import React from 'react'
import { FaUserCircle } from 'react-icons/fa'

const agents = [
    { name: 'Minh', sales: 74 },
    { name: 'Oanh', sales: 32 },
    { name: 'Lan', sales: 15 },
    { name: 'Mai', sales: 35 },
    { name: 'Linh', sales: 158 },
    { name: 'Tuấn', sales: 95 },
]

const TopAgent = () => {
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
                {agents.map((agent, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-3">
                            <FaUserCircle className="text-gray-300" size={24} />
                            <span className="text-gray-700">{agent.name}</span>
                        </div>
                        <span className="font-semibold text-gray-800">
                            {agent.sales}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TopAgent
