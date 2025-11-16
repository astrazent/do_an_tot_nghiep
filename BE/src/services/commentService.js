import { CommentsModel } from '~/models/commentModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { ProductsModel } from '~/models/productModel'
import { CommentImagesModel } from '~/models/commentImageModel'

const attachImagesToComments = async comments => {
    if (!Array.isArray(comments) || comments.length === 0) return []

    const commentIds = comments.map(c => c.id)
    const allImages = await CommentImagesModel.getImagesByCommentIds(commentIds)

    // Nhóm ảnh theo comment_id
    const imagesMap = {}
    allImages.forEach(img => {
        const url = img.image_url || ''
        const formattedUrl = url.startsWith('http') ? url : '/' + url.replace(/^\/+/, '')
        if (!imagesMap[img.comment_id]) imagesMap[img.comment_id] = []
        imagesMap[img.comment_id].push(formattedUrl)
    })

    // Gắn ảnh vào comment
    return comments.map(c => ({
        ...c,
        images: imagesMap[c.id] || []
    }))
}

const createCommentService = async data => {
    const comment = await CommentsModel.createComment(data)
    return comment
}

const createCommentByProductSlugService = async data => {
    // Destructure dữ liệu
    const { slug, rate, content, user_id } = data

    if (!slug) throw new Error('slug sản phẩm không được để trống')

    // Lấy product theo slug
    const product = await ProductsModel.getProductBySlug(slug)
    if (!product) throw new Error(`Không tìm thấy sản phẩm với slug: ${slug}`)

    // Tạo comment với product_id
    const commentData = {
        rate,
        content,
        user_id,
        product_id: product.id
    }

    const comment = await CommentsModel.createCommentByUserAndProduct(commentData)
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
<<<<<<< HEAD
    const comment = await CommentsModel.getCommentsByProductSlug(slug)
    if (!comment) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy comment với slug: ${slug}`
=======
    const comments = await CommentsModel.getCommentsByProductSlug(slug)
    if (!comments || comments.length === 0) {
        return []
    }

    // Gắn images cho comment
    const commentsWithImages = await attachImagesToComments(comments)
    return commentsWithImages
}

const getByUserIdAndProductSlugService = async ({ user_id, slug }) => {
    // 1. Tìm product theo slug
    const product = await ProductsModel.getProductBySlug(slug)
    if (!product) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy sản phẩm với slug: ${slug}`
>>>>>>> 90c0ef4009c16de0e32287b149daba0b9a7ba6f6
        )
    }

    // 2. Lấy comment theo user_id + product_id
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

    // 3. Vì UNIQUE KEY nên luôn chỉ có 1 record
    return comment[0]
}

const updateCommentByUserAndProductService = async ({ user_id, slug, data }) => {
    // 1. Tìm product theo slug
    const product = await ProductsModel.getProductBySlug(slug)
    if (!product) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy sản phẩm với slug: ${slug}`
        )
    }

    // 2. Update comment theo user_id + product_id
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

    // Trả về kết quả update
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
