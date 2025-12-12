import fetch from 'node-fetch'
import { FormData, fileFromPath } from 'node-fetch'

const N8N_URL = 'https://tienduy2003.app.n8n.cloud/webhook/api/marketing-writer'

const marketing = async (data, uploadedImageUrls) => {
    if (!N8N_URL) throw new Error('Missing N8N_URL')

    const fd = new FormData()
    fd.append('product_name', data.product_name ?? '')
    fd.append('content_requirement', data.content_requirement ?? '')
    fd.append('word_count', String(data.word_count ?? ''))

    for (const image of uploadedImageUrls) {
        fd.append('product_image', image)
    }
    const res = await fetch(N8N_URL, {
        method: 'POST',
        body: fd,
    })

    const text = await res.text()
    let json
    try {
        json = JSON.parse(text)
    } catch {
        json = { raw: text }
    }

    if (!res.ok) {
        throw new Error(`n8n responded ${res.status}: ${text}`)
    }

    console.log(json)
    return json
}

export const marketingAIService = {
    marketing,
}
