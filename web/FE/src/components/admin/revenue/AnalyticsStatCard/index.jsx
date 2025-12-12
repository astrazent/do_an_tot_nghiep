import React from 'react';

const AnalyticsStatCard = ({
    title,
    value,
    icon,
    iconBgColor,
    iconColor
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {title}
                    </p>
                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-200 mt-1">
                        {value}
                    </p>
                </div>

                <div className={`p-3 rounded-lg ${iconBgColor}`}>
                    {React.cloneElement(icon, {
                        className: `w-6 h-6 ${iconColor}`,
                    })}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsStatCard;
