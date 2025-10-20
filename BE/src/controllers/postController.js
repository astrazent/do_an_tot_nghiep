import { postService } from '~/services/postService'
import ErrorServer from '~/utils/ErrorServer'
import { StatusCodes } from 'http-status-codes'

const createPost = async (req, res, next) => {
    try {
        const data = await postService.createPostService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Tạo mới bài viết thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getByIdPost = async (req, res, next) => {
    try {
        const data = await postService.getByIdPostService(req.query.postId)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy bài viết thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getListPost = async (req, res, next) => {
    try {
        const data = await postService.getListPostService(req.body)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách bài viết thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const updatePost = async (req, res, next) => {
    try {
        const data = await postService.updatePostService(req.query.postId, req.body)

        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật bài viết thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const deletePost = async (req, res, next) => {
    try {
        const data = await postService.deletePostService(req.query.postId)

        return res.status(StatusCodes.OK).json({
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

export const postController = {
    createPost,
    getByIdPost,
    getListPost,
    updatePost,
    deletePost,
}