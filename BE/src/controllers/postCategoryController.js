import { postCategoryService } from '~/services/postCategoryService'
import ErrorServer from '~/utils/ErrorServer'
import { StatusCodes } from 'http-status-codes'

const create = async (req, res, next) => {
    try {
        const data = await postCategoryService.createService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Tạo mới liên kết thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getById = async (req, res, next) => {
    try {
        const data = await postCategoryService.getByIdService(req.query.postCategoryId)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy liên kết giữa bài viết và danh mục thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getList = async (req, res, next) => {
    try {
        const data = await postCategoryService.getListService(req.body)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách liên kết giữa bài viết và danh mục thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getListCategoryByPost = async (req, res, next) => {
    try {
        const data = await postCategoryService.getListCategoryByPostService(req.query.postId)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách danh mục theo bài viết thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getListPostByCategory = async (req, res, next) => {
    try {
        const data = await postCategoryService.getListPostByCategoryService(req.query.categoryId)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách bài viết theo danh mục thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const update = async (req, res, next) => {
    try {
        const data = await postCategoryService.updateService(req.query.postCategoryId, req.body)

        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const deleted = async (req, res, next) => {
    try {
        const data = await postCategoryService.deleteService(req.query.postCategoryId)

        return res.status(StatusCodes.OK).json({
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

export const postCategoryController = {
    create,
    getById,
    getList,
    getListCategoryByPost,
    getListPostByCategory,
    update,
    deleted,
}