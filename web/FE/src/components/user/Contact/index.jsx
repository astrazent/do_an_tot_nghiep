import React, { useState } from 'react'
import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaClock,
    FaPaperPlane,
} from 'react-icons/fa'

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    })

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = e => {
        e.preventDefault()

        console.log('Form data:', formData)
        alert('Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn.')
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-7xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col lg:flex-row">
                <div className="lg:w-5/12 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-10 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 -left-10 w-40 h-40 bg-pink-500 opacity-10 rounded-full blur-2xl"></div>

                    <div>
                        <h2 className="text-3xl font-bold mb-2 tracking-wide">
                            Thông tin liên hệ
                        </h2>
                        <p className="text-slate-300 mb-8 text-sm">
                            Hãy liên hệ với chúng tôi để được tư vấn và hỗ trợ
                            tốt nhất về các sản phẩm Bếp Sạch Việt.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start space-x-4 group">
                                <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300 shrink-0">
                                    <FaMapMarkerAlt className="text-xl text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-emerald-400">
                                        Địa chỉ liên hệ
                                    </h3>
                                    <p className="text-slate-200 mt-1 leading-relaxed text-sm">
                                        Ngõ 91 Tam Khương, nhà số 2.
                                    </p>
                                    <p className="text-slate-400 text-xs mt-1">
                                        (Số 59 ngõ 354/137 Đường Trường Chinh,
                                        P. Khương Thượng, Q. Đống Đa, HN)
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 group">
                                <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300 shrink-0">
                                    <FaPhoneAlt className="text-xl text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-emerald-400">
                                        Số điện thoại
                                    </h3>
                                    <p className="text-slate-200 mt-1 hover:text-white transition-colors">
                                        <a href="tel:0868839655">
                                            0868 839 655
                                        </a>
                                    </p>
                                    <p className="text-slate-200 mt-1 hover:text-white transition-colors">
                                        <a href="tel:0963538357">
                                            0963 538 357
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 group">
                                <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300 shrink-0">
                                    <FaEnvelope className="text-xl text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-emerald-400">
                                        Email
                                    </h3>
                                    <p className="text-slate-200 mt-1 break-all">
                                        bepsachviet@gmail.com
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 group">
                                <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300 shrink-0">
                                    <FaClock className="text-xl text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-emerald-400">
                                        Giờ làm việc
                                    </h3>
                                    <p className="text-slate-200 mt-1">
                                        Thứ 2 – Chủ nhật: 9:00 – 18:00
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/10">
                        <p className="text-xs text-slate-400 text-center lg:text-left">
                            © 2024 Bếp Sạch Việt. All rights reserved.
                        </p>
                    </div>
                </div>

                <div className="lg:w-7/12 p-8 md:p-12 relative">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            Gửi tin nhắn cho chúng tôi
                        </h2>
                        <p className="text-gray-500">
                            Vui lòng điền vào biểu mẫu dưới đây, chúng tôi sẽ
                            phản hồi sớm nhất có thể.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="peer w-full h-12 border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-emerald-600 transition-colors bg-transparent"
                                    placeholder="Họ và tên"
                                />
                                <label
                                    htmlFor="name"
                                    className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                                >
                                    Họ và tên
                                </label>
                            </div>

                            <div className="relative">
                                <input
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="peer w-full h-12 border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-emerald-600 transition-colors bg-transparent"
                                    placeholder="Điện thoại"
                                />
                                <label
                                    htmlFor="phone"
                                    className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                                >
                                    Điện thoại*
                                </label>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="peer w-full h-12 border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-emerald-600 transition-colors bg-transparent"
                                placeholder="Email"
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                            >
                                Email*
                            </label>
                        </div>

                        <div className="relative">
                            <textarea
                                name="message"
                                id="message"
                                required
                                rows="4"
                                value={formData.message}
                                onChange={handleChange}
                                className="peer w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-emerald-600 transition-colors bg-transparent resize-none py-2"
                                placeholder="Nội dung"
                            ></textarea>
                            <label
                                htmlFor="message"
                                className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                            >
                                Nhập nội dung*
                            </label>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-semibold rounded-full shadow-lg hover:bg-emerald-700 hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <span>Gửi tin nhắn</span>
                                <FaPaperPlane className="text-sm" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 rounded-2xl overflow-hidden shadow-inner border border-gray-200 h-64 w-full">
                        <iframe
                            title="Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.588079075798!2d105.8260023!3d21.0091419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac8066f81e37%3A0x6b9e2c6576f9d45e!2zOTEgTmcuIFRhbSBLaMawxrFuZywgS2jGsMahbmcgVGjGsOG7o25nLCDEkOG7kW5nIMSQYSwgSMOgIE7hu5lpLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactPage
