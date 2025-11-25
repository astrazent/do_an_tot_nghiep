import { StatusCodes } from 'http-status-codes'
import { productImageService } from '~/services/productImageService'

const getImageForProduct = async (req, res, next) => {
    try {
        const data = await productImageService.getImageForProduct(
            req.query.productId
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy ảnh của sản phẩm thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const createProductImage = async (req, res, next) => {
    try {
        const data = await productImageService.createProductImage(
            req.body,
            req.uploadedImageUrls
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy ảnh của sản phẩm thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}


const updateProductImage = async (req, res, next) => {
    try {
        const data = await productImageService.updateProductImage(
            req.params.imageId,
            req.body
        )
        return res.status(StatusCodes.OK).json({
            message: "Cập nhật ảnh thành công",
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deleteProductImage = async (req, res, next) => {
    try {
        const data = await productImageService.deleteProductImage(
            req.query.imageId,
        )
        return res.status(StatusCodes.OK).json({
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const productImageController = {
    getImageForProduct,
    updateProductImage,
    deleteProductImage,
    createProductImage
}
