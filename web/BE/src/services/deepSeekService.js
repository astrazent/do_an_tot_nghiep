import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { env } from '~/config/environment'

/**
 * Chia mảng thành các batch nhỏ
 */
function chunkArray(array, size) {
    const result = []
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size))
    }
    return result
}

/**
 * Gửi batch bình luận sang DeepSeek và lấy summary
 */
async function fetchBatchSummary(batch, startIndex = 0) {
    const allText = batch
        .filter(c => typeof c.content === 'string' && c.content.trim() !== '')
        .map((c, idx) => {
            const content = c.content.trim().slice(0, 300) // chỉ lấy 300 ký tự đầu
            return `(${startIndex + idx + 1}) ${c.full_name || c.username}: ${content}`
        })
        .join('\n')

    if (!allText.trim()) return null

    const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat-v3.1',
                max_tokens: 4000, // giới hạn token để tránh vượt
                messages: [
                    {
                        role: 'system',
                        content: 'Bạn là AI giúp tóm tắt đánh giá sản phẩm bằng tiếng Việt.',
                    },
                    {
                        role: 'user',
                        content: `
                        Bạn là AI chuyên phân tích đánh giá sản phẩm bằng tiếng Việt.
                        Hãy đọc danh sách bình luận sau và trả về kết quả dưới dạng JSON hợp lệ, KHÔNG thêm giải thích.

                        Cấu trúc JSON mẫu:
                        {
                        "product": {"positive": [], "negative": [], "positiveCount": 0, "negativeCount": 0},
                        "service": {"positive": [], "negative": [], "positiveCount": 0, "negativeCount": 0}
                        }

                        Danh sách bình luận:\n${allText}
                        `,
                    },
                ],
            }),
        }
    )

    const data = await response.json()
    if (!response.ok || !data?.choices?.[0]?.message?.content) {
        console.error('DeepSeek không trả về nội dung hợp lệ:', data)
        throw new ApiError(
            StatusCodes.BAD_GATEWAY,
            'Không nhận được phản hồi hợp lệ từ DeepSeek'
        )
    }

    try {
        return JSON.parse(data.choices[0].message.content.trim())
    } catch (e) {
        console.error('Lỗi parse JSON từ DeepSeek:', e, data.choices[0].message.content)
        throw new ApiError(
            StatusCodes.BAD_GATEWAY,
            'DeepSeek trả về dữ liệu không hợp lệ (không phải JSON)'
        )
    }
}

/**
 * Hàm chính: xử lý danh sách bình luận lớn bằng batch
 */
const getSummaryCommentService = async comments => {
    try {
        if (!Array.isArray(comments) || comments.length === 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Danh sách bình luận không hợp lệ!')
        }

        const batchSize = 20 // có thể điều chỉnh tuỳ token
        const batches = chunkArray(comments, batchSize)

        let finalSummary = {
            product: { positive: [], negative: [], positiveCount: 0, negativeCount: 0 },
            service: { positive: [], negative: [], positiveCount: 0, negativeCount: 0 },
        }

        for (let i = 0; i < batches.length; i++) {
            const summary = await fetchBatchSummary(batches[i], i * batchSize)
            if (!summary) continue

            ['product', 'service'].forEach(key => {
                finalSummary[key].positive.push(...summary[key].positive)
                finalSummary[key].negative.push(...summary[key].negative)
                finalSummary[key].positiveCount = finalSummary[key].positive.length
                finalSummary[key].negativeCount = finalSummary[key].negative.length
            })
        }

        return { summary: finalSummary, totalComments: comments.length }
    } catch (error) {
        console.error('Lỗi khi gọi DeepSeek:', error)
        throw new ApiError(
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            error.message || 'Lỗi không xác định khi gọi DeepSeek'
        )
    }
}

export const deepSeekService = {
    getSummaryCommentService,
}