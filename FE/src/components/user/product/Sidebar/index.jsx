import React from 'react'
import { FaSearch, FaChevronDown } from 'react-icons/fa'

//Import các hình ảnh sản phẩm
import chanVitRutXuongUXiDau from '~/assets/image/shared/product/chan-vit-rut-xuong-u-xi-dau.png'
import pateGanVit from '~/assets/image/shared/product/pate-gan-vit.jpg'
import gaDongTaoUMuoi from '~/assets/image/shared/product/dong-tao-u-muoi.png'
import gaUMuoi from '~/assets/image/shared/product/ga-u-muoi.png'
import gaUXiDau from '~/assets/image/shared/product/ga-u-xi-dau.jpg'

//Import component ProductListSection từ file riêng
import ProductListSection from '../ProductListSection'

const productCategories = [
    'Sản phẩm từ vịt',
    'Sản phẩm từ gà',
    'Các loại hạt',
    'Sản phẩm từ heo',
    'Sản phẩm từ cá',
    'Sản phẩm từ ngan',
    'Hải sản',
    'Các loại ruốc',
    'Thực phẩm khác',
]

const hotProductsData = [
    { id: 1, name: 'Pate gan vịt', price: '180,000 VND', imageUrl: pateGanVit },
    {
        id: 2,
        name: 'Gà Đông Tảo ủ muối',
        price: '350,000 VND',
        imageUrl: gaDongTaoUMuoi,
    },
    {
        id: 3,
        name: 'Combo Gà Đông Tảo - Sale sốc',
        imageUrl: gaDongTaoUMuoi,
        price: '450.000đ',
        discountPrice: '360.000đ',
    },
    { id: 4, name: 'Gà ủ xì dầu', price: '280,000 VND', imageUrl: gaUXiDau },
    { id: 5, name: 'Pate gan vịt', price: '180,000 VND', imageUrl: pateGanVit },
    {
        id: 6,
        name: 'Gà Đông Tảo ủ muối',
        price: '350,000 VND',
        imageUrl: gaDongTaoUMuoi,
    },
    { id: 7, name: 'Gà ủ xì dầu', price: '280,000 VND', imageUrl: gaUXiDau },
]

const featuredProductsData = [
    {
        id: 1,
        name: 'Chân Vịt Rút Xương',
        price: '150,000 VND',
        imageUrl: chanVitRutXuongUXiDau,
    },
    {
        id: 2,
        name: 'Pate gan vịt - Mua 1 tặng 1',
        imageUrl: pateGanVit,
        price: '120.000đ',
        discountPrice: '120.000đ',
    },
    { id: 3, name: 'Gà ủ muối', price: '260,000 VND', imageUrl: gaUMuoi },
    {
        id: 4,
        name: 'Hạt Điều Rang Củi',
        price: '250,000 VND',
        imageUrl: gaDongTaoUMuoi,
    },
    { id: 5, name: 'Cá Cơm Sấy Giòn', price: '95,000 VND', imageUrl: gaUMuoi },
    {
        id: 6,
        name: 'Combo Gà Đông Tảo - Sale sốc',
        imageUrl: gaDongTaoUMuoi,
        price: '450.000đ',
        discountPrice: '360.000đ',
    },
]

const priceRanges = [
    '0 VND',
    '100,000 VND',
    '200,000 VND',
    '500,000 VND',
    '1,000,000 VND',
]

const Sidebar = ({
    sections: {
        search = true,
        categories = true,
        featured = true,
        hot = true,
        isPromotion = true,
    } = {},
} = {}) => {
    return (
        <aside className="w-full max-w-xs rounded-lg p-4 font-sans">
            {search && (
                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase pb-2 border-b">
                        Tìm kiếm
                    </h3>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-2">
                                Danh mục
                            </label>
                            <div className="relative">
                                <select className="w-full p-2 border border-gray-300 rounded-md bg-white appearance-none pr-8">
                                    <option>Thời trang nam</option>
                                    <option>Thời trang nữ</option>
                                    <option>Quần áo gia đình</option>
                                </select>
                                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-2">
                                Khoảng giá
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <select className="w-full p-2 border border-gray-300 rounded-md bg-white appearance-none pr-8">
                                        {priceRanges.map(price => (
                                            <option key={price}>{price}</option>
                                        ))}
                                    </select>
                                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                                <span className="text-gray-500">đến</span>
                                <div className="relative flex-1">
                                    <select className="w-full p-2 border border-gray-300 rounded-md bg-white appearance-none pr-8">
                                        {priceRanges.map(price => (
                                            <option key={price}>{price}</option>
                                        ))}
                                    </select>
                                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-green-600 text-white font-bold py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors">
                            <FaSearch />
                            TÌM KIẾM
                        </button>
                    </div>
                </div>
            )}

            {categories && (
                <div className="mt-8">
                    <h3 className="text-sm font-bold text-gray-500 uppercase pb-2 border-b">
                        Danh mục sản phẩm
                    </h3>
                    <div className="mt-2">
                        <ul>
                            {productCategories.map((category, index) => (
                                <li key={index}>
                                    <a
                                        href="#"
                                        className="block p-3 text-sm text-gray-600 border-b hover:bg-green-50 hover:text-green-700 transition-colors"
                                    >
                                        {category}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {featured && (
                <ProductListSection
                    title="Có thể bạn sẽ thích"
                    products={featuredProductsData}
                    isPromotion={isPromotion}
                />
            )}

            {hot && (
                <ProductListSection
                    title="Sản phẩm nổi bật"
                    products={hotProductsData}
                    isPromotion={isPromotion}
                />
            )}
        </aside>
    )
}

export default Sidebar
