import React from 'react'
import { FaLeaf, FaHeart, FaClock, FaGlobeAsia } from 'react-icons/fa'

const ValueCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/10 group">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:bg-green-500">
            <Icon className="text-white" size={30} />
        </div>
        <h4 className="text-xl font-bold mb-3">{title}</h4>
        <p className="text-green-100 text-sm leading-relaxed">{description}</p>
    </div>
)

const CoreValues = () => {
    const values = [
        {
            icon: FaLeaf,
            title: 'Chất lượng & An toàn',
            description:
                'Nguyên liệu tuyển chọn kỹ lưỡng, quy trình chế biến sạch sẽ, giữ trọn hương vị tự nhiên và đạt chuẩn an toàn cao nhất.',
        },
        {
            icon: FaGlobeAsia,
            title: 'Tôn vinh truyền thống',
            description:
                'Đại sứ văn hóa ẩm thực, mang câu chuyện và tinh thần của từng vùng đất vào trong mỗi món ăn đặc sản.',
        },
        {
            icon: FaClock,
            title: 'Tiện lợi tối đa',
            description:
                'Sơ chế sẵn sàng, giúp bạn tiết kiệm thời gian mà vẫn thưởng thức được món ngon như chính tay mình làm.',
        },
        {
            icon: FaHeart,
            title: 'Bền vững & Trách nhiệm',
            description:
                'Cam kết bảo vệ môi trường, sử dụng nguyên liệu bền vững và đóng góp tích cực cho cộng đồng.',
        },
    ]

    return (
        <section className="bg-green-800 py-24 text-white relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                <div className="w-96 h-96 bg-white rounded-full blur-3xl absolute -top-20 -left-20"></div>
                <div className="w-96 h-96 bg-lime-500 rounded-full blur-3xl absolute bottom-0 right-0"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h3 className="text-lime-400 font-bold uppercase tracking-widest mb-3">
                        Triết lý kinh doanh
                    </h3>
                    <h2 className="text-4xl md:text-5xl font-sans font-bold">
                        Giá Trị Cốt Lõi
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((val, index) => (
                        <ValueCard key={index} {...val} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CoreValues
