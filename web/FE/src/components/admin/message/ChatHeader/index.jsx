import React from 'react'

const ChatHeader = () => {
    return (
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
                <div>
                    <p className="font-bold text-gray-800">John Smith</p>
                    <p className="text-sm text-green-500">Last seen 2m ago</p>
                </div>
            </div>
            <div className="flex items-center space-x-4 text-gray-500">
                <button className="hover:text-gray-700">...</button>
            </div>
        </div>
    )
}

export default ChatHeader
