import { postService } from '~/services/postService'
import { StatusCodes } from 'http-status-codes'

const createPost = async (req, res, next) => {
    try {
        const data = await postService.createPostService(req.body, req.uploadedImageUrls)
        return res.status(StatusCodes.OK).json({
            message: 'Tạo mới bài viết thành công',
            data,
        })
    } catch (error) {
        next(error)
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
        next(error)
    }
}
const getBySlug = async (req, res, next) => {
    try {
        const data = await postService.getBySlugService(req.query)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy bài viết thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}
const getByCategorySlug = async (req, res, next) => {
    try {
        const data = await postService.getByCategorySlugService(req.query)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy bài viết thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}
const getByPostTypeSlug = async (req, res, next) => {
    try {
        const data = await postService.getByPostTypeSlugService(req.query)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy bài viết thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}
const getRelatedByPostSlug = async (req, res, next) => {
    try {
        const data = await postService.getRelatedByPostSlugService(req.query)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy bài viết thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}
const getListPost = async (req, res, next) => {
    try {
        const data = await postService.getListPostService(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách bài viết thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const updatePost = async (req, res, next) => {
    try {
        const data = await postService.updatePostService(
            req.query.postId,
            req.body
        )

        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật bài viết thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deletePost = async (req, res, next) => {
    try {
        const data = await postService.deletePostService(req.query.postId)

        return res.status(StatusCodes.OK).json({
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const postController = {
    createPost,
    getByIdPost,
    getBySlug,
    getByCategorySlug,
    getByPostTypeSlug,
    getRelatedByPostSlug,
    getListPost,
    updatePost,
    deletePost,
}
