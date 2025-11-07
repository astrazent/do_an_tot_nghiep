import React from 'react'
import { FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import { SiZalo, SiMessenger } from 'react-icons/si'
import ScrollToTop from '~/components/shared/ScrollToTop'

const FloatingContactBar = () => {
    return (
        <>
            <div className="fixed top-2/3 right-4 -translate-y-1/2 flex flex-col space-y-3 z-50">
                <a
                    href="https://zalo.me/YOUR_ZALO_NUMBER"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#0068FF] rounded-full flex items-center justify-center shadow-lg hover:bg-[#0055D4] transition-all hover:scale-110"
                    title="Chat qua Zalo"
                >
                    <SiZalo size={22} className="text-white" />
                </a>

                <a
                    href="tel:YOUR_PHONE_NUMBER"
                    className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all hover:scale-110"
                    title="Gọi ngay"
                >
                    <FaPhone size={18} className="text-white" />
                </a>

                <a
                    href="https://m.me/YOUR_FACEBOOK_PAGE_ID"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-all hover:scale-110"
                    title="Chat qua Messenger"
                >
                    <SiMessenger size={20} className="text-white" />
                </a>

                <a
                    href="YOUR_GOOGLE_MAPS_LINK"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-all hover:scale-110"
                    title="Xem địa chỉ"
                >
                    <FaMapMarkerAlt size={18} className="text-white" />
                </a>
            </div>

            <ScrollToTop />
        </>
    )
}

export default FloatingContactBar
