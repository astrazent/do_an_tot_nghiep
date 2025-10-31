import ErrorServer from '~/utils/ErrorServer'
import { productService } from '~/services/productService'
import { StatusCodes } from 'http-status-codes'

const createProduct = async (req, res, next) => {
    try {
        const data = await productService.createProductService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Tạo mới sản phẩm thành công',
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
            message: 'Lấy sản phẩm thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getListProduct = async (req, res, next) => {
    try {
        const data = await productService.getListProductService(req.body)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách sản phẩm thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getByCategory = async (req, res, next) => {
    try {
        const data = await productService.getByCategoryService(req.query.categoryId)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy sản phẩm theo danh mục thành công',
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
            message: 'Lấy sản phẩm theo danh mục thành công',
            data,
        })
    } catch (error) {
        console.error('Lỗi trong getBySlug:', error)
        return ErrorServer(error, req, res, next)
    }
}
const getRelatedBySlug = async (req, res, next) => {
    try {
        const data = await productService.getRelatedBySlugService(req.query.slug)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách sản phẩm liên quan thành công',
            data,
        })
    } catch (error) {
        console.error('Lỗi trong getBySlug:', error)
        return ErrorServer(error, req, res, next)
    }
}

const searchProduct = async (req, res, next) => {
    try {
        const data = await productService.searchProductService(req.query)

        return res.status(StatusCodes.OK).json({
            message: 'Tìm kiếm thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const data = await productService.updateProductService(req.query.productId, req.body)

        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật thông tin sản phẩm thành công',
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
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

export const productController = {
    getByIdProduct,
    getListProduct,
    getByCategory,
    getBySlug,
    getRelatedBySlug,
    createProduct,
    searchProduct,
    updateProduct,
    deleteProduct
}