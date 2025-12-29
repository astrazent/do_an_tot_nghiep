import React, { useState, useEffect, useRef } from 'react'

import {
    MdClose,
    MdChevronLeft,
    MdAddCircleOutline,
    MdMoreHoriz,
} from 'react-icons/md'
import { IoMdSend } from 'react-icons/io'
import { BsChatDotsFill } from 'react-icons/bs'

const MOCK_CONVERSATIONS = [
    {
        id: 1,
        title: 'Lỗi thanh toán đơn #1234',
        date: '10:30 AM',
        status: 'active',
        preview: 'Bạn vui lòng kiểm tra lại...',
    },
    {
        id: 2,
        title: 'Hỏi về chính sách bảo hành',
        date: 'Hôm qua',
        status: 'ended',
        preview: 'Cảm ơn bạn đã hỗ trợ.',
    },
    {
        id: 3,
        title: 'Tư vấn sản phẩm Laptop',
        date: '28/11/2025',
        status: 'ended',
        preview: 'Sản phẩm này còn hàng không?',
    },
]

const MOCK_MESSAGES = [
    {
        id: 1,
        sender: 'bot',
        text: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?',
        time: '10:00',
    },
    {
        id: 2,
        sender: 'user',
        text: 'Tôi bị lỗi thanh toán đơn hàng #1234',
        time: '10:01',
    },
    {
        id: 3,
        sender: 'bot',
        text: 'Rất tiếc vì sự cố này. Để tôi kiểm tra trạng thái đơn hàng giúp bạn nhé.',
        time: '10:02',
    },
]

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [view, setView] = useState('list')
    const [activeConversation, setActiveConversation] = useState(null)
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState('')

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, view])

    const handleSelectConversation = conv => {
        setActiveConversation(conv)
        setMessages(MOCK_MESSAGES)
        setView('chat')
    }

    const handleNewChat = () => {
        setActiveConversation({ title: 'Cuộc hội thoại mới', status: 'active' })
        setMessages([
            {
                id: 0,
                sender: 'bot',
                text: 'Chào bạn, tôi là trợ lý ảo. Bạn cần hỗ trợ vấn đề gì?',
                time: 'Now',
            },
        ])
        setView('chat')
    }

    const handleSendMessage = e => {
        e.preventDefault()
        if (!inputText.trim()) return

        const newMessage = {
            id: Date.now(),
            sender: 'user',
            text: inputText,
            time: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
        }

        setMessages(prev => [...prev, newMessage])
        setInputText('')

        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: 'bot',
                    text: 'Cảm ơn, tôi đang xử lý yêu cầu của bạn...',
                    time: 'Now',
                },
            ])
        }, 1000)
    }

    const handleBackToList = () => {
        setView('list')
        setActiveConversation(null)
    }

    const renderConversationList = () => (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="p-4 bg-white border-b sticky top-0 z-10">
                <h2 className="text-lg font-semibold text-gray-800">
                    Xin chào! 👋
                </h2>
                <p className="text-sm text-gray-500">
                    Xem lại lịch sử hoặc bắt đầu chat mới.
                </p>

                <button
                    onClick={handleNewChat}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                >
                    <MdAddCircleOutline size={20} />
                    Bắt đầu đoạn chat mới
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 mb-2">
                    Gần đây
                </h3>
                {MOCK_CONVERSATIONS.map(conv => (
                    <div
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv)}
                        className="group bg-white p-3 rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-gray-700 truncate w-3/4">
                                {conv.title}
                            </span>
                            <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                {conv.date}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate mb-2">
                            {conv.preview}
                        </p>
                        <div className="flex items-center gap-2">
                            <span
                                className={`w-2 h-2 rounded-full ${conv.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}
                            ></span>
                            <span className="text-xs text-gray-400">
                                {conv.status === 'active'
                                    ? 'Đang hoạt động'
                                    : 'Đã kết thúc'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    const renderChatWindow = () => (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="flex items-center justify-between p-3 bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleBackToList}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-600 transition"
                    >
                        <MdChevronLeft size={24} />
                    </button>
                    <div>
                        <h3 className="font-semibold text-gray-800 text-sm truncate max-w-[150px]">
                            {activeConversation?.title || 'Chat'}
                        </h3>
                        <div className="flex items-center gap-1">
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${activeConversation?.status === 'ended' ? 'bg-gray-400' : 'bg-green-500'}`}
                            ></span>
                            <span className="text-xs text-gray-500">
                                {activeConversation?.status === 'ended'
                                    ? 'Read-only mode'
                                    : 'Bot trực tuyến'}
                            </span>
                        </div>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <MdMoreHoriz size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => {
                    const isUser = msg.sender === 'user'
                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                                    isUser
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                }`}
                            >
                                <p>{msg.text}</p>
                                <span
                                    className={`text-[10px] block mt-1 text-right ${isUser ? 'text-blue-200' : 'text-gray-400'}`}
                                >
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />

                {activeConversation?.status === 'ended' && (
                    <div className="flex justify-center my-4">
                        <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                            Phiên chat này đã kết thúc
                        </span>
                    </div>
                )}
            </div>

            <div className="p-3 bg-white border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        disabled={activeConversation?.status === 'ended'}
                        placeholder={
                            activeConversation?.status === 'ended'
                                ? 'Chat đã đóng'
                                : 'Nhập tin nhắn...'
                        }
                        className="flex-1 bg-gray-100 text-gray-800 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-60"
                    />
                    <button
                        type="submit"
                        disabled={
                            !inputText.trim() ||
                            activeConversation?.status === 'ended'
                        }
                        className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center"
                    >
                        <IoMdSend size={18} className="ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    )

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans antialiased">
            <div
                className={`
            bg-white w-[360px] h-[550px] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100
            transition-all duration-300 origin-bottom-right ease-out
            ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
        `}
            >
                {view === 'list'
                    ? renderConversationList()
                    : renderChatWindow()}
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
            flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none
            ${isOpen ? 'bg-gray-800 rotate-90' : 'bg-blue-600 rotate-0'}
        `}
            >
                {isOpen ? (
                    <MdClose size={28} className="text-white" />
                ) : (
                    <BsChatDotsFill size={26} className="text-white" />
                )}
            </button>
        </div>
    )
}

export default ChatWidget
