import React, { useState } from 'react'
import ArticleCard from '~/components/shared/ArticleCard'
import Pagination from '~/components/shared/Pagination'
import { usePosts } from '~/hooks/user/usePost'

const LatestNews = ({
    title = 'Tin tức mới nhất',
    backgroundColor = 'bg-gray-100',
    articlesPerPage = 8,
}) => {
    const [currentPage, setCurrentPage] = useState(1)

    const {
        data: allArticles = [],
        isLoading,
        isError,
    } = usePosts({
        type: 'all',
        limit: 24,
        offset: 0,
        sort: 'newest',
    })
    const formattedArticles = allArticles.map(article => {
        const mainImage = article.images?.[0]?.url || null

        return {
            id: article.id,
            title: article.title,
            slug: article.slug,
            image: mainImage,
            date: new Date(article.published_at).toLocaleDateString('vi-VN'),
        }
    })

    const totalPages = Math.ceil(formattedArticles.length / articlesPerPage)

    const currentArticles = formattedArticles.slice(
        (currentPage - 1) * articlesPerPage,
        currentPage * articlesPerPage
    )

    const handlePageChange = pageNumber => {
        setCurrentPage(pageNumber)
    }

    if (isLoading) {
        return (
            <section className={`${backgroundColor} py-16`}>
                <div className="container mx-auto text-center">
                    <p>Đang tải tin tức...</p>
                </div>
            </section>
        )
    }

    if (isError || formattedArticles.length === 0) {
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
                        {currentArticles.map(article => (
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

                {totalPages > 1 && (
                    <div className="px-[134px] mt-12">
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

export default LatestNews
