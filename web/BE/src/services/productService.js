import { ProductsModel } from '~/models/productModel'
import { ProductImagesModel } from '~/models/productImageModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createProductService = async data => {
    const product = await ProductsModel.createProduct(data)

    return product
}

const getByIdProductService = async productId => {
    const product = await ProductsModel.getProductById(productId)

    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm này')
    }

    return product
}

const getListProductService = async data => {
    const listProduct = await ProductsModel.listProducts(
        data.limit,
        data.offset,
        data.slug,
        data.sort,
        data.minPrice ?? null,
        data.maxPrice ?? null
    )

    if (listProduct.length == 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy sản phẩm nào này'
        )
    }

    const ids = listProduct.map(p => p.id)
    const allImages = await ProductImagesModel.getImagesByProductIds(ids)

    const imagesMap = allImages.reduce((acc, img) => {
        if (!acc[img.product_id]) acc[img.product_id] = []
        acc[img.product_id].push(img)
        return acc
    }, {})

    for (const item of listProduct) {
        const images = imagesMap[item.id] || []

        item.images = images.map(i => {
            const url = i.image_url || ''
            return url.startsWith('http') ? url : '/' + url.replace(/^\/+/, '')
        })
    }

    return listProduct
}

const getListProductChatBotService = async data => {
    const listProduct = await ProductsModel.getListProductChatBot(
        data.limit,
        data.offset
    )

    if (listProduct.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm nào')
    }
    return listProduct
}

export const getPromotionProductService = async data => {
    const sort = data.sort || 'newest'
    const limit = data.limit ? parseInt(data.limit, 10) : 50
    const offset = data.offset ? parseInt(data.offset, 10) : 0
    const minPrice = data.minPrice ? parseInt(data.minPrice, 10) : null
    const maxPrice = data.maxPrice ? parseInt(data.maxPrice, 10) : null

    const listProduct = await ProductsModel.listPromotionProducts({
        sort,
        limit,
        offset,
        minPrice,
        maxPrice,
    })

    if (!listProduct || listProduct.length === 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy sản phẩm khuyến mãi nào'
        )
    }

    const ids = listProduct.map(p => p.id)
    const allImages = await ProductImagesModel.getImagesByProductIds(ids)

    const imagesMap = allImages.reduce((acc, img) => {
        if (!acc[img.product_id]) acc[img.product_id] = []
        acc[img.product_id].push(img)
        return acc
    }, {})

    for (const product of listProduct) {
        const images = imagesMap[product.id] || []
        product.images = images.map(i => {
            const url = i.image_url || ''
            return url.startsWith('http') ? url : '/' + url.replace(/^\/+/, '')
        })
    }

    return listProduct
}

const getBySlugService = async slug => {
    const product = await ProductsModel.getProductBySlug(slug)

    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm')
    }

    const allImages = await ProductImagesModel.getImagesByProductIds([
        product.id,
    ])

    const images = allImages.map(i => {
        const url = i.image_url || ''
        return url.startsWith('http') ? url : '/' + url.replace(/^\/+/, '')
    })

    product.images = images

    return product
}
const getHotProductService = async limit => {
    const products = await ProductsModel.getHotProduct(limit)
    if (
        !products ||
        (!products.hotProducts?.length && !products.occopProducts?.length)
    ) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm')
    }

    const productIds = [
        ...products.hotProducts.map(p => p.id),
        ...products.occopProducts.map(p => p.id),
    ].filter(id => id != null)

    const allImages = await ProductImagesModel.getImagesByProductIds(productIds)

    const mapImages = productArray =>
        productArray.map(p => {
            const images = allImages
                .filter(i => i.product_id === p.id)
                .map(i => {
                    const url = i.image_url || ''
                    return url.startsWith('http')
                        ? url
                        : '/' + url.replace(/^\/+/, '')
                })
            return { ...p, images }
        })

    return {
        hotProducts: mapImages(products.hotProducts),
        occopProducts: mapImages(products.occopProducts),
    }
}
const getRelatedBySlugService = async slug => {
    const product = await ProductsModel.getRelatedBySlug(slug)
    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm')
    }

    return product
}

const getSearchProductService = async (slug, limit = 10) => {
    const products = await ProductsModel.getSearchProduct(slug, limit)

    if (!products || products.length === 0) {
        return []
    }

    const productIds = products.map(p => p.id).filter(id => id != null)

    if (productIds.length === 0) {
        return products.map(p => ({ ...p, images: [] }))
    }

    const allImages = await ProductImagesModel.getImagesByProductIds(productIds)

    const productsWithImages = products.map(p => {
        const images = allImages
            .filter(i => i.product_id === p.id && i.is_main === 1)
            .map(i => {
                const url = i.image_url || ''
                return url.startsWith('http')
                    ? url
                    : '/' + url.replace(/^\/+/, '')
            })
        return { ...p, images }
    })

    return productsWithImages
}

const getSearchByCategoryService = async (
    categorySlug,
    keyword = '',
    limit = 10,
    offset = 0
) => {
    if (!categorySlug) return []

    const products = await ProductsModel.getSearchByCategory(
        categorySlug,
        keyword,
        Number(limit),
        Number(offset)
    )

    if (!products || products.length === 0) {
        return []
    }

    const productIds = products.map(p => p.id).filter(id => id != null)

    if (productIds.length === 0) {
        return products.map(p => ({ ...p, images: [] }))
    }

    const allImages = await ProductImagesModel.getImagesByProductIds(productIds)

    const imagesMap = allImages.reduce((acc, img) => {
        if (!acc[img.product_id]) acc[img.product_id] = []
        acc[img.product_id].push(img)
        return acc
    }, {})

    const productsWithImages = products.map(p => {
        const images = (imagesMap[p.id] || []).map(i => {
            const url = i.image_url || ''
            return url.startsWith('http') ? url : '/' + url.replace(/^\/+/, '')
        })
        return { ...p, images }
    })

    return productsWithImages
}

const updateProductService = async (productId, data) => {
    const product = await ProductsModel.getProductById(productId)

    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm này')
    }

    const updateProduct = await ProductsModel.updateProduct(productId, data)

    return updateProduct
}

const deleteProductService = async productId => {
    const product = await ProductsModel.getProductById(productId)

    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm này')
    }

    await ProductsModel.deleteProduct(productId)

    return { message: 'Xóa sản phẩm thành công' }
}

export const productService = {
    createProductService,
    getByIdProductService,
    getBySlugService,
    getSearchProductService,
    getSearchByCategoryService,
    getRelatedBySlugService,
    getHotProductService,
    getPromotionProductService,
    getListProductService,
    getListProductChatBotService,
    updateProductService,
    deleteProductService,
}
