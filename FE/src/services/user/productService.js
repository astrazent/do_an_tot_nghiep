import api from './api'

const transformProductData = product => {
    const rating =
        product.rate_count > 0
            ? Math.round(product.rate_point_total / product.rate_count)
            : 0

    const formatCurrency = priceString => {
        if (!priceString) return null
        const priceNumber = parseFloat(priceString)
        if (isNaN(priceNumber)) return null
        return new Intl.NumberFormat('vi-VN').format(priceNumber) + '₫'
    }

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

export const getPoultryProducts = async limitPerCategory => {
    try {
        const [response1, response2] = await Promise.all([
            api.get(`/products/by_category_slug?slug=san-pham-tu-ga`),
            api.get(`/products/by_category_slug?slug=san-pham-tu-vit`),
        ])

        const poultry1Data = Array.isArray(response1.data.data)
            ? response1.data.data
            : []
        const poultry2Data = Array.isArray(response2.data.data)
            ? response2.data.data
            : []

        const limitedPoultry1 = poultry1Data.slice(0, limitPerCategory)
        const limitedPoultry2 = poultry2Data.slice(0, limitPerCategory)
        const combinedProducts = [...limitedPoultry1, ...limitedPoultry2]

        return combinedProducts.map(transformProductData)
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy sản phẩm gia cầm:', error)
        throw error
    }
}

export const getSeafoodAndFishProducts = async limitPerCategory => {
    try {
        const [seafoodResponse, fishResponse] = await Promise.all([
            api.get(`/products/by_category_slug?slug=hai-san`),
            api.get(`/products/by_category_slug?slug=san-pham-tu-ca`),
        ])

        const seafoodData = Array.isArray(seafoodResponse.data.data)
            ? seafoodResponse.data.data
            : []
        const fishData = Array.isArray(fishResponse.data.data)
            ? fishResponse.data.data
            : []

        const limitedSeafood = seafoodData.slice(0, limitPerCategory)
        const limitedFish = fishData.slice(0, limitPerCategory)
        const combinedProducts = [...limitedSeafood, ...limitedFish]

        return combinedProducts.map(transformProductData)
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy sản phẩm hải sản và cá:', error)
        throw error
    }
}

export const getPorkSpecialties = async limit => {
    try {
        const response = await api.get(
            '/products/by_category_slug?slug=san-pham-tu-heo'
        )

        const porkData = Array.isArray(response.data.data)
            ? response.data.data
            : []
        const limitedProducts = porkData.slice(0, limit)

        return limitedProducts.map(transformProductData)
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

export const getAllProductCollections = async ({
    limit = 10,
    offset = 0,
} = {}) => {
    try {
        const response = await api.get('/products/list', {
            params: {
                limit,
                offset,
            },
        })
        return response.data
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error)
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

export const searchProductsByCategory = async ({ slug }) => {
    try {
        const response = await api.get('/products/by_category_slug', {
            params: { slug },
        })

        const data = response.data.data
        if (!Array.isArray(data)) {
            console.error('Dữ liệu trả về không phải là mảng:', data)
            return []
        }

        return data.map(transformProductData)
    } catch (error) {
        console.error(
            'Đã xảy ra lỗi khi tìm kiếm sản phẩm theo danh mục và giá:',
            error
        )
        throw error
    }
}
