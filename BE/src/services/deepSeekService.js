import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { env } from '~/config/environment'

const getSummaryCommentService = async comments => {
    try {
        if (!Array.isArray(comments) || comments.length === 0) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Danh sách bình luận không hợp lệ!'
            )
        }

        const allText = comments
            .filter(
                c => typeof c.content === 'string' && c.content.trim() !== ''
            )
            .map(
                (c, idx) =>
                    `(${idx + 1}) ${c.full_name || c.username}: ${c.content}`
            )
            .join('\n')

        if (!allText.trim()) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Không có nội dung hợp lệ để gửi sang DeepSeek!'
            )
        }

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
                    messages: [
                        {
                            role: 'system',
                            content:
                                'Bạn là AI giúp tóm tắt đánh giá sản phẩm bằng tiếng Việt.',
                        },
                        {
                            role: 'user',
                            content: `
                            Bạn là AI chuyên phân tích đánh giá sản phẩm bằng tiếng Việt.

                            Hãy đọc danh sách bình luận sau và **trả về kết quả dưới dạng JSON hợp lệ**, KHÔNG được thêm giải thích, chỉ trả về JSON thuần.

                            Cấu trúc JSON mẫu cần tuân theo:
                            {
                            "product": {
                                "positive": ["..."],
                                "negative": ["..."],
                                "positiveCount": 0,
                                "negativeCount": 0
                            },
                            "service": {
                                "positive": ["..."],
                                "negative": ["..."],
                                "positiveCount": 0,
                                "negativeCount": 0
                            }
                            }

                            Yêu cầu:
                            - "product" nói về chất lượng, bao bì, hương vị, công dụng, v.v.
                            - "service" nói về giao hàng, đóng gói, nhân viên, chăm sóc khách hàng.
                            - Nếu không thấy ý nào tiêu cực, để mảng "negative" rỗng.
                            - Giá trị *Count* phải bằng số lượng phần tử tương ứng trong mỗi mảng.
                            - Trả về **chính xác JSON hợp lệ**, không thêm mô tả hoặc markdown.

                            Đây là danh sách bình luận:\n${allText}
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

        let aiSummary
        try {
            aiSummary = JSON.parse(data.choices[0].message.content.trim())
        } catch (e) {
            console.error(
                'Lỗi parse JSON từ DeepSeek:',
                e,
                data.choices[0].message.content
            )
            throw new ApiError(
                StatusCodes.BAD_GATEWAY,
                'DeepSeek trả về dữ liệu không hợp lệ (không phải JSON)'
            )
        }

        return {
            summary: aiSummary,
            totalComments: comments.length,
        }
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
