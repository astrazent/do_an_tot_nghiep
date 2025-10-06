//src/components/FeaturedSection.jsx
import React from 'react'

const FeaturedArticleMain = ({ article }) => (
    <div className="cursor-pointer group">
        <div className="overflow-hidden rounded-md">
            <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
            />
        </div>
        <h2 className="mt-4 text-3xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-green-600">
            {article.title}
        </h2>
        <p className="mt-2 text-gray-600">{article.summary}</p>
    </div>
)

const FeaturedArticleSide = ({ article }) => (
    <div className="flex flex-col cursor-pointer group">
        <div className="w-full overflow-hidden rounded-md">
            <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-32 object-cover"
            />
        </div>
        <h3 className="mt-2 text-base font-bold text-gray-800 transition-colors duration-300 group-hover:text-green-600">
            {article.title}
        </h3>
    </div>
)

const FeaturedSection = ({ mainArticle, sideArticles }) => {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <FeaturedArticleMain article={mainArticle} />
            </div>

            <div className="flex flex-col gap-6">
                {sideArticles.map(article => (
                    <FeaturedArticleSide key={article.id} article={article} />
                ))}
            </div>
        </section>
    )
}

export default FeaturedSection
