import { CommentsModel } from '~/models/commentModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { ProductsModel } from '~/models/productModel'
import { CommentImagesModel } from '~/models/commentImageModel'

const attachImagesToComments = async comments => {
    if (!Array.isArray(comments) || comments.length === 0) return []

    const commentIds = comments.map(c => c.id)
    const allImages = await CommentImagesModel.getImagesByCommentIds(commentIds)
    const imagesMap = {}
    allImages.forEach(img => {
        const url = img.image_url || ''
        const formattedUrl = url.startsWith('http')
            ? url
            : '/' + url.replace(/^\/+/, '')
        if (!imagesMap[img.comment_id]) imagesMap[img.comment_id] = []
        imagesMap[img.comment_id].push(formattedUrl)
    })
    return comments.map(c => ({
        ...c,
        images: imagesMap[c.id] || [],
    }))
}

const createCommentService = async data => {
    const comment = await CommentsModel.createComment(data)
    return comment
}

const createCommentByProductSlugService = async data => {
    const { slug, rate, content, user_id } = data

    if (!slug) throw new Error('slug sản phẩm không được để trống')
    const product = await ProductsModel.getProductBySlug(slug)
    if (!product) throw new Error(`Không tìm thấy sản phẩm với slug: ${slug}`)

    const commentData = {
        rate,
        content,
        user_id,
        product_id: product.id,
    }

    const comment =
        await CommentsModel.createCommentByUserAndProduct(commentData)
    return comment
}

const getByIdCommentService = async commentId => {
    const comment = await CommentsModel.getCommentById(commentId)
    if (!comment) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy comment với id: ${commentId}`
        )
    }

    return comment
}
const getCommentByProductSlugService = async slug => {
    const comments = await CommentsModel.getCommentsByProductSlug(slug)
    if (!comments || comments.length === 0) {
        return []
    }

    const commentsWithImages = await attachImagesToComments(comments)
    return commentsWithImages
}

const getByUserIdAndProductSlugService = async ({ user_id, slug }) => {
    const product = await ProductsModel.getProductBySlug(slug)
    if (!product) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy sản phẩm với slug: ${slug}`
        )
    }

    const comment = await CommentsModel.getByUserIdAndProductId(
        user_id,
        product.id
    )

    if (!comment || comment.length === 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Người dùng ${user_id} chưa bình luận cho sản phẩm này`
        )
    }

    return comment[0]
}

const updateCommentByUserAndProductService = async ({
    user_id,
    slug,
    data,
}) => {
    const product = await ProductsModel.getProductBySlug(slug)
    if (!product) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy sản phẩm với slug: ${slug}`
        )
    }

    const updated = await CommentsModel.updateCommentByUserAndProduct(
        user_id,
        product.id,
        data
    )

    if (!updated) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Người dùng ${user_id} chưa bình luận cho sản phẩm này`
        )
    }

    return { success: true }
}

const getListCommentService = async filters => {
    const comments = await CommentsModel.listComments(
        filters.limit,
        filters.offset
    )
    if (comments.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Không có comment nào`)
    }

    return comments
}

const getListCommentByProductService = async productId => {
    const comments = await CommentsModel.getCommentsByProduct(productId)
    if (comments.length === 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không có comment nào cho sản phẩm với id: ${productId}`
        )
    }

    return comments
}

const getListCommentByUserService = async userId => {
    const comments = await CommentsModel.getCommentsByUser(userId)
    if (comments.length === 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không có comment nào của user với id: ${userId}`
        )
    }

    return comments
}

const updateCommentService = async (commentId, data) => {
    const existingComment = await CommentsModel.getCommentById(commentId)
    if (!existingComment) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy comment với id: ${commentId}`
        )
    }

    const updatedComment = await CommentsModel.updateComment(commentId, data)
    return updatedComment
}

const deleteCommentService = async commentId => {
    const existingComment = await CommentsModel.getCommentById(commentId)
    if (!existingComment) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy comment với id: ${commentId}`
        )
    }

    await CommentsModel.deleteComment(commentId)
    return { message: 'Xóa comment thành công' }
}

export const commentService = {
    createCommentService,
    createCommentByProductSlugService,
    getByIdCommentService,
    updateCommentByUserAndProductService,
    getCommentByProductSlugService,
    getByUserIdAndProductSlugService,
    getListCommentService,
    getListCommentByProductService,
    getListCommentByUserService,
    updateCommentService,
    deleteCommentService,
}
