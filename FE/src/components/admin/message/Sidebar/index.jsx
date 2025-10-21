import React from 'react'
import ConversationItem from '../ConversationItem'
import { conversations } from '../data'

const Sidebar = () => {
    return (
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
                <p className="text-sm text-gray-500">
                    Real-time communication center
                </p>
            </div>

            <div className="p-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <svg
                        className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto px-2 space-y-1">
                {conversations.map(convo => (
                    <ConversationItem key={convo.id} convo={convo} />
                ))}
            </div>
        </div>
    )
}

export default Sidebar
