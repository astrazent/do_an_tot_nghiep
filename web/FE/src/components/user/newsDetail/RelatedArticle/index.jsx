import React, { useState } from 'react'
import ArticleCard from '~/components/shared/ArticleCard'
import Pagination from '~/components/shared/Pagination'

const RelatedArticle = ({ title = 'Bài viết liên quan', articles = [] }) => {
    const [currentPage, setCurrentPage] = useState(1)

    const articlesPerPage = 6

    const totalPages = Math.ceil(articles.length / articlesPerPage)
    const indexOfLastArticle = currentPage * articlesPerPage
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
    const currentArticles = articles.slice(
        indexOfFirstArticle,
        indexOfLastArticle
    )

    const handlePageChange = pageNumber => {
        setCurrentPage(pageNumber)
    }

    if (!articles || articles.length === 0) return null

    return (
        <section className="pt-14">
            <div className="pt-8 border-t">
                {title && (
                    <h2 className="text-xl font-bold flex items-center uppercase mb-4">
                        <span className="w-1 h-6 bg-green-600 mr-2 inline-block"></span>
                        {title}
                    </h2>
                )}
                <div className="grid grid-cols-3 gap-8">
                    {currentArticles.map(article => (
                        <ArticleCard
                            key={article.id}
                            image={article.image}
                            title={article.title}
                            date={article.date}
                            hoverEffect={false}
                            imageHeight="h-40"
                        />
                    ))}
                </div>
                {totalPages > 1 && (
                    <div className="mt-10">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </section>
    )
}

export default RelatedArticle
