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
        data.minPrice ?? null, // thêm minPrice
        data.maxPrice ?? null  // thêm maxPrice
    )

    if (listProduct.length == 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy sản phẩm nào này'
        )
    }

    const ids = listProduct.map(p => p.id)
    const allImages = await ProductImagesModel.getImagesByProductIds(ids)

    // Nhóm theo product_id
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

export const getPromotionProductService = async (data) => {
    // Chuyển data params sang kiểu phù hợp
    const sort = data.sort || 'newest'
    const limit = data.limit ? parseInt(data.limit, 10) : 50
    const offset = data.offset ? parseInt(data.offset, 10) : 0
    const minPrice = data.minPrice ? parseInt(data.minPrice, 10) : null
    const maxPrice = data.maxPrice ? parseInt(data.maxPrice, 10) : null
    // Lấy danh sách sản phẩm promotion
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

    // Lấy tất cả ảnh theo product_id
    const ids = listProduct.map(p => p.id)
    const allImages = await ProductImagesModel.getImagesByProductIds(ids)

    // Nhóm ảnh theo product_id
    const imagesMap = allImages.reduce((acc, img) => {
        if (!acc[img.product_id]) acc[img.product_id] = []
        acc[img.product_id].push(img)
        return acc
    }, {})

    // Gắn images vào từng sản phẩm
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
const getHotProductService = async (limit) => {
    const products = await ProductsModel.getHotProduct(limit)
    if (!products || (!products.hotProducts?.length && !products.occopProducts?.length)) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm')
    }

    // Lấy tất cả productIds từ cả 2 nhãn
    const productIds = [
        ...products.hotProducts.map(p => p.id),
        ...products.occopProducts.map(p => p.id),
    ].filter(id => id != null)

    const allImages = await ProductImagesModel.getImagesByProductIds(productIds)

    // Hàm gán ảnh cho từng sản phẩm
    const mapImages = (productArray) =>
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

    // const allImages = await ProductImagesModel.getImagesByProductIds([product.id])

    // const images = allImages.map(i => {
    //     const url = i.image_url || ''
    //     return url.startsWith('http') ? url : '/' + url.replace(/^\/+/, '')
    // })

    // product.images = images

    return product
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
    getRelatedBySlugService,
    getHotProductService,
    getPromotionProductService,
    getListProductService,
    updateProductService,
    deleteProductService,
}
