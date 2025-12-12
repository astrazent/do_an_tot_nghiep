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
        next(error)
    }
}

const getByIdProduct = async (req, res, next) => {
    try {
        const data = await productService.getByIdProductService(
            req.query.productId
        )
        return res.status(StatusCodes.OK).json({
            message: 'Thông tin sản phẩm đã được lấy thành công',
            data,
        })
    } catch (error) {
        next(error)
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
        next(error)
    }
}

const getListProductChatBot = async (req, res, next) => {
    try {
        const data = await productService.getListProductChatBotService(
            req.query
        )
        return res.status(StatusCodes.OK).json({
            message: 'Danh sách sản phẩm đã được lấy thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getSearchProduct = async (req, res, next) => {
    try {
        const { slug, limit } = req.query

        if (!slug) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Vui lòng truyền từ khóa tìm kiếm',
            })
        }

        const data = await productService.getSearchProductService(slug, limit)

        return res.status(StatusCodes.OK).json({
            message: 'Danh sách sản phẩm đã được lấy thành công',
            data,
        })
    } catch (error) {
        console.error('Lỗi trong getSearchProduct:', error)
        next(error)
    }
}

const getSearchByCategory = async (req, res, next) => {
    try {
        const { slug, keyword = '', limit, offset = 0 } = req.query

        if (!slug) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Vui lòng truyền slug của category',
            })
        }

        const data = await productService.getSearchByCategoryService(
            slug,
            keyword,
            limit ? Number(limit) : 10,
            offset ? Number(offset) : 0
        )

        return res.status(StatusCodes.OK).json({
            message: 'Danh sách sản phẩm đã được lấy thành công',
            data: data || [],
        })
    } catch (error) {
        console.error('Lỗi trong getSearchByCategory:', error)
        next(error)
    }
}

const getListPromotionProduct = async (req, res, next) => {
    try {
        const data = await productService.getPromotionProductService(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Danh sách sản phẩm đã được lấy thành công',
            data,
        })
    } catch (error) {
        next(error)
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
        next(error)
    }
}
const getRelatedBySlug = async (req, res, next) => {
    try {
        const data = await productService.getRelatedBySlugService(
            req.query.slug
        )
        return res.status(StatusCodes.OK).json({
            message: 'Danh sách sản phẩm liên quan đã được lấy thành công',
            data,
        })
    } catch (error) {
        console.error('Lỗi trong getRelatedBySlug:', error)
        next(error)
    }
}
const getHotProduct = async (req, res, next) => {
    try {
        const data = await productService.getHotProductService(req.query.limit)
        return res.status(StatusCodes.OK).json({
            message: 'Danh sách sản phẩm nổi bật đã được lấy thành công',
            data,
        })
    } catch (error) {
        console.error('Lỗi trong getHotProduct:', error)
        next(error)
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const data = await productService.updateProductService(
            req.query.productId,
            req.body
        )
        return res.status(StatusCodes.OK).json({
            message: 'Thông tin sản phẩm đã được cập nhật thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const data = await productService.deleteProductService(
            req.query.productId
        )
        return res.status(StatusCodes.OK).json({
            message: 'Sản phẩm đã được xóa thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const productController = {
    getByIdProduct,
    getListProduct,
    getListProductChatBot,
    getSearchProduct,
    getSearchByCategory,
    getListPromotionProduct,
    getBySlug,
    getHotProduct,
    getRelatedBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
}
