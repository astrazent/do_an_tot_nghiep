import React from 'react';
import { FaHome, FaFacebookF } from 'react-icons/fa';

const SocialSidebar = () => {
    return (
        // Position fixed để nó luôn nằm ở một vị trí trên màn hình
        // Có thể cần điều chỉnh left/top để phù hợp với layout của bạn
        <div className="absolute left-0 -translate-x-full pr-4 hidden lg:flex flex-col space-y-2 top-45">
            <a href="#home" className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-full text-white">
                <FaHome size={20} />
            </a>
            <a href="#facebook" className="flex items-center justify-center w-10 h-10 bg-blue-800 rounded-full text-white">
                <FaFacebookF size={20} />
            </a>
        </div>
    );
};

export default SocialSidebar;