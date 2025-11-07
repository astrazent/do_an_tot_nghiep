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
const getBySlug = async (req, res, next) => {
    try {
        const data = await postService.getBySlugService(req.query)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy bài viết thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
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
        return ErrorServer(error, req, res, next)
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
        return ErrorServer(error, req, res, next)
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
        return ErrorServer(error, req, res, next)
    }
}
const getListPost = async (req, res, next) => {
    try {
        // Truyền req.query vào service
        const data = await postService.getListPostService(req.query);
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách bài viết thành công',
            data,
        });
    } catch (error) {
        return ErrorServer(error, req, res, next);
    }
};

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
    getBySlug,
    getByCategorySlug,
    getByPostTypeSlug,
    getRelatedByPostSlug,
    getListPost,
    updatePost,
    deletePost,
}