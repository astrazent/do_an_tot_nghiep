import React from 'react'
import { NavLink } from 'react-router-dom'

// Import ảnh từ assets
import chaVit from '~/assets/image/user/recruitment/chaVit.jpg'
import mocVit from '~/assets/image/user/recruitment/mocVit.jpg'
import gaXuMuoi from '~/assets/image/user/recruitment/gaXuMuoi.jpg'
import chanVit from '~/assets/image/user/recruitment/chanVit.jpg'
import vitXiDau from '~/assets/image/user/recruitment/vitXiDau.jpg'
import taiHeo from '~/assets/image/user/recruitment/taiHeo.jpg'
import chaSun from '~/assets/image/user/recruitment/chaSun.jpg'
import dongLanh from '~/assets/image/user/recruitment/dongLanh.jpg'

const ProductList = () => {
    const products = [
        { name: 'Chả Vịt Vân Đình', desc: 'Đậm đà hương vị truyền thống', icon: '🦆', bg: chaVit, slug: 'cha-vit-thuy-hanh' },
        { name: 'Mọc Vịt Vân Đình', desc: 'Dai giòn, thơm ngon khó cưỡng', icon: '🍲', bg: mocVit, slug: 'moc-vit' },
        { name: 'Gà Ủ Muối / Xì Dầu', desc: 'Da giòn, thịt ngọt, đậm vị', icon: '🍗', bg: gaXuMuoi, slug: 'ga-u-xi-dau' },
        { name: 'Chân Vịt Rút Xương', desc: 'Đồ nhắm tuyệt hảo, tiện lợi', icon: '🥡', bg: chanVit, slug: 'chan-vit-rut-xuong-u-muoi' },
        { name: 'Vịt Ủ Xì Dầu', desc: 'Hương vị đặc biệt, thơm lừng', icon: '🥘', bg: vitXiDau, slug: 'vit-u-xi-dau' },
        { name: 'Tai Heo Ủ Muối', desc: 'Giòn sần sật, vị ngon lạ miệng', icon: '🥓', bg: taiHeo, slug: 'tai-heo-u-muoi' },
        { name: 'Chả Sụn / Chả Chân Vịt', desc: 'Đặc sản độc đáo vùng miền', icon: '🍢', bg: chaSun, slug: 'cha-chan-vit' },
        { name: 'Thực Phẩm Đông Lạnh', desc: 'Và nhiều sản phẩm sắp ra mắt', icon: '❄️', bg: dongLanh, slug: 'ngan-xong-khoi' },
    ]

    return (
        <section id="products" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Danh Mục Sản Phẩm Độc Quyền
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Chúng tôi tự hào là nhà phân phối <span className="text-green-600 font-semibold">ĐỘC QUYỀN</span> các dòng
                        thực phẩm đặc sản vùng miền cao cấp, đảm bảo vệ sinh an
                        toàn thực phẩm.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((item, index) => (
                        <NavLink 
                            to={`/product/${item.slug}`} 
                            key={index} 
                            className="relative rounded-xl p-6 hover:shadow-xl transition duration-300 border border-green-100 overflow-hidden"
                            style={{ 
                                backgroundImage: `url('${item.bg}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="absolute inset-0 bg-green-50/70 group-hover:bg-green-50/30 transition duration-300"></div>
                            <div className="relative z-10 text-4xl mb-4 group-hover:scale-110 transition duration-300">
                                {item.icon}
                            </div>
                            <h3 className="relative z-10 text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                            <p className="relative z-10 text-gray-600 text-sm">{item.desc}</p>
                        </NavLink>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ProductList
