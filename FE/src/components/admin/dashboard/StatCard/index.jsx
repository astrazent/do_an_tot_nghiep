import React from 'react'
import { FiTrendingUp, FiUsers, FiDollarSign } from 'react-icons/fi' // Ví dụ icons

const StatCard = ({ title, value, icon }) => {
    const renderIcon = () => {
        switch (icon) {
            case 'dollar-green':
                return (
                    <div className="p-3 bg-green-100 rounded-lg">
                        <FiDollarSign className="text-green-500" size={24} />
                    </div>
                )
            case 'dollar-blue':
                return (
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <FiDollarSign className="text-blue-500" size={24} />
                    </div>
                )
            case 'sales':
                return (
                    <div className="p-3 bg-indigo-100 rounded-lg">
                        <FiTrendingUp className="text-indigo-500" size={24} />
                    </div>
                )
            case 'clients':
                return (
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <FiUsers className="text-blue-500" size={24} />
                    </div>
                )
            case 'revenue':
                return (
                    <div className="p-3 bg-yellow-100 rounded-lg">
                        <FiDollarSign className="text-yellow-500" size={24} />
                    </div>
                )
            case 'customers':
                return (
                    <div className="p-3 bg-red-100 rounded-lg">
                        <FiUsers className="text-red-500" size={24} />
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow flex items-center">
            {renderIcon()}
            <div className="ml-4">
                <p className="text-gray-500">{title}</p>
                <h4 className="text-2xl font-semibold text-gray-800">
                    {value}
                </h4>
            </div>
        </div>
    )
}

export default StatCard
