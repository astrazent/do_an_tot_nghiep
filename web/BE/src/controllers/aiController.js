import { deepSeekService } from '~/services/deepSeekService'
import { StatusCodes } from 'http-status-codes'

const postCommentAI = async (req, res, next) => {
    try {
        const data = await deepSeekService.getSummaryCommentService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'AI trả về thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}
export const aiController = {
    postCommentAI,
}
