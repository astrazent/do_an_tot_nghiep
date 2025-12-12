export async function summarizeComments(comments) {
    try {
        if (!comments || comments.length === 0) return null

        const allText = comments
            .filter(
                c => typeof c.content === 'string' && c.content.trim() !== ''
            )
            .map(c => c.content)
            .join('\n')

        if (!allText.trim()) {
            console.warn('Không có nội dung hợp lệ để gửi sang DeepSeek')
            return null
        }

        const response = await fetch(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'deepseek/deepseek-chat-v3.1',
                    messages: [
                        {
                            role: 'system',
                            content:
                                'Bạn là một AI giúp tóm tắt đánh giá sản phẩm bằng tiếng Việt.',
                        },
                        {
                            role: 'user',
                            content: `Hãy đọc các đánh giá sau và tóm tắt thành 2 phần: Tích cực và Tiêu cực.\n\n${allText}`,
                        },
                    ],
                }),
            }
        )

        const data = await response.json()
        const content = data?.choices?.[0]?.message?.content

        if (!content) {
            console.error('DeepSeek không trả về nội dung hợp lệ:', data)
            return null
        }

        return { summary: content }
    } catch (error) {
        console.error('Lỗi gọi DeepSeek qua OpenRouter:', error)
        return null
    }
}
