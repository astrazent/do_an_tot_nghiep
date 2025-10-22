import React from 'react'

const MessageBubble = ({ message }) => {
    const { text, timestamp, isSender } = message

    return (
        <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
            <div className="flex items-end max-w-lg">
                {!isSender && (
                    <div className="w-8 h-8 bg-gray-300 rounded-full mr-3 flex-shrink-0"></div>
                )}
                <div>
                    <div
                        className={`px-4 py-3 rounded-2xl ${isSender ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}
                    >
                        <p>{text}</p>
                    </div>
                    {timestamp && (
                        <p
                            className={`text-xs text-gray-500 mt-1 ${isSender ? 'text-right' : 'text-left'}`}
                        >
                            {timestamp}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MessageBubble
