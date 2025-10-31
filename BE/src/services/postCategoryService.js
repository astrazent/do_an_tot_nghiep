import { PostCategoriesModel } from '~/models/postCategoryModel'
import { PostsModel } from '~/models/postModel'
import { CategoriesModel } from '~/models/categoryModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createService = async data => {   
    const postCategoryLink = await PostCategoriesModel.createLink(data)
    return postCategoryLink
}

const getByIdService = async postCategoryId => {
    const postCategoryLink = await PostCategoriesModel.getLinkById(postCategoryId)
    if (!postCategoryLink) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy liên kết giữa bài viết và danh mục với ID đã cho'
        )
    }

    return postCategoryLink
}

const getListService = async filters => {
    const postCategoryLinks = await PostCategoriesModel.listLinks(filters.limit, filters.offset)
    if(postCategoryLinks.length === 0) { 
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy liên kết giữa bài viết và danh mục nào'
        )
    }

    return postCategoryLinks
}

const getListCategoryByPostService = async postId => {
    const categories = await PostCategoriesModel.getCategoriesByPost(postId)
    if(categories.length === 0) { 
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy danh mục nào cho bài viết đã cho'
        )
    }

    let listCategory = []

    for(let category of categories) {
        const categoryTitle = await CategoriesModel.getCategoryById(category.category_id)
        listCategory.push(categoryTitle)
    }

    return listCategory
}

const getListPostByCategoryService = async categoryId => {
    const posts = await PostCategoriesModel.getPostsByCategory(categoryId)
    if(posts.length === 0) { 
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy bài viết nào cho danh mục đã cho'
        )
    }

    let listPost = []

    for(let post of posts) {
        const postTitle = await PostsModel.getPostById(post.post_id)
        listPost.push(postTitle)
    }

    return listPost
}

const updateService = async (postCategoryId, data) => {
    const existingLink = await PostCategoriesModel.getLinkById(postCategoryId)
    if (!existingLink) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy liên kết giữa bài viết và danh mục với ID đã cho'
        )
    }

    const updatedLink = await PostCategoriesModel.updateLink(postCategoryId, data)
    return updatedLink
}

const deleteService = async postCategoryId => {
    const existingLink = await PostCategoriesModel.getLinkById(postCategoryId)
    if (!existingLink) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy liên kết giữa bài viết và danh mục với ID đã cho'
        )
    }
    
    await PostCategoriesModel.deleteLink(postCategoryId)
    return { message: 'Xóa liên kết giữa bài viết và danh mục thành công' }
}

export const postCategoryService = {
    createService,
    getByIdService,
    getListService,
    getListCategoryByPostService,
    getListPostByCategoryService,
    updateService,
    deleteService,
}
