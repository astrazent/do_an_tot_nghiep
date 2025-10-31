import { PostsModel } from '~/models/postModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createPostService = async data => {   
    const post = await PostsModel.createPost(data)
    return post
}

const getByIdPostService = async postId => {
    const post = await PostsModel.getPostById(postId)
    if (!post) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy bài viết với ID: ${postId}`
        )
    }

    return post
}

const getListPostService = async filters => {
    const posts = await PostsModel.listPosts(filters.limit, filters.offset)
    if(posts.length === 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy bài viết nào`
        )
    }

    return posts
}

const updatePostService = async (postId, data) => {
    const existingPost = await PostsModel.getPostById(postId)
    if (!existingPost) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy bài viết với ID: ${postId}`
        )
    }

    const updatedPost = await PostsModel.updatePost(postId, data)
    return updatedPost
}

const deletePostService = async postId => {
    const existingPost = await PostsModel.getPostById(postId)
    if (!existingPost) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy bài viết với ID: ${postId}`
        )
    }

    await PostsModel.deletePost(postId)
    return { message: 'Xóa bài viết thành công' }
}

export const postService = {
    createPostService,
    getByIdPostService,
    getListPostService,
    updatePostService,
    deletePostService,
}
