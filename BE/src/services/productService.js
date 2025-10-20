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

const getByCategoryService = async categoryId => {
    const products = await ProductsModel.getProductsByCategory(categoryId)

    if (products.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy sản phẩm nào')
    }

    const ids = products.map(p => p.id)
    const allImages = await ProductImagesModel.getImagesByProductIds(ids)

    // Nhóm theo product_id
    const imagesMap = allImages.reduce((acc, img) => {
        if (!acc[img.product_id]) acc[img.product_id] = []
        acc[img.product_id].push(img)
        return acc
    }, {})

    for (const item of products) {
        const images = imagesMap[item.id] || []

        item.images = images.map(i => {
            const url = i.image_url || ''
            return url.startsWith('http') ? url : '/' + url.replace(/^\/+/, '')
        })
    }

    return products
}
const searchProductService = async name => {
    const products = await ProductsModel.searchProductsByName(name)

    if (products.length == 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy sản phẩm nào trùng khớp'
        )
    }

    const ids = products.map(p => p.id)
    const allImages = await ProductImagesModel.getImagesByProductIds(ids)

    // Nhóm theo product_id
    const imagesMap = allImages.reduce((acc, img) => {
        if (!acc[img.product_id]) acc[img.product_id] = []
        acc[img.product_id].push(img)
        return acc
    }, {})

    for (const item of products) {
        const images = imagesMap[item.id] || []

        item.images = images.map(i => {
            const url = i.image_url || ''
            return url.startsWith('http') ? url : '/' + url.replace(/^\/+/, '')
        })
    }


    return products
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
    getByCategoryService,
    getListProductService,
    searchProductService,
    updateProductService,
    deleteProductService,
}
