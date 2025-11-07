import React from 'react'

const ArticleBody = ({ content = '', highlights = [], images = [] }) => {
    console.log(images);
    // Nếu content là array thì join lại thành 1 string
    const contentString = Array.isArray(content) ? content.join('') : content
    const processedContent = images.reduce((html, img, idx) => {
        const imgTag = `<figure class="flex justify-center my-8">
                            <img src="${img.url}" alt="${img.caption || ''}" class="w-[80%] h-auto rounded-lg shadow-md" />
                        </figure>`
        return html.replace(`[IMAGE_${idx + 1}]`, imgTag)
    }, contentString)

    return (
        <article className="text-base text-gray-800 leading-relaxed">
            {highlights.length > 0 && (
                <p className="font-semibold text-lg mb-4">{highlights[0]}</p>
            )}

            {highlights.length > 1 && (
                <ul className="list-disc list-inside space-y-2 mb-6 bg-gray-50 p-4 rounded-md border-l-4 border-green-600">
                    {highlights.slice(1).map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            )}

            {/* Render content HTML đã chèn ảnh */}
            <div
                className="space-y-6"
                dangerouslySetInnerHTML={{ __html: processedContent }}
            />
        </article>
    )
}

export default ArticleBody
