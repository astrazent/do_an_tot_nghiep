import React from 'react'
import { FaHome, FaFacebookF } from 'react-icons/fa'

const SocialSidebar = () => {
    return (
        <div className="absolute left-1 -translate-x-full pr-4 hidden lg:flex flex-col space-y-2 top-35">
            <a
                href="#home"
                className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-full text-white"
            >
                <FaHome size={20} />
            </a>
            <a
                href="#facebook"
                className="flex items-center justify-center w-10 h-10 bg-blue-800 rounded-full text-white"
            >
                <FaFacebookF size={20} />
            </a>
        </div>
    )
}

export default SocialSidebar
