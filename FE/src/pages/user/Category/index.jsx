import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductList from '~/components/user/product/ProductList'
import taiHeoUTuong from '~/assets/image/shared/product/tai-heo-u-tuong.png'
import SortBar from '~/components/shared/SortBar'

const PRODUCTS_PER_LOAD = 8

const CATEGORY_DATA = {
    sale: { title: 'Sản phẩm khuyến mãi' },
    'san-pham-ocop-3-sao': { title: 'Sản phẩm OCOP 3 Sao' },
    'san-pham-ocop-4-sao': { title: 'Sản phẩm OCOP 4 Sao' },
    'san-pham-tu-vit': { title: 'Sản phẩm từ vịt' },
}
const sampleProducts = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    image: taiHeoUTuong,
    name: i % 4 === 0 ? `Sản phẩm vịt ${i + 1}` : `Tai heo ủ tương ${i + 1}`,
    price: `${95 + i * 2}.000₫`,
    oldPrice: i % 5 === 0 ? `${105 + i * 2}.000₫` : undefined,
    ocop: Math.random() > 0.5 ? 3 : 4,
    rating: Math.floor(Math.random() * 5) + 1,
    reviewCount: Math.floor(Math.random() * 100),
    isPromotion: Math.random() > 0.7,
    categorySlug: i % 4 === 0 ? 'san-pham-tu-vit' : 'san-pham-tu-heo',
}))

const parsePrice = priceString => {
    return parseInt(String(priceString).replace(/[^0-9]/g, ''), 10)
}

function ProductLists() {
    const { slug } = useParams()
    const currentSlug = slug || 'all'

    const [search, setSearch] = useState('')
    const [productsToShow, setProductsToShow] = useState(PRODUCTS_PER_LOAD)
    const [sortBy, setSortBy] = useState('newest')
    const title = CATEGORY_DATA[currentSlug]?.title || 'Tất cả sản phẩm'

    useEffect(() => {
        setProductsToShow(PRODUCTS_PER_LOAD)
    }, [search, sortBy, currentSlug])

    const finalProducts = sampleProducts
        .filter(product => {
            switch (currentSlug) {
                case 'sale':
                    return product.isPromotion
                case 'san-pham-ocop-3-sao':
                    return product.ocop === 3
                case 'san-pham-ocop-4-sao':
                    return product.ocop === 4
                case 'san-pham-tu-vit':
                    return product.categorySlug === 'san-pham-tu-vit'
                case 'all':
                default:
                    return true
            }
        })
        .filter(product => {
            return product.name.toLowerCase().includes(search.toLowerCase())
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return parsePrice(a.price) - parsePrice(b.price)
                case 'price-desc':
                    return parsePrice(b.price) - parsePrice(a.price)
                case 'rating-desc':
                    return b.rating - a.rating
                case 'rating-asc':
                    return a.rating - b.rating
                case 'newest':
                default:
                    return b.id - a.id
            }
        })

    const productsToDisplay = finalProducts.slice(0, productsToShow)
    const hasMoreProducts = productsToShow < finalProducts.length

    const handleLoadMore = () => {
        setProductsToShow(prev => prev + PRODUCTS_PER_LOAD)
    }

    return (
        <div className="App">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-green-800 uppercase">
                    {title}
                </h2>
                {title && (
                    <div className="mt-2 w-24 h-1 bg-green-500 mx-auto"></div>
                )}
            </div>
            <div className="container mx-auto space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <input
                        type="text"
                        placeholder="Tìm sản phẩm..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border border-green-500 rounded-full py-2 pl-10 pr-4 w-full md:w-1/2 focus:outline-none focus:ring-1 focus:ring-green-400"
                    />
                    <div className="flex-shrink-0 mr-5">
                        <p className="text-md font-semibold text-gray-600">
                            Tổng có {finalProducts.length} sản phẩm
                        </p>
                    </div>
                </div>
                <SortBar sortBy={sortBy} onSortChange={setSortBy} />
            </div>

            <div className="mt-8">
                <ProductList products={productsToDisplay} />
            </div>

            {hasMoreProducts && (
                <div className="text-center mt-8">
                    <button
                        onClick={handleLoadMore}
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300 shadow-md"
                    >
                        Xem thêm sản phẩm (
                        {finalProducts.length - productsToShow} sản phẩm còn
                        lại)
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProductLists
