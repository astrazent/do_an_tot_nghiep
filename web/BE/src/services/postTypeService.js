import { PostTypesModel } from '~/models/postTypeModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createPostTypeService = async data => {
    const postType = await PostTypesModel.createPostType(data)
    return postType
}

const getByIdPostTypeService = async postTypeId => {
    const postType = await PostTypesModel.getPostTypeById(postTypeId)
    if (!postType) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy loại bài viết với ID: ${postTypeId}`
        )
    }
    return postType
}

const getListPostTypeService = async data => {
    const limit = parseInt(data.limit) || 50
    const offset = parseInt(data.offset) || 0
    const sort = data.sort === 'oldest' ? 'oldest' : 'newest'

    const listPostType = await PostTypesModel.listPostTypes(limit, offset, sort)

    if (!listPostType || listPostType.length === 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy loại bài viết nào'
        )
    }

    return listPostType
}

const updatePostTypeService = async (postTypeId, data) => {
    const existingPostType = await PostTypesModel.getPostTypeById(postTypeId)
    if (!existingPostType) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy loại bài viết với ID: ${postTypeId}`
        )
    }

    const updatedPostType = await PostTypesModel.updatePostType(
        postTypeId,
        data
    )
    return updatedPostType
}

const deletePostTypeService = async postTypeId => {
    const existingPostType = await PostTypesModel.getPostTypeById(postTypeId)
    if (!existingPostType) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy loại bài viết với ID: ${postTypeId}`
        )
    }

    await PostTypesModel.deletePostType(postTypeId)
    return { message: 'Xóa loại bài viết thành công' }
}

export const postTypeService = {
    createPostTypeService,
    getByIdPostTypeService,
    getListPostTypeService,
    updatePostTypeService,
    deletePostTypeService,
}
