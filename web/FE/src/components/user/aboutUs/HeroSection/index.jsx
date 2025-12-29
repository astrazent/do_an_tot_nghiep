import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import heroImage from '~/assets/image/user/aboutUs/heroImage.png'

const HeroSection = () => {
    const navigate = useNavigate()

    return (
        <div className="relative h-[80vh] w-full flex items-center justify-center">
            <div className="absolute inset-0 z-0">
                <img
                    src={heroImage}
                    alt="Vietnamese Food Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-green-950/60"></div>
            </div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
                <span className="text-lime-400 font-bold tracking-widest text-sm uppercase mb-4 block">
                    Chào mừng đến với
                </span>
                <h1 className="text-5xl md:text-7xl font-sans font-bold text-white mb-6 leading-tight drop-shadow-lg">
                    BẾP SẠCH VIỆT
                </h1>
                <p className="text-green-50 text-lg md:text-xl font-light max-w-2xl mx-auto italic mb-10">
                    "Mang hương vị vùng miền đến bếp nhà bạn."
                </p>
                <button
                    onClick={() => navigate('/category/all')}
                    className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-full font-medium transition-colors duration-200 flex items-center mx-auto gap-2 shadow-md shadow-green-900/30"
                >
                    Khám Phá Menu <FaArrowRight />
                </button>
            </div>
        </div>
    )
}

export default HeroSection
