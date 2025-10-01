import { StatusCodes } from 'http-status-codes'
import * as commentService from '../services/commentService.js'

export const createComment = async (req, res, next) => {
    try {
        const { productId, rate, content } = req.body
        const userId = req.user?.id || 1 // TODO: thay bằng user từ middleware auth

        if (!productId) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'ProductId is required' })
        }

        if (!rate || rate < 1 || rate > 5) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Rate must be 1-5' })
        }

        if (!content || content.trim() === '') {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Content cannot be empty' })
        }

        const comment = await commentService.addComment(
            productId,
            userId,
            rate,
            content
        )

        res.status(StatusCodes.CREATED).json(comment)
    } catch (error) {
        next(error)
    }
}

export const getProductComments = async (req, res, next) => {
    try {
        const { productId } = req.params

        const comments = await commentService.getCommentsByProduct(productId)
        const stats = await commentService.getCommentStats(productId)

        res.status(StatusCodes.OK).json({
            productId,
            average: stats.avg_rate || 0,
            total: stats.total_comments || 0,
            comments,
        })
    } catch (error) {
        next(error)
    }
}
