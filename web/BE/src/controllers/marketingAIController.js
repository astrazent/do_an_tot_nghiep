import { marketingAIService } from "~/services/marketingAIService"
import { StatusCodes } from 'http-status-codes'

const marketingPost = async (req, res, next) => {
    try {
        const data = await marketingAIService.marketingPost(req.body, req.uploadedImageUrls)
        return res.status(StatusCodes.CREATED).json({
            message: 'Tạo bài viết thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const marketingEmail = async (req, res, next) => {
    try {
        const data = await marketingAIService.marketingEmail(req.body, req.uploadedImageUrls)
        return res.status(StatusCodes.CREATED).json({
            message: 'Tạo nội dung email thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const marketingAIController = {
    marketingPost,
    marketingEmail
}