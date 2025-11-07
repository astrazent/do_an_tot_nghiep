import React from 'react'
import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaFacebookF,
    FaChevronDown,
} from 'react-icons/fa'
import bannerFooter from '~/assets/image/shared/layout/footer/banner-fb-footer.png'
import logo from '~/assets/icon/logo/brand-logo.png'

const menuLinks = [
    { title: 'Trang chủ', href: '#' },
    { title: 'Giới thiệu', href: '#' },
    { title: 'Sản phẩm', href: '#', hasDropdown: true },
    { title: 'Tin tức', href: '#' },
    { title: 'Tuyển dụng', href: '#' },
    { title: 'Liên hệ', href: '#' },
]

const Footer = () => {
    return (
        <footer className="bg-green-800 text-white">
            <div className="container mx-auto px-[134px] py-12">
                <div className="grid grid-cols-1 md:grid-cols-[200px_auto_auto_auto] gap-10">
                    <div className="space-y-4">
                        <div className="w-[150px]">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4 text-sm">
                            <h3 className="text-lg font-bold uppercase tracking-wider">
                                Liên hệ
                            </h3>
                            <p className="text-gray-300">
                                Chúng tôi chuyên cung cấp các đặc sản vùng miền
                            </p>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start">
                                    <FaMapMarkerAlt className="w-4 h-4 mr-3 mt-1 text-yellow-400 flex-shrink-0" />
                                    <span>
                                        91 Tam Khương, nhà số 2, P. Khương
                                        thượng, Q. Đống đa, HN.
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    <FaPhoneAlt className="w-4 h-4 mr-3 text-yellow-400" />
                                    <span>
                                        Hotline: 0868839655 | 0963538357
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    <FaEnvelope className="w-4 h-4 mr-3 text-yellow-400" />
                                    <span>Email: bepsachviet@gmail.com</span>
                                </li>
                                <li className="flex items-start">
                                    <FaFacebookF className="w-4 h-4 mr-3 mt-1 text-yellow-400 flex-shrink-0" />
                                    <span>
                                        Facebook: fb.com/bepsachvietOfficial
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold uppercase tracking-wider">
                                Kết nối với Bếp Sạch Việt
                            </h3>
                            <div className="max-w-[260px]">
                                <a
                                    href="https://www.facebook.com/BepsachvietOfficial"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <img
                                        src={bannerFooter}
                                        alt="Facebook Page Widget"
                                        className="h-[130px] object-cover object-left hover:opacity-90 transition-opacity"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 text-sm">
                        <h3 className="text-lg font-bold uppercase tracking-wider">
                            Danh mục
                        </h3>
                        <ul className="space-y-3">
                            {menuLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                                    >
                                        <span className="w-1.5 h-1.5 bg-white rounded-full mr-3"></span>
                                        {link.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4 text-sm">
                        <h3 className="text-lg font-bold uppercase tracking-wider">
                            Hỗ trợ
                        </h3>
                        <ul className="space-y-3 text-gray-300">
                            <li>Hướng dẫn mua hàng</li>
                            <li>Chính sách bảo hành</li>
                            <li>Chính sách đổi trả</li>
                            <li>Điều khoản dịch vụ</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-green-900 py-4">
                <div className="container mx-auto px-[134px] flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-2 md:space-y-0">
                    <p className="text-xs text-gray-400">
                        Copyright 2025 © Giao diện Bếp sạch Việt
                    </p>

                    <div className="flex space-x-4 text-xs">
                        <a href="#" className="hover:text-white">
                            TRANG CHỦ
                        </a>
                        <a href="#" className="hover:text-white">
                            GIỚI THIỆU
                        </a>
                        <a href="#" className="hover:text-white">
                            SẢN PHẨM
                        </a>
                        <a href="#" className="hover:text-white">
                            LIÊN HỆ
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
