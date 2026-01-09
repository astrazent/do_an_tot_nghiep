import React from 'react'
import { Link } from 'react-router-dom'

const ArticleListSection = ({ title, articles }) => {
    return (
        <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase pb-2 border-b">
                {title}
            </h3>

            <div className="mt-4 space-y-4">
                {articles.map(article => {
                    const mainImage =
                        article.images && article.images.length > 0
                            ? article.images[0].url
                            : 'https://via.placeholder.com/64x64?text=No+Image'

                    return (
                        <Link
                            to={`/news-detail/${article.slug}`}
                            key={`article-${article.id}`}
                            className="flex items-center gap-4 group p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <img
                                src={mainImage}
                                alt={article.title}
                                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                            />
                            <p className="font-semibold text-sm text-gray-800 group-hover:text-green-700">
                                {article.title}
                            </p>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default ArticleListSection