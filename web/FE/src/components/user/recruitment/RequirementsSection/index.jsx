import React from 'react'
import { FaBoxOpen, FaUserTie, FaTruck } from 'react-icons/fa'

const RequirementsSection = () => {
    return (
        <section id="requirements" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="md:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1334&q=80"
                            alt="Kho hàng"
                            className="rounded-2xl shadow-2xl"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            Điều Kiện Trở Thành Đại Lý
                        </h2>
                        <div className="space-y-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
                                        <FaBoxOpen className="text-xl" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-bold text-gray-900">
                                        Cơ sở vật chất
                                    </h4>
                                    <p className="mt-1 text-gray-600">
                                        Có mặt bằng kinh doanh, kho lạnh hoặc tủ
                                        đông đảm bảo vệ sinh ATTT.
                                    </p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
                                        <FaUserTie className="text-xl" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-bold text-gray-900">
                                        Cam kết doanh số
                                    </h4>
                                    <p className="mt-1 text-gray-600">
                                        Cam kết nhập đơn hàng & doanh số
                                        tháng/quý tùy thuộc vào khu vực đăng ký.
                                    </p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
                                        <FaTruck className="text-xl" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-bold text-gray-900">
                                        Năng lực vận hành
                                    </h4>
                                    <p className="mt-1 text-gray-600">
                                        Chủ động vận chuyển (được hỗ trợ phí tùy
                                        chính sách), chủ động phát triển thị
                                        trường và không bán phá giá.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RequirementsSection
