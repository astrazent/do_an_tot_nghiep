import { postTypeService } from '~/services/postTypeService'
import { StatusCodes } from 'http-status-codes'

const createPostType = async (req, res, next) => {
    try {
        const data = await postTypeService.createPostTypeService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Tạo mới loại bài viết thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getByIdPostType = async (req, res, next) => {
    try {
        const data = await postTypeService.getByIdPostTypeService(req.query.postTypeId)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy loại bài viết thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getListPostType = async (req, res, next) => {
    try {
        const data = await postTypeService.getListPostTypeService(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách loại bài viết thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const updatePostType = async (req, res, next) => {
    try {
        const data = await postTypeService.updatePostTypeService(req.query.postTypeId, req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật loại bài viết thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deletePostType = async (req, res, next) => {
    try {
        const data = await postTypeService.deletePostTypeService(req.query.postTypeId)
        return res.status(StatusCodes.OK).json({
            message: 'Xóa loại bài viết thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const postTypeController = {
    createPostType,
    getByIdPostType,
    getListPostType,
    updatePostType,
    deletePostType,
}
