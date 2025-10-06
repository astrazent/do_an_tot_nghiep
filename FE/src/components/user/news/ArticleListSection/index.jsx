//src/components/user/product/ArticleListSection.jsx

import React from 'react'

const ArticleListSection = ({ title, articles }) => {
    return (
        <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase pb-2 border-b">
                {title}
            </h3>

            <div className="mt-4 space-y-4">
                {articles.map(article => (
                    <a
                        href="#"
                        key={article.id}
                        className="flex items-center gap-4 group p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                        />
                        <p className="font-semibold text-sm text-gray-800 group-hover:text-green-700">
                            {article.title}
                        </p>
                    </a>
                ))}
            </div>
        </div>
    )
}

export default ArticleListSection
