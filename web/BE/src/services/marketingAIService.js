import fetch from 'node-fetch'
import FormData from 'form-data'

const N8N_Post_URL ='https://tienduy20032.app.n8n.cloud/webhook/api/marketing-writer'
const N8N_Email_URL = 'https://tienduy20032.app.n8n.cloud/webhook/email_vip'

const marketingPost = async file => {
    if (!file) {
        throw new Error('Không có file Excel được gửi')
    }

    if (!N8N_Post_URL) {
        throw new Error('Missing N8N_Post_URL')
    }

    console.log('⏰ Bắt đầu forward file đến n8n:', new Date().toISOString())
    console.log('Tên file:', file.originalname)
    console.log('Kích thước file:', file.size)

    try {
        const form = new FormData()
        form.append('sheet_file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        })

        const response = await fetch(N8N_Post_URL, {
            method: 'POST',
            body: form,
            headers: form.getHeaders(), 
        })

        const text = await response.text()
        let json

        try {
            json = JSON.parse(text)
        } catch (parseError) {
            console.error('Failed to parse n8n response:', parseError)
            json = { raw: text }
        }

        if (!response.ok) {
            throw new Error(`n8n responded ${response.status}: ${text}`)
        }

        console.log('n8n response:', json)
        return json
    } catch (error) {
        console.error('❌ Lỗi khi forward file đến n8n:', error.message)
        throw error
    }
}

const marketingEmail = async (data, uploadedImageUrls) => {
    if (!N8N_Email_URL) throw new Error('Missing N8N_Email_URL')
    console.log(data.customers)
    const payload = {
        customers: data.customers ?? [],
        message: data.message ?? '',
        subject: data.subject ?? '',
        image: uploadedImageUrls || [],
    }

    console.log('⏰ Bắt đầu gọi n8n:', new Date().toISOString())

    try {
        const res = await fetch(N8N_Email_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        const text = await res.text()

        // Luôn thử parse JSON trước
        let json
        try {
            json = JSON.parse(text)
        } catch (parseError) {
            console.error('Failed to parse JSON from n8n:', parseError)
            console.error('Raw response:', text)
            throw new Error(
                `n8n trả về không phải JSON hợp lệ (status ${res.status}): ${text.slice(0, 200)}...`
            )
        }

        // Sau khi parse thành công mới check status
        if (!res.ok) {
            throw new Error(
                `n8n responded ${res.status}: ${JSON.stringify(json)}`
            )
        }

        return json
    } catch (error) {
        console.error('❌ Lỗi khi gọi n8n:', error.message)
        throw error
    }
}

export const marketingAIService = {
    marketingPost,
    marketingEmail,
}
