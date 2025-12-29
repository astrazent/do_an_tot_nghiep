import React from 'react'
import {
    FaHandshake,
    FaMoneyBillWave,
    FaShieldAlt,
    FaBullhorn,
    FaCheckCircle,
} from 'react-icons/fa'

const BenefitsSection = () => {
    return (
        <section id="benefits" className="py-20 bg-green-50/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Quyền Lợi Vượt Trội
                    </h2>
                    <div className="w-20 h-1 bg-green-600 mx-auto rounded"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-green-600">
                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 text-2xl">
                            <FaMoneyBillWave />
                        </div>
                        <h3 className="text-xl font-bold mb-4">
                            Chiết Khấu & Lợi Nhuận
                        </h3>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start">
                                <FaCheckCircle className="mt-1 mr-2 text-green-500 min-w-[16px]" />{' '}
                                Chiết khấu thưởng dựa trên doanh số cam kết.
                            </li>
                            <li className="flex items-start">
                                <FaCheckCircle className="mt-1 mr-2 text-green-500 min-w-[16px]" />{' '}
                                Hưởng chiết khấu độc lập song song với các
                                chương trình khác.
                            </li>
                            <li className="flex items-start">
                                <FaCheckCircle className="mt-1 mr-2 text-green-500 min-w-[16px]" />{' '}
                                Chia sẻ lợi nhuận, đồng hành bền vững.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-blue-500">
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 text-2xl">
                            <FaShieldAlt />
                        </div>
                        <h3 className="text-xl font-bold mb-4">
                            Chính Sách Bảo Vệ
                        </h3>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start">
                                <FaCheckCircle className="mt-1 mr-2 text-blue-500 min-w-[16px]" />
                                <span className="flex w-full">
                                    <strong className="w-1/3">
                                        Bảo vệ giá:
                                    </strong>
                                    <span className="w-2/3">
                                        Bù giá khi giảm, thông báo trước 30-45
                                        ngày khi tăng.
                                    </span>
                                </span>
                            </li>
                            <li className="flex items-start">
                                <FaCheckCircle className="mt-1 mr-2 text-blue-500 min-w-[16px]" />
                                <span className="flex w-full">
                                    <strong className="w-1/3">
                                        Bảo vệ khách hàng:
                                    </strong>
                                    <span className="w-2/3">
                                        Chuyển khách lẻ về cho đại lý khu vực.
                                    </span>
                                </span>
                            </li>
                            <li className="flex items-start">
                                <FaCheckCircle className="mt-1 mr-2 text-blue-500 min-w-[16px]" />
                                <span className="flex w-full">
                                    <strong className="w-1/3">
                                        Bảo vệ vùng:
                                    </strong>
                                    <span className="w-2/3">
                                        Độc quyền phân phối tại khu vực quy
                                        hoạch.
                                    </span>
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-emerald-500">
                        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 text-2xl">
                            <FaBullhorn />
                        </div>
                        <h3 className="text-xl font-bold mb-4">
                            Hỗ Trợ Toàn Diện
                        </h3>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start">
                                <FaCheckCircle className="mt-1 mr-2 text-emerald-500 min-w-[16px]" />{' '}
                                Hỗ trợ Catalogue, tờ rơi, Banner, PR trên Web.
                            </li>
                            <li className="flex items-start">
                                <FaCheckCircle className="mt-1 mr-2 text-emerald-500 min-w-[16px]" />{' '}
                                Đào tạo kiến thức sản phẩm và kỹ năng bán hàng.
                            </li>
                            <li className="flex items-start">
                                <FaCheckCircle className="mt-1 mr-2 text-emerald-500 min-w-[16px]" />{' '}
                                Hỗ trợ kỹ thuật 24/7 và đổi trả hàng lỗi trong 7
                                ngày.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl">
                    <div className="mb-6 md:mb-0 md:w-2/3">
                        <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                            <FaHandshake className="text-green-400" /> Chính
                            Sách Công Nợ Linh Hoạt
                        </h3>
                        <p className="text-gray-300">
                            Hỗ trợ hạn mức tín dụng từ{' '}
                            <strong>40% đến 70%</strong> với thời hạn công nợ
                            tối đa 15 ngày khi có bảo lãnh ngân hàng. (Hoặc
                            thanh toán 100% để hưởng ưu đãi tốt nhất).
                        </p>
                    </div>
                    <div className="md:w-1/3 text-right">
                        <a
                            href="#register"
                            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
                        >
                            Nhận Tư Vấn Chi Tiết
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BenefitsSection
