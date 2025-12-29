import React from 'react'
import { FaUtensils } from 'react-icons/fa'
import Food1 from '~/assets/image/user/aboutUs/food_1.jpg'
import Food2 from '~/assets/image/user/aboutUs/food_2.jpg'
import Food3 from '~/assets/image/user/aboutUs/food_3.jpg'
import Food4 from '~/assets/image/user/aboutUs/food_4.jpg'

const MissionSection = () => {
    return (
        <section className="py-24 px-6 relative bg-green-50/50">
            <div className="max-w-5xl mx-auto text-center">
                <FaUtensils className="mx-auto text-green-600 mb-6" size={40} />

                <h2 className="text-3xl md:text-5xl font-sans font-bold text-green-900 mb-8">
                    Sứ Mệnh Của Chúng Tôi
                </h2>

                <div className="prose prose-lg mx-auto text-stone-600 mb-12">
                    <p className="mb-4">
                        Trở thành nhịp cầu kết nối văn hóa ẩm thực, giúp mỗi
                        người tiêu dùng dù ở bất cứ đâu cũng có thể trải nghiệm
                        trọn vẹn hương vị quê hương.
                    </p>
                    <p className="font-medium text-green-800 text-xl">
                        "Mỗi bữa ăn không chỉ là thưởng thức món ngon, mà là cơ
                        hội để gắn kết gia đình và chia sẻ yêu thương."
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 opacity-80">
                    <img
                        src={Food1}
                        className="h-48 w-full object-cover rounded-lg transform translate-y-4 shadow-lg hover:scale-105 transition-transform duration-500 hover:shadow-green-500/20"
                        alt="Food 1"
                    />
                    <img
                        src={Food2}
                        className="h-48 w-full object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-500 hover:shadow-green-500/20"
                        alt="Food 2"
                    />
                    <img
                        src={Food3}
                        className="h-48 w-full object-cover rounded-lg transform translate-y-4 shadow-lg hover:scale-105 transition-transform duration-500 hover:shadow-green-500/20"
                        alt="Food 3"
                    />
                    <img
                        src={Food4}
                        className="h-48 w-full object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-500 hover:shadow-green-500/20"
                        alt="Food 4"
                    />
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-green-100 inline-block max-w-2xl mx-auto relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        Cam kết
                    </div>
                    <p className="text-stone-700 italic text-lg">
                        "Trong tương lai,{' '}
                        <span className="text-green-700 font-bold">
                            BẾP SẠCH VIỆT
                        </span>{' '}
                        sẽ không ngừng nỗ lực mở rộng các dòng sản phẩm đặc sản
                        vùng miền, mang đến sự lựa chọn phong phú và tiện lợi
                        nhất cho bạn."
                    </p>
                </div>
            </div>
        </section>
    )
}

export default MissionSection
