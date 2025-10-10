import React from 'react'
import {
    FaThumbsUp,
    FaShare,
    FaEnvelope,
    FaMicrophoneAlt,
    FaPlay,
} from 'react-icons/fa'
import { SiGooglenews } from 'react-icons/si'

const ActionToolbar = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 my-5">
            {/* Nghe đọc bài & Google News */}
            <div className="flex items-center gap-4">
                {/* Component Audio Player giả lập */}
                <div className="flex items-center gap-2 text-sm text-gray-700 border rounded-full p-1 pr-3">
                    <button className="p-2 rounded-full hover:bg-gray-100">
                        <FaPlay className="text-gray-600" />
                    </button>
                    <span>Nghe đọc bài 1:36</span>
                    <span className="bg-gray-200 text-xs px-1.5 py-0.5 rounded-sm">
                        1x
                    </span>
                    <FaMicrophoneAlt />
                    <span>Nữ miền Bắc</span>
                </div>
                <a
                    href="#googlenews"
                    className="flex items-center gap-2 text-sm text-gray-600 border rounded-full px-4 py-2 hover:bg-gray-50"
                >
                    Theo dõi Kenh14.vn trên{' '}
                    <SiGooglenews className="text-red-500 text-xl" />
                </a>
            </div>
        </div>
    )
}

export default ActionToolbar
