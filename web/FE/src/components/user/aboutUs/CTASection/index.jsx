import React from 'react'
import { useNavigate } from 'react-router-dom'
import CtaBg from '~/assets/image/user/aboutUs/ctaImage.jpg'

const CTASection = () => {
    const navigate = useNavigate()

    return (
        <div className="relative py-24 text-center overflow-hidden">
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center blur-sm scale-110"
                style={{ backgroundImage: `url(${CtaBg})` }}
            ></div>

            <div className="absolute inset-0 bg-teal-900/70"></div>

            <div className="relative z-10 px-4">
                <h2 className="text-2xl md:text-3xl text-white font-sans mb-6 font-bold drop-shadow-md">
                    Sẵn sàng thưởng thức đặc sản Việt ngay tại nhà?
                </h2>
                <button
                    onClick={() => navigate('/category/all')}
                    className="bg-white text-green-700 hover:bg-green-50 hover:text-green-800 px-10 py-4 rounded-full font-bold transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                    Đặt Hàng Ngay
                </button>
            </div>
        </div>
    )
}

export default CTASection