import React from 'react'
import ChatHeader from '../ChatHeader'
import MessageBubble from '../MessageBubble'
import { messages } from '../data'

const ChatWindow = () => {
    return (
        <div className="w-2/3 flex flex-col bg-gray-50">
            <ChatHeader />

            <div className="flex-grow p-6 overflow-y-auto space-y-6">
                {messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
                <p className="text-center text-gray-400">Message input area</p>
            </div>
        </div>
    )
}

export default ChatWindow
