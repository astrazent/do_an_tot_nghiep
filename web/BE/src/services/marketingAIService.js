import fetch from 'node-fetch'

const N8N_Post_URL = 'https://tienduy20031.app.n8n.cloud/webhook/api/marketing-writer'
const N8N_Email_URL = 'https://tienduy20031.app.n8n.cloud/webhook/email_vip'

const marketingPost = async (data, uploadedImageUrls) => {
    if (!N8N_Post_URL) throw new Error('Missing N8N_Post_URL')

    const payload = {
        product_name: data.product_name ?? '',
        content_requirement: data.content_requirement ?? '',
        product_image: uploadedImageUrls || [],  
    }

    console.log('⏰ Bắt đầu gọi n8n:', new Date().toISOString());

    try {
        const res = await fetch(N8N_Post_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        const text = await res.text();

        let json;
        try {
            json = JSON.parse(text);
        } catch (parseError) {
            console.error('Failed to parse JSON:', parseError);
            json = { raw: text };
        }

        if (!res.ok) {
            throw new Error(`n8n responded ${res.status}: ${text}`);
        }

        return json;
    } catch (error) {
        console.error('❌ Lỗi khi gọi n8n:', error.message);
        throw error;
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

    console.log('⏰ Bắt đầu gọi n8n:', new Date().toISOString());

    try {
        const res = await fetch(N8N_Email_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        const text = await res.text();

        // Luôn thử parse JSON trước
        let json;
        try {
            json = JSON.parse(text);
        } catch (parseError) {
            console.error('Failed to parse JSON from n8n:', parseError);
            console.error('Raw response:', text);
            throw new Error(`n8n trả về không phải JSON hợp lệ (status ${res.status}): ${text.slice(0, 200)}...`);
        }

        // Sau khi parse thành công mới check status
        if (!res.ok) {
            throw new Error(`n8n responded ${res.status}: ${JSON.stringify(json)}`);
        }

        return json;
    } catch (error) {
        console.error('❌ Lỗi khi gọi n8n:', error.message);
        throw error;
    }
}

export const marketingAIService = {
    marketingPost,
    marketingEmail
}