import React, { useState } from 'react'
import { FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        area: '',
        message: '',
    })

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = e => {
        e.preventDefault()
        alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ lại sớm nhất.')
    }

    return (
        <section id="register" className="py-20 bg-green-50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                    <div className="md:w-1/2 bg-green-700 p-12 text-white flex flex-col justify-center">
                        <h2 className="text-3xl font-bold mb-4">Đăng Ký Làm Đại Lý</h2>
                        <p className="mb-8 opacity-90">
                            Hãy để lại thông tin, bộ phận kinh doanh của Bếp Sạch Việt sẽ liên hệ tư vấn chính sách tốt nhất cho khu vực của bạn.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3"><FaPhoneAlt /> <span>Hotline: 09xx.xxx.xxx</span></div>
                            <div className="flex items-center gap-3"><MdEmail /> <span>lienhe@bepsachviet.com</span></div>
                            <div className="flex items-center gap-3"><FaMapMarkerAlt /> <span>Hà Nội, Việt Nam</span></div>
                        </div>
                    </div>

                    <div className="md:w-1/2 p-12">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Họ và tên</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition" placeholder="Nguyễn Văn A" required />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Số điện thoại</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition" placeholder="0912..." required />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Khu vực đăng ký</label>
                                <input type="text" name="area" value={formData.area} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition" placeholder="Tỉnh / Thành phố" />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Ghi chú thêm</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition h-24" placeholder="Tôi có sẵn kho lạnh..."></textarea>
                            </div>
                            <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition transform hover:-translate-y-1">GỬI ĐĂNG KÝ</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RegistrationForm