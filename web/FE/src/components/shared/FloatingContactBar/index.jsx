import React, { useState, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { FaPhone, FaMapMarkerAlt, FaTrashAlt, FaUserLock } from 'react-icons/fa'
import { SiZalo, SiMessenger } from 'react-icons/si'
import {
    MdClose,
    MdChevronLeft,
    MdAddCircleOutline,
    MdMoreHoriz,
    MdOutlineBlock,
    MdCheck,
} from 'react-icons/md'
import MarkdownRenderer from '../MarkdownRender'
import { IoMdSend } from 'react-icons/io'
import { RiRobot2Line } from 'react-icons/ri'
import ReactGA from 'react-ga4'
import logo from '~/assets/icon/logo/brand-logo.png'
import ScrollToTop from '../ScrollToTop'
import ConfirmModal from '../ConfirmModal'

import {
    useCreateConversation,
    useEndConversation,
    useGetConversations,
    useCreateMessage,
    useDeleteConversation,
} from '~/hooks/user/useChatBot'
import { useCurrentUser } from '~/hooks/user/useUser'

const formatTime = isoString => {
    if (!isoString) return ''
    const date = new Date(isoString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
    })
}

const parseMessageContent = content => {
    let finalContent = content

    try {
        if (
            typeof content === 'string' &&
            content.trim().startsWith('{') &&
            content.trim().endsWith('}')
        ) {
            const parsed = JSON.parse(content)

            if (parsed.status === 'order_ready' && parsed.message) {
                return parsed.message
            }

            finalContent = parsed.message || parsed.content || content
        }
    } catch (error) {}

    if (typeof finalContent === 'string' && finalContent.includes('||')) {
        finalContent = finalContent.split('||')[0].trim()
    }

    return finalContent
}

