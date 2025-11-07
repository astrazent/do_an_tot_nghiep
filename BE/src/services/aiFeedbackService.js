import { aiFeedbackModel } from '~/models/aiFeedbackModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createFeedbackService = async data => {
    const feedback = await aiFeedbackModel.createFeedback(data)
    return feedback
}

const createOrUpdateFeedbackBySlugService = async data => {
    const { slug, voter_id, vote, id = null } = data

    if (!slug || !slug.trim()) {
        throw new Error('Slug sản phẩm không được để trống!')
    }

    if (
        typeof vote !== 'number' ||
        (voter_id != null && typeof voter_id !== 'number')
    ) {
        throw new Error('Dữ liệu feedback không hợp lệ!')
    }

    // 1️⃣ Lấy product_id từ slug
    const product_id = await aiFeedbackModel.getIdByProductSlug(slug)
    if (!product_id) {
        throw new Error(`Không tìm thấy sản phẩm với slug: ${slug}`)
    }

    // 2️⃣ Gọi hàm createOrUpdateFeedback của model
    const feedback = await aiFeedbackModel.createOrUpdateFeedback({
        id, // Có thể null
        product_id,
        voter_id,
        vote,
    })
    return feedback
}

const getByIdFeedbackService = async feedbackId => {
    const feedback = await aiFeedbackModel.getFeedbackById(feedbackId)
    if (!feedback) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy feedback với id: ${feedbackId}`
        )
    }

    return feedback
}

const getListFeedbackByProductService = async productId => {
    const feedbacks = await aiFeedbackModel.getFeedbacksByProduct(productId)
    if (feedbacks.length === 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không có feedback nào cho sản phẩm với id: ${productId}`
        )
    }

    return feedbacks
}

const getListFeedbackByUserService = async userId => {
    const feedbacks = await aiFeedbackModel.getFeedbacksByUser(userId)
    if (feedbacks.length === 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không có feedback nào của user với id: ${userId}`
        )
    }

    return feedbacks
}

const updateFeedbackService = async (feedbackId, data) => {
    const existingFeedback = await aiFeedbackModel.getFeedbackById(feedbackId)
    if (!existingFeedback) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy feedback với id: ${feedbackId}`
        )
    }

    const updatedFeedback = await aiFeedbackModel.updateFeedback(
        feedbackId,
        data
    )
    return updatedFeedback
}

const deleteFeedbackService = async feedbackId => {
    const existingFeedback = await aiFeedbackModel.getFeedbackById(feedbackId)
    if (!existingFeedback) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy feedback với id: ${feedbackId}`
        )
    }

    await aiFeedbackModel.deleteFeedback(feedbackId)
    return { message: 'Xóa feedback thành công' }
}

export const aiFeedbackService = {
    createOrUpdateFeedbackBySlugService,
    createFeedbackService,
    getByIdFeedbackService,
    getListFeedbackByProductService,
    getListFeedbackByUserService,
    updateFeedbackService,
    deleteFeedbackService,
}
