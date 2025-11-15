import { PostsModel } from '~/models/postModel'
import { StatusCodes } from 'http-status-codes'
import { PostImagesModel } from '~/models/postImageModel'
import ApiError from '~/utils/ApiError'
const attachImagesToPosts = async posts => {
    if (!posts) return []
    const postArray = Array.isArray(posts) ? posts : [posts]

    const ids = postArray.map(p => p.id)
    const allImages = await PostImagesModel.getImagesByPostIds(ids)

    const imagesMap = allImages.reduce((acc, img) => {
        if (!acc[img.post_id]) acc[img.post_id] = []
        acc[img.post_id].push(img)
        return acc
    }, {})

    for (const post of postArray) {
        const images = imagesMap[post.id] || []
        post.images = images.map(i => ({
            url: i.image_url
                ? i.image_url.startsWith('http')
                    ? i.image_url
                    : '/' + i.image_url.replace(/^\/+/, '')
                : '',
            caption: i.caption || '',
            display_order: i.display_order ?? 0,
        }))
    }

    return Array.isArray(posts) ? postArray : postArray[0]
}

export default attachImagesToPosts

const attachImagesToRelatedPosts = async relatedData => {
    if (!relatedData) return { relatedByCategory: [], relatedByPostType: [] }

    const { relatedByCategory = [], relatedByPostType = [] } = relatedData

    const allPosts = [...relatedByCategory, ...relatedByPostType]
    if (allPosts.length === 0) return { relatedByCategory, relatedByPostType }

    const ids = allPosts.map(p => p.id)
    const allImages = await PostImagesModel.getImagesByPostIds(ids)

    const imagesMap = allImages.reduce((acc, img) => {
        if (!acc[img.post_id]) acc[img.post_id] = []
        acc[img.post_id].push(img)
        return acc
    }, {})

    const attachImages = posts =>
        posts.map(post => ({
            ...post,
            images: (imagesMap[post.id] || []).map(i => {
                const url = i.image_url || ''
                return url.startsWith('http')
                    ? url
                    : '/' + url.replace(/^\/+/, '')
            }),
        }))

    return {
        relatedByCategory: attachImages(relatedByCategory),
        relatedByPostType: attachImages(relatedByPostType),
    }
}

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
    return attachImagesToPosts(post)
}

const getBySlugService = async data => {
    const { slug, limit = 1, offset = 0 } = data
    if (!slug) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Slug không được để trống')
    }

    const posts = await PostsModel.getPostBySlug(slug, limit, offset)

    if (!posts || posts.length === 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy bài viết với slug: ${slug}`
        )
    }

    const [postWithImages] = await attachImagesToPosts(posts)
    return postWithImages
}

const getByCategorySlugService = async data => {
    const { slug, limit = 5, offset = 0 } = data
    const posts = await PostsModel.getPostByCategorySlug(slug, limit, offset)
    if (!posts || posts.length === 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy bài viết với category slug: ${slug}`
        )
    }
    return attachImagesToPosts(posts)
}

const getByPostTypeSlugService = async data => {
    const { slug, limit = 5, offset = 0 } = data
    const posts = await PostsModel.getPostByPostTypeSlug(slug, limit, offset)
    if (!posts || posts.length === 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy bài viết với post type slug: ${slug}`
        )
    }
    return attachImagesToPosts(posts)
}
const getRelatedByPostSlugService = async data => {
    const { slug, limit = 5, offset = 0 } = data
    const { relatedByCategory, relatedByPostType } =
        await PostsModel.getRelatedByPostSlug(slug, limit, offset)

    if (
        (!relatedByCategory || relatedByCategory.length === 0) &&
        (!relatedByPostType || relatedByPostType.length === 0)
    ) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy bài viết liên quan cho slug: ${slug}`
        )
    }

    const result = await attachImagesToRelatedPosts({
        relatedByCategory,
        relatedByPostType,
    })

    return result
}
const getListPostService = async data => {
    const limit = parseInt(data.limit) || 10
    const offset = parseInt(data.offset) || 0
    const validSorts = ['newest', 'oldest', 'post_type', 'post_type_limited']
    const sort = validSorts.includes(data.sort) ? data.sort : 'newest'

    const listPost = await PostsModel.listPosts(limit, offset, sort)
    if (!listPost || listPost.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy bài viết nào')
    }
    return attachImagesToPosts(listPost)
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
    getBySlugService,
    getByCategorySlugService,
    getByPostTypeSlugService,
    getRelatedByPostSlugService,
    getListPostService,
    updatePostService,
    deletePostService,
}
