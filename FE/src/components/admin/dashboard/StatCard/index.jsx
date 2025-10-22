import React from 'react'
import {
    FiTrendingUp,
    FiUsers,
    FiDollarSign,
    FiUser,
    FiShoppingCart,
    FiLogOut,
    FiTarget,
    FiRotateCcw,
    FiArchive,
} from 'react-icons/fi'

const StatCard = ({ title, value, icon }) => {
    const renderIcon = () => {
        switch (icon) {
            case 'inventory':
                return (
                    <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <FiArchive
                            className="text-green-500 dark:text-green-400"
                            size={24}
                        />
                    </div>
                )

            case 'cart-abandon':
                return (
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                        <FiShoppingCart
                            className="text-orange-500 dark:text-orange-400"
                            size={24}
                        />
                    </div>
                )

            case 'bounce-rate':
                return (
                    <div className="p-3 bg-pink-100 dark:bg-pink-900/50 rounded-lg">
                        <FiLogOut
                            className="text-pink-500 dark:text-pink-400"
                            size={24}
                        />
                    </div>
                )

            case 'conversion-rate':
                return (
                    <div className="p-3 bg-teal-100 dark:bg-teal-900/50 rounded-lg">
                        <FiTarget
                            className="text-teal-500 dark:text-teal-400"
                            size={24}
                        />
                    </div>
                )

            case 'return-rate':
                return (
                    <div className="p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                        <FiRotateCcw
                            className="text-gray-500 dark:text-gray-300"
                            size={24}
                        />
                    </div>
                )

            case 'revenue':
                return (
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                        <FiDollarSign
                            className="text-yellow-500 dark:text-yellow-400"
                            size={24}
                        />
                    </div>
                )

            case 'sales':
                return (
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                        <FiTrendingUp
                            className="text-indigo-500 dark:text-indigo-400"
                            size={24}
                        />
                    </div>
                )

            case 'clients':
                return (
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                        <FiUsers
                            className="text-blue-500 dark:text-blue-400"
                            size={24}
                        />
                    </div>
                )

            case 'customers':
                return (
                    <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-lg">
                        <FiUser
                            className="text-red-500 dark:text-red-400"
                            size={24}
                        />
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:border dark:border-gray-700 flex items-center">
            {renderIcon()}
            <div className="ml-4">
                <p className="text-gray-500 dark:text-gray-400">{title}</p>
                <h4 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    {value}
                </h4>
            </div>
        </div>
    )
}

export default StatCard
