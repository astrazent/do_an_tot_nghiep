import React from 'react'

const ConversationItem = ({ convo }) => {
    const { name, lastMessage, timestamp, role, unread, active } = convo

    const baseClasses =
        'flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200'
    const activeClasses = 'bg-indigo-600 text-white'
    const inactiveClasses = 'hover:bg-gray-100'

    return (
        <div
            className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
        >
            <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0 mr-4"></div>

            <div className="flex-grow">
                <div className="flex justify-between items-center">
                    <p
                        className={`font-bold ${active ? 'text-white' : 'text-gray-800'}`}
                    >
                        {name}
                    </p>
                    <p
                        className={`text-xs ${active ? 'text-indigo-200' : 'text-gray-500'}`}
                    >
                        {timestamp}
                    </p>
                </div>
                <p
                    className={`text-sm truncate ${active ? 'text-indigo-100' : 'text-gray-600'}`}
                >
                    {lastMessage}
                </p>
                <p
                    className={`text-xs uppercase font-semibold mt-1 ${active ? 'text-indigo-200' : 'text-gray-400'}`}
                >
                    {role}
                </p>
            </div>

            {unread > 0 && (
                <div className="ml-3 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                    {unread}
                </div>
            )}
        </div>
    )
}

export default ConversationItem
