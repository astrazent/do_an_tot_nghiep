import ErrorServer from '~/utils/ErrorServer'
import { productService } from '~/services/productService'
import { StatusCodes } from 'http-status-codes'

const createProduct = async (req, res, next) => {
    try {
        const data = await productService.createProductService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Sản phẩm đã được tạo thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getByIdProduct = async (req, res, next) => {
    try {
        const data = await productService.getByIdProductService(req.query.productId)
        return res.status(StatusCodes.OK).json({
            message: 'Thông tin sản phẩm đã được lấy thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getListProduct = async (req, res, next) => {
    try {
        const data = await productService.getListProductService(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Danh sách sản phẩm đã được lấy thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getBySlug = async (req, res, next) => {
    try {
        const data = await productService.getBySlugService(req.query.slug)
        return res.status(StatusCodes.OK).json({
            message: 'Sản phẩm theo slug đã được lấy thành công',
            data,
        })
    } catch (error) {
        console.error('Lỗi trong getBySlug:', error)
        return ErrorServer(error, req, res, next)
    }
}

const getByCategorySlug = async (req, res, next) => {
    try {
        const data = await productService.getByCategorySlugService(req.query.slug)
        return res.status(StatusCodes.OK).json({
            message: 'Danh sách sản phẩm thuộc danh mục đã được lấy thành công',
            data,
        })
    } catch (error) {
        console.error('Lỗi trong getByCategorySlug:', error)
        return ErrorServer(error, req, res, next)
    }
}

const getRelatedBySlug = async (req, res, next) => {
    try {
        const data = await productService.getRelatedBySlugService(req.query.slug)
        return res.status(StatusCodes.OK).json({
            message: 'Danh sách sản phẩm liên quan đã được lấy thành công',
            data,
        })
    } catch (error) {
        console.error('Lỗi trong getRelatedBySlug:', error)
        return ErrorServer(error, req, res, next)
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const data = await productService.updateProductService(req.query.productId, req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Thông tin sản phẩm đã được cập nhật thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const data = await productService.deleteProductService(req.query.productId)
        return res.status(StatusCodes.OK).json({
            message: 'Sản phẩm đã được xóa thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

export const productController = {
    getByIdProduct,
    getListProduct,
    getBySlug,
    getByCategorySlug,
    getRelatedBySlug,
    createProduct,
    updateProduct,
    deleteProduct
}
