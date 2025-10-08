import React from 'react'
import ArticleCard from '~/components/shared/ArticleCard'
import Pagination from '~/components/shared/Pagination'

const LatestNews = ({
    title = 'Tin tức mới nhất',
    articles = [],
    currentPage,
    totalPages,
    onPageChange,
    backgroundColor = 'bg-gray-100',
}) => {
    if (!articles || articles.length === 0) {
        return null
    }

    return (
        <section className={`${backgroundColor} py-16`}>
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex-1 h-px bg-green-500 max-w-32"></div>
                        <h2 className="text-3xl font-bold text-green-800 uppercase">
                            {title}
                        </h2>
                        <div className="flex-1 h-px bg-green-500 max-w-32"></div>
                    </div>
                </div>

                <div className="px-[134px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {articles.map(article => (
                            <ArticleCard
                                key={article.id}
                                image={article.image}
                                title={article.title}
                                date={article.date}
                                slug={article.slug}
                            />
                        ))}
                    </div>
                </div>

                <div className="px-[134px]">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
        </section>
    )
}

export default LatestNews