import { categoryService } from '~/services/categoryService'
import ErrorServer from '~/utils/ErrorServer'
import { StatusCodes } from 'http-status-codes'

const createCategory = async (req, res, next) => {
    try {
        const data = await categoryService.createCategoryService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Tạo mới danh mục thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getByIdCategory = async (req, res, next) => {
    try {
        const data = await categoryService.getByIdCategoryService(req.query.categoryId)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh mục thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getBySlugCategory = async (req, res, next) => {
    try {
        const data = await categoryService.getBySlugCategoryService(req.query)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh mục thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getListCategory = async (req, res, next) => {
    try {
        const data = await categoryService.getListCategoryService(req.body)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách danh mục thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const updateCategory = async (req, res, next) => {
    try {
        const data = await categoryService.updateCategoryService(req.query.categoryId, req.body)

        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật thông tin danh mục thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const deleteCategory = async (req, res, next) => {
    try {
        const data = await categoryService.deleteCategoryService(req.query.categoryId)

        return res.status(StatusCodes.OK).json({
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

export const categoryController = {
    createCategory,
    getByIdCategory,
    getBySlugCategory,
    getListCategory,
    updateCategory,
    deleteCategory
}