import { marketingAIService } from "~/services/marketingAIService"
import { StatusCodes } from 'http-status-codes'
import ErrorServer from '~/utils/ErrorServer'

const marketing = async (req, res, next) => {
    try {
        const data = await marketingAIService.marketing(req.body, req.uploadedImageUrls)
        return res.status(StatusCodes.CREATED).json({
            message: 'Tạo marketing AI thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

export const marketingAIController = {
    marketing,
}