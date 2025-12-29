import React from 'react'

const HeroSection = () => {
    return (
        <section className="relative py-20 bg-gradient-to-br from-gray-900 to-green-900 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center"></div>
            <div className="container mx-auto px-4 relative z-10 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                    Hợp Tác Cùng{' '}
                    <span className="text-green-400">Bếp Sạch Việt</span>
                    <br />
                    Phân Phối Đặc Sản Cao Cấp
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
                    Cơ hội trở thành đại lý độc quyền trên 63 tỉnh thành. Lợi
                    nhuận hấp dẫn, chính sách bảo vệ giá và hỗ trợ toàn diện.
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                    <a
                        href="#register"
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition shadow-green-500/50 shadow-lg"
                    >
                        Trở Thành Đại Lý
                    </a>
                    <a
                        href="#benefits"
                        className="bg-transparent border-2 border-white hover:bg-white hover:text-green-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition"
                    >
                        Xem Chính Sách
                    </a>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
