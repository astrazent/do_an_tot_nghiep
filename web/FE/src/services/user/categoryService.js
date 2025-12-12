import api from './api'
import { formatCurrency } from '~/utils/formatCurrency'

const transformProductData = product => {
    const rating =
        product.rate_count > 0
            ? Math.round(product.rate_point_total / product.rate_count)
            : 0

    return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: formatCurrency(product.price),
        oldPrice: formatCurrency(product.origin_price),
        image:
            product.images && product.images.length > 0
                ? product.images[0]
                : null,
        ocop: product.ocop_rating || 0,
        rating,
        reviewCount: product.rate_count,
        createdAt: product.created_at,
    }
}

export const getNewestProducts = async limit => {
    try {
        const response = await api.get('/products/list')
        const allProducts = response.data.data

        if (!Array.isArray(allProducts)) {
            console.error(
                'Dữ liệu sản phẩm không phải là một mảng:',
                allProducts
            )
            return []
        }
        const sortedProducts = allProducts.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
        const limitedProducts = sortedProducts.slice(0, limit)

        return limitedProducts.map(transformProductData)
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy sản phẩm mới nhất:', error)
        throw error
    }
}

export const getAllCategories = async () => {
    try {
        const response = await api.get('/category/list')
        const allCategories = response.data.data

        if (!Array.isArray(allCategories)) {
            console.error(
                'Dữ liệu danh mục không phải là một mảng:',
                allCategories
            )
            return []
        }

        return allCategories
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy danh sách danh mục:', error)
        throw error
    }
}
