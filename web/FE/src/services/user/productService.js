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
        const result = await getListProductCollections({
            limit,
            sort: 'newest',
            slug: 'all',
        })

        const products = result.data

        if (!Array.isArray(products)) {
            console.error('Dữ liệu sản phẩm không phải là một mảng:', products)
            return []
        }

        return products.map(transformProductData)
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy sản phẩm mới nhất:', error)
        throw error
    }
}

export const getPoultryProducts = async limitPerCategory => {
    try {
        const [chickenResult, duckResult] = await Promise.all([
            getListProductCollections({
                slug: 'san-pham-tu-ga',
                limit: limitPerCategory,
            }),
            getListProductCollections({
                slug: 'san-pham-tu-vit',
                limit: limitPerCategory,
            }),
        ])

        const chickenData = Array.isArray(chickenResult.data)
            ? chickenResult.data
            : []
        const duckData = Array.isArray(duckResult.data) ? duckResult.data : []

        const combinedProducts = [...chickenData, ...duckData]

        return combinedProducts.map(transformProductData)
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy sản phẩm gia cầm:', error)
        throw error
    }
}

export const getSeafoodAndFishProducts = async limitPerCategory => {
    try {
        const [seafoodResult, fishResult] = await Promise.all([
            getListProductCollections({
                slug: 'hai-san',
                limit: limitPerCategory,
            }),
            getListProductCollections({
                slug: 'san-pham-tu-ca',
                limit: limitPerCategory,
            }),
        ])

        const seafoodData = Array.isArray(seafoodResult.data)
            ? seafoodResult.data
            : []
        const fishData = Array.isArray(fishResult.data) ? fishResult.data : []

        const combinedProducts = [...seafoodData, ...fishData]

        return combinedProducts.map(transformProductData)
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy sản phẩm hải sản và cá:', error)
        throw error
    }
}

export const getPorkSpecialties = async limit => {
    try {
        const result = await getListProductCollections({
            slug: 'san-pham-tu-heo',
            limit: limit,
        })

        const porkData = result.data

        if (!Array.isArray(porkData)) {
            console.error(
                'Dữ liệu đặc sản từ heo không phải là một mảng:',
                porkData
            )
            return []
        }

        return porkData.map(transformProductData)
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy đặc sản từ heo:', error)
        throw error
    }
}

export const getProductBySlug = async slug => {
    if (!slug) return null
    try {
        const response = await api.get(`/products/by_slug?slug=${slug}`)
        return response.data.data
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm theo slug:', error)
        throw error
    }
}

export const getCommentsByProductSlug = async slug => {
    if (!slug) return []

    try {
        const response = await api.get(`/comments/by_product_slug?slug=${slug}`)
        return response.data.data || []
    } catch (error) {
        console.error('Lỗi khi tải bình luận cho sản phẩm:', error)
        throw error
    }
}

export const getListProductCollections = async ({
    limit = 8,
    offset = 0,
    slug = 'all',
    sort = 'newest',
    minPrice = null,
    maxPrice = null,
} = {}) => {
    try {
        const response = await api.get('/products/list', {
            params: {
                limit,
                offset,
                ...(slug ? { slug } : {}),
                sort,
                ...(minPrice !== null ? { minPrice } : {}),
                ...(maxPrice !== null ? { maxPrice } : {}),
            },
            authRequired: true,
        })
        return response.data
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error)
        throw error
    }
}

export const getListPromotionProducts = async ({
    limit = 8,
    offset = 0,
    sort = 'newest',
    minPrice = null,
    maxPrice = null,
} = {}) => {
    try {
        const response = await api.get('/products/list_promotion', {
            params: {
                limit,
                offset,
                sort,
                ...(minPrice !== null ? { minPrice } : {}),
                ...(maxPrice !== null ? { maxPrice } : {}),
            },
        })
        return response.data
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm khuyến mãi:', error)
        throw error
    }
}

export const getRelatedProducts = async (slug, limit = 8) => {
    if (!slug) return { sameCategory: [], coBought: [] }

    try {
        const response = await api.get('/products/related_by_slug', {
            params: { slug, limit },
        })

        const data = response.data.data || { sameCategory: [], coBought: [] }

        return {
            sameCategory: Array.isArray(data.sameCategory)
                ? data.sameCategory.map(transformProductData)
                : [],
            coBought: Array.isArray(data.coBought)
                ? data.coBought.map(transformProductData)
                : [],
        }
    } catch (error) {
        console.error(
            `Đã xảy ra lỗi khi lấy sản phẩm liên quan cho slug "${slug}":`,
            error
        )
        throw error
    }
}

export const getHotProducts = async (limit = 3) => {
    try {
        const response = await api.get('/products/hot_product', {
            params: { limit },
        })

        return response.data || []
    } catch (error) {
        console.error(`Đã xảy ra lỗi khi lấy sản phẩm hot:`, error)
        throw error
    }
}

export const searchProducts = async (slug, limit = 10) => {
    if (!slug) return []
    try {
        const response = await api.get('/products/search', {
            params: { slug, limit },
        })
        return response.data?.data || []
    } catch (error) {
        console.error(`Đã xảy ra lỗi khi tìm kiếm sản phẩm:`, error)
        throw error
    }
}

export const searchProductsByCategory = async (
    slug,
    keyword = '',
    limit = 10,
    offset = 0
) => {
    if (!slug) return []
    try {
        const response = await api.get('/products/search_by_category', {
            params: { slug, keyword, limit, offset },
        })
        return response.data?.data || []
    } catch (error) {
        console.error(
            `Đã xảy ra lỗi khi tìm kiếm sản phẩm theo category:`,
            error
        )
        throw error
    }
}