const FloatingContactBar = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { isAuthenticated, loading: authLoading } = useCurrentUser()

    const [isChatOpen, setIsChatOpen] = useState(false)
    const [view, setView] = useState('list')
    const [activeConversationId, setActiveConversationId] = useState(null)
    const [inputText, setInputText] = useState('')
    const [showOptions, setShowOptions] = useState(false)

    const [isCreating, setIsCreating] = useState(false)
    const [newTitle, setNewTitle] = useState('')

    const messagesEndRef = useRef(null)
    const chatRef = useRef(null)
    const inputTitleRef = useRef(null)

    const { data: conversations = [], isLoading: isLoadingConversations } =
        useGetConversations()
    const createConversationMutation = useCreateConversation()
    const endConversationMutation = useEndConversation()
    const deleteConversationMutation = useDeleteConversation()
    const createMessageMutation = useCreateMessage(activeConversationId)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [conversationToDelete, setConversationToDelete] = useState(null)

    const activeConversation = conversations.find(
        c => c.id === activeConversationId
    )

    useEffect(() => {
        if (isChatOpen && view === 'chat') {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [activeConversation?.messages, view, isChatOpen])

    useEffect(() => {
        if (isChatOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isChatOpen])

    useEffect(() => {
        const handleClickOutside = event => {
            if (
                isChatOpen &&
                chatRef.current &&
                !chatRef.current.contains(event.target)
            ) {
                setIsChatOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isChatOpen])

    useEffect(() => {
        if (isCreating && inputTitleRef.current) {
            inputTitleRef.current.focus()
        }
    }, [isCreating])

    const handleLoginRedirect = () => {
        navigate('/login')
        setIsChatOpen(false)
    }

    const handleSelectConversation = conv => {
        setActiveConversationId(conv.id)
        setView('chat')
        setShowOptions(false)
        setIsCreating(false)
        // GA4 event
        ReactGA.event('select_content', {
            content_type: 'chatbot',
            content_id: conv.id, // id cuộc hội thoại
            content_name: conv.title || `Hội thoại #${conv.id}`,
            debug_mode: true,
        })
    }

    const handleStartCreate = () => {
        setIsCreating(true)
        setNewTitle('')
    }

    const handleConfirmCreate = e => {
        if (e) e.preventDefault()

        const finalTitle = newTitle.trim() || 'Cuộc trò chuyện mới'

        createConversationMutation.mutate(finalTitle, {
            onSuccess: data => {
                setActiveConversationId(data.id)
                setView('chat')
                setIsCreating(false)
                setNewTitle('')
            },
        })
    }

    const handleCancelCreate = () => {
        setIsCreating(false)
        setNewTitle('')
    }

    const handleSendMessage = e => {
        e.preventDefault()
        if (!inputText.trim() || !activeConversationId) return

        const content = inputText
        setInputText('')

        createMessageMutation.mutate(content, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['conversations'] })
            },
        })
    }

    const handleEndConversation = () => {
        if (!activeConversationId) return
        if (window.confirm('Bạn có chắc muốn kết thúc cuộc trò chuyện này?')) {
            endConversationMutation.mutate(activeConversationId, {
                onSuccess: () => setShowOptions(false),
            })
        }
    }

    const handleClickDelete = () => {
        if (!activeConversationId) return
        setConversationToDelete(activeConversation)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = () => {
        if (!conversationToDelete) return
        deleteConversationMutation.mutate(conversationToDelete.id, {
            onSuccess: () => {
                setView('list')
                setActiveConversationId(null)
                setShowOptions(false)
                setConversationToDelete(null)
                setIsDeleteModalOpen(false)
            },
        })
    }

    const renderLoginRequired = () => (
        <div className="flex flex-col h-full bg-white text-gray-800 relative">
            <div className="flex items-center w-full gap-4 px-5 py-3 border-b border-gray-100">
                <div className="flex-shrink-0">
                    <img
                        src={logo}
                        alt="Banner"
                        className="w-12 h-12 object-cover rounded-full"
                    />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        Chatbot BSV
                    </h2>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                    <FaUserLock size={40} />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Yêu cầu đăng nhập
                </h3>

                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    Vui lòng đăng nhập tài khoản để được hỗ trợ trực tuyến và
                    xem lịch sử trò chuyện của bạn.
                </p>

                <button
                    onClick={handleLoginRedirect}
                    className="w-full max-w-[200px] bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:-translate-y-0.5 duration-500 ease-out active:translate-y-0"
                >
                    Đăng nhập ngay
                </button>
            </div>
        </div>
    )

    const renderConversationList = () => (
        <div className="flex flex-col h-full bg-white text-gray-800">
            <div className="flex items-center w-full gap-4 px-5 py-3 border-b border-gray-100">
                <div className="flex-shrink-0">
                    <img
                        src={logo}
                        alt="Banner"
                        className="w-12 h-12 object-cover rounded-full"
                    />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        Chatbot BSV
                    </h2>
                </div>
            </div>

            <div className="px-5 py-3">
                {!isCreating ? (
                    <button
                        onClick={handleStartCreate}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-colors"
                    >
                        <MdAddCircleOutline size={22} />
                        <span>Bắt đầu đoạn chat mới</span>
                    </button>
                ) : (
                    <div className="bg-gray-50 border border-green-200 rounded-lg p-3 animate-fade-in-down">
                        <label className="text-xs font-semibold text-gray-600 mb-2 block">
                            Nhập tiêu đề cuộc trò chuyện:
                        </label>

                        <form
                            onSubmit={handleConfirmCreate}
                            className="flex items-center gap-2"
                        >
                            <input
                                ref={inputTitleRef}
                                type="text"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                placeholder="Ví dụ: Tư vấn học phí..."
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md 
                                focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                            />

                            <button
                                type="button"
                                onClick={handleCancelCreate}
                                style={{ padding: 10 }}
                                className="p-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md 
                                transition-colors flex items-center justify-center"
                            >
                                <MdClose size={16} />
                            </button>

                            <button
                                type="submit"
                                disabled={createConversationMutation.isPending}
                                style={{ padding: 10 }}
                                className="text-white bg-green-500 hover:bg-green-600 rounded-md 
                                transition-colors disabled:opacity-70 flex items-center justify-center"
                            >
                                {createConversationMutation.isPending ? (
                                    '...'
                                ) : (
                                    <MdCheck size={16} />
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-4 custom-scrollbar">
                <div className="text-xs font-bold text-gray-400 uppercase mb-3 mt-2">
                    Gần đây
                </div>

                {isLoadingConversations ? (
                    <div className="text-center text-gray-400 mt-10">
                        Đang tải...
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10 text-sm">
                        Chưa có cuộc trò chuyện nào
                    </div>
                ) : (
                    <div className="space-y-3">
                        {conversations.map(conv => {
                            const lastMsg =
                                conv.messages && conv.messages.length > 0
                                    ? conv.messages[conv.messages.length - 1]
                                    : null
                            const isEnded =
                                conv.status === 'ended' || !!conv.end_time

                            return (
                                <div
                                    key={conv.id}
                                    onClick={() =>
                                        handleSelectConversation(conv)
                                    }
                                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-400 cursor-pointer transition-all"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-gray-800 text-[15px] truncate max-w-[70%]">
                                            {conv.title ||
                                                `Hội thoại #${conv.id}`}
                                        </h3>
                                        <span className="bg-gray-100 text-gray-500 text-[11px] font-medium px-2 py-1 rounded-md">
                                            {formatTime(
                                                conv.last_message_time ||
                                                    conv.start_time
                                            )}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-3 line-clamp-1 h-5">
                                        {lastMsg
                                            ? (lastMsg.sender === 'user'
                                                  ? 'Bạn: '
                                                  : 'Bot: ') +
                                              parseMessageContent(
                                                  lastMsg.content
                                              )
                                            : 'Chưa có tin nhắn'}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span
                                            className={`w-2.5 h-2.5 rounded-full ${isEnded ? 'bg-gray-400' : 'bg-green-500'}`}
                                        ></span>
                                        <span
                                            className={
                                                isEnded
                                                    ? 'text-gray-400'
                                                    : 'text-gray-500 font-medium'
                                            }
                                        >
                                            {isEnded
                                                ? 'Đã kết thúc'
                                                : 'Đang hoạt động'}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )

    const renderChatWindow = () => {
        const isEnded =
            activeConversation?.status === 'ended' ||
            !!activeConversation?.end_time

        let messagesToRender = activeConversation?.messages
            ? [...activeConversation.messages]
            : []

        if (createMessageMutation.isPending) {
            messagesToRender.push({
                sender: 'user',
                content: createMessageMutation.variables,
                created_at: new Date().toISOString(),
            })

            messagesToRender.push({
                sender: 'bot',
                content: 'Đang suy nghĩ...',
                isThinking: true,
            })
        }

        return (
            <div className="flex flex-col h-full bg-gray-50">
                <div className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                setView('list')
                                setActiveConversationId(null)
                            }}
                            className="hover:bg-gray-100 !p-1.5 rounded-full text-gray-600 transition-colors"
                        >
                            <MdChevronLeft size={26} />
                        </button>
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm truncate max-w-[150px]">
                                {activeConversation?.title || 'Đang tải...'}
                            </h3>
                            <div className="flex items-center gap-1">
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${isEnded ? 'bg-gray-400' : 'bg-green-500'}`}
                                ></span>
                                <span className="text-[10px] text-gray-500">
                                    {isEnded
                                        ? 'Cuộc trò chuyện đã đóng'
                                        : 'Thường trả lời ngay'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                        >
                            <MdMoreHoriz size={24} />
                        </button>

                        {showOptions && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-100 py-1">
                                {!isEnded && (
                                    <button
                                        onClick={handleEndConversation}
                                        className="flex items-center w-full px-4 py-2 !text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <MdOutlineBlock className="mr-2" /> Kết
                                        thúc đoạn chat
                                    </button>
                                )}
                                <button
                                    onClick={handleClickDelete}
                                    className="flex items-center w-full px-4 py-2 !text-sm text-red-600 hover:bg-gray-100"
                                >
                                    <FaTrashAlt className="mr-2" /> Xóa hội
                                    thoại
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {messagesToRender.map((msg, index) => {
                        const contentToRender =
                            msg.sender === 'bot'
                                ? parseMessageContent(msg.content)
                                : msg.content

                        const isThinkingMessage = msg.isThinking === true

                        return (
                            <div
                                key={index}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-[14px] leading-relaxed shadow-sm
                                    ${
                                        msg.sender === 'user'
                                            ? 'bg-[#22C55E] text-white rounded-br-none'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                    }`}
                                >
                                    {isThinkingMessage ? (
                                        <div className="flex items-center gap-2 text-gray-500 italic">
                                            <span className="animate-pulse">
                                                Bot đang suy nghĩ
                                            </span>
                                            <span className="flex gap-1">
                                                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <MarkdownRenderer
                                                content={contentToRender}
                                                sender={msg.sender}
                                            />
                                            <div
                                                className={`text-[9px] mt-1 opacity-70 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                                            >
                                                {formatTime(msg.created_at)}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-3 bg-white shadow-md">
                    {isEnded ? (
                        <div className="text-center text-gray-500 text-sm py-2 bg-gray-100 rounded-lg">
                            Cuộc trò chuyện này đã kết thúc.
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSendMessage}
                            className="flex gap-2 items-center"
                        >
                            <input
                                type="text"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                disabled={createMessageMutation.isPending}
                                className="flex-1 bg-gray-100 text-gray-800 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all disabled:opacity-60"
                            />
                            <button
                                type="submit"
                                disabled={
                                    !inputText.trim() ||
                                    createMessageMutation.isPending
                                }
                                className="p-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-full transition-colors"
                            >
                                <IoMdSend size={18} />
                            </button>
                        </form>
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            {isChatOpen && (
                <div
                    onClick={() => setIsChatOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-[50]"
                />
            )}
            <div
                ref={chatRef}
                className={`
                fixed bottom-20 right-20 z-[60] 
                w-[360px] h-[580px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col font-sans
                transition-all duration-300 origin-bottom-right ease-out
                ${isChatOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'}
            `}
            >
                {authLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-500 text-sm">
                            Đang tải...
                        </span>
                    </div>
                ) : !isAuthenticated ? (
                    renderLoginRequired()
                ) : view === 'list' ? (
                    renderConversationList()
                ) : (
                    renderChatWindow()
                )}
            </div>

            <div className="fixed bottom-25 right-6 flex flex-col-reverse items-center gap-3 z-50">
                <button
                    onClick={() => {
                        setIsChatOpen(!isChatOpen)
                        if (!isChatOpen) {
                            // Chỉ gửi khi mở
                            ReactGA.event('select_content', {
                                content_type: 'chatbot',
                                content_id: 'floating_contact_bar',
                                content_name: 'Chatbot BSV',
                                debug_mode: true,
                            })
                        }
                    }}
                    className={`
                        !p-0 !m-0 !appearance-none !border-0 !outline-none
                        w-10 h-10 !rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105
                        ${isChatOpen ? 'bg-gray-800 rotate-90' : 'bg-green-500 hover:bg-green-600'}
                    `}
                >
                    {isChatOpen ? (
                        <MdClose size={28} className="text-white" />
                    ) : (
                        <RiRobot2Line size={20} className="text-white" />
                    )}
                </button>

                <>
                    <a
                        href="https://zalo.me/"
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    >
                        <SiZalo size={20} className="text-white" />
                    </a>
                    <a
                        href="tel:123456"
                        className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    >
                        <FaPhone size={16} className="text-white" />
                    </a>
                    <a
                        href="#"
                        className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    >
                        <SiMessenger size={20} className="text-white" />
                    </a>
                    <a
                        href="#"
                        className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    >
                        <FaMapMarkerAlt size={18} className="text-white" />
                    </a>
                </>
            </div>
            {isDeleteModalOpen && (
                <ConfirmModal
                    isOpen={isDeleteModalOpen}
                    message={`Bạn có chắc chắn muốn xóa cuộc hội thoại "${conversationToDelete?.title || 'Cuộc trò chuyện'}"?`}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => {
                        setIsDeleteModalOpen(false)
                        setConversationToDelete(null)
                    }}
                />
            )}
            <ScrollToTop />
        </>
    )
}

export default FloatingContactBar
