import { marketingAIService } from "~/services/marketingAIService"
import { StatusCodes } from 'http-status-codes'

const marketing = async (req, res, next) => {
    try {
        const data = await marketingAIService.marketing(req.body, req.uploadedImageUrls)
        return res.status(StatusCodes.CREATED).json({
            message: 'Tạo marketing AI thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const marketingAIController = {
    marketing,
}