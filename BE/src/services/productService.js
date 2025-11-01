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
        data.offset
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
const getByCategorySlugService = async slug => {
    const products = await ProductsModel.getProductsByCategorySlug(slug)
    if (!products || products.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm')
    }

    // Lấy tất cả productIds để query ảnh
    const productIds = products.map(p => p.id).filter(id => id != null)

    const allImages = await ProductImagesModel.getImagesByProductIds(productIds)

    // Gán ảnh cho từng sản phẩm
    const productsWithImages = products.map(p => {
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

    return productsWithImages
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
    getByCategorySlugService,
    getRelatedBySlugService,
    getListProductService,
    updateProductService,
    deleteProductService,
}
