//src/components/ArticleList.jsx
import React from 'react'
import { Link } from 'react-router-dom' // --- [1] IMPORT COMPONENT Link ---

// --- [2] ĐỊNH NGHĨA ROUTE CƠ SỞ CHO BÀI BÁO ---
const BASE_ARTICLE_ROUTE = '/news-detail'

const ArticleListItem = ({ article }) => (
    // --- [3] BỌC COMPONENT TRONG THẺ Link VÀ DI CHUYỂN CÁC CLASS ---
    <Link
        to={`${BASE_ARTICLE_ROUTE}/${article.slug}`}
        className="group grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
    >
        <div className="overflow-hidden rounded-md h-[150px]">
            <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
            />
        </div>
        <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-green-600">
                {article.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <span className="font-semibold text-green-700">
                    {article.category}
                </span>
                <span>-</span>
                <span>{article.timestamp}</span>
            </div>
            <p className="mt-2 text-gray-600 hidden sm:block">
                {article.summary}
            </p>
        </div>
    </Link>
)

const ArticleList = ({ articles }) => {
    // Logic gom nhóm bài viết theo danh mục (giữ nguyên)
    const grouped = articles.reduce((acc, article) => {
        if (!acc[article.category]) acc[article.category] = []
        acc[article.category].push(article)
        return acc
    }, {})

    return (
        <section className="space-y-12">
            {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                    <div className="w-full h-[2px] bg-green-600 my-8"></div>

                    <h2 className="text-2xl font-bold text-green-700 uppercase mb-6 border-b-2 border-green-500 inline-block pb-1">
                        {category}
                    </h2>

                    <div className="space-y-8 mt-4">
                        {items.map(article => (
                            <ArticleListItem
                                key={article.id}
                                article={article}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </section>
    )
}

export default ArticleList