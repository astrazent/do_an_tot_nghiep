import { ProductImagesModel } from '~/models/productImageModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const getImageForProduct = async productId => {
    const images = await ProductImagesModel.getImagesByProduct(productId)
    if (!images || images.length === 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy ảnh của sản phẩm này'
        )
    }
    return images
}

const createProductImage = async (data, imageUrl) => {
    const image = await ProductImagesModel.createProductImage({
        product_id: data.product_id,
        image_url: imageUrl[0],
        is_main: data.is_main || 0,
        alt_text: data.alt_text || null,
    })
    return image
}

const updateProductImage = async (imageId, data) => {
    const image = await ProductImagesModel.getProductImageById(imageId)
    if (!image) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy ảnh của sản phẩm này'
        )
    }

    const result = await ProductImagesModel.setMainImage(imageId)
    return result
}

const deleteProductImage = async imageId => {
    const image = await ProductImagesModel.getProductImageById(imageId)
    if (!image) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy ảnh của sản phẩm này'
        )
    }

    await ProductImagesModel.deleteProductImage(imageId)
    return { message: 'Xóa ảnh sản phẩm thành công' }
}

export const productImageService = {
    getImageForProduct,
    updateProductImage,
    deleteProductImage,
    createProductImage,
}
