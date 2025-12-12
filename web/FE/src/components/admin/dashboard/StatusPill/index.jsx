import React from 'react'

const StatusPill = ({ status }) => {
    const getStatusClasses = () => {
        switch (status.toLowerCase()) {
            case 'shipped':
                return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300'
            case 'cancelled':
                return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
        }
    }

    return (
        <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses()}`}
        >
            {status}
        </span>
    )
}

export default StatusPill
