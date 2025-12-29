import React from 'react'
import { FaLeaf, FaMapMarkerAlt } from 'react-icons/fa'
import freshFood from '~/assets/image/user/aboutUs/freshFood.png'

const BrandStory = () => {
    return (
        <section className="py-20 px-6 lg:px-20 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                <div className="relative order-2 lg:order-1">
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-200 rounded-full opacity-50 z-0"></div>
                    <img
                        src={freshFood}
                        alt="Cooking Traditional Food"
                        className="relative z-10 rounded-2xl shadow-2xl w-full object-cover h-[500px]"
                    />
                    <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg z-20 hidden md:block border-l-4 border-green-600">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-3 rounded-full text-green-700">
                                <FaLeaf size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-stone-800">
                                    100% Tự nhiên
                                </p>
                                <p className="text-xs text-stone-500">
                                    Nguyên liệu sạch
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="order-1 lg:order-2 space-y-6">
                    <h2 className="text-4xl md:text-5xl font-sans font-bold text-green-900 leading-tight">
                        Khởi nguồn từ <br />{' '}
                        <span className="text-green-600">
                            tình yêu đất Việt
                        </span>
                    </h2>
                    <p className="text-stone-600 leading-relaxed text-lg">
                        <span className="font-bold text-green-700">BẾP SẠCH VIỆT</span> ra đời từ niềm đam mê đối với ẩm thực
                        truyền thống. Chúng tôi là những người con đất Việt,
                        mang sứ mệnh kết nối mọi người với tinh hoa quê hương.
                    </p>
                    <p className="text-stone-600 leading-relaxed">
                        Từ Tây Bắc hùng vĩ đến miền Tây sông nước, chúng tôi
                        đã đi khắp các vùng miền để tuyển chọn những nguyên
                        liệu đặc trưng nhất. Mỗi món ăn không chỉ là thực
                        phẩm, mà là một câu chuyện văn hóa, là hương vị độc
                        đáo mà <span className="font-semibold text-green-700">BẾP SẠCH VIỆT</span> muốn mang đến bàn ăn gia đình bạn.
                    </p>
                    <div className="pt-4">
                        <div className="inline-flex items-center gap-2 text-green-800 font-semibold border-b-2 border-green-500 pb-1">
                            <FaMapMarkerAlt
                                className="text-green-600"
                                size={18}
                            />
                            Hành trình ẩm thực xuyên Việt
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BrandStory