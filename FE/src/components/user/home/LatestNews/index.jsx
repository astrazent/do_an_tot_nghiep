import React, { useState, useEffect } from 'react'
import ArticleCard from '~/components/shared/ArticleCard'
import Pagination from '~/components/shared/Pagination'

const PLACEHOLDER_IMAGE =
    'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?semt=ais_hybrid&w=740&q=80'

const LatestNews = ({
    title = 'Tin tức mới nhất',
    backgroundColor = 'bg-gray-100',
    articlesPerPage = 4,
}) => {
    const [allArticles, setAllArticles] = useState([])

    const [currentPage, setCurrentPage] = useState(1)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(
                    'http://localhost:8023/v1/post/list'
                )
                if (!response.ok) {
                    throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`)
                }
                const result = await response.json()
                const rawArticles = result.data || []

                const sortedArticles = rawArticles.sort(
                    (a, b) =>
                        new Date(b.published_at) - new Date(a.published_at)
                )

                const formattedArticles = sortedArticles.map(article => ({
                    id: article.id,
                    title: article.title,
                    slug: article.slug,
                    image: PLACEHOLDER_IMAGE,
                    date: new Date(article.published_at).toLocaleDateString(
                        'vi-VN'
                    ),
                }))

                setAllArticles(formattedArticles)
            } catch (e) {
                console.error('Không thể lấy danh sách bài viết:', e)
                setError('Không thể tải tin tức. Vui lòng thử lại sau.')
            } finally {
                setLoading(false)
            }
        }

        fetchArticles()
    }, [])

    const totalPages = Math.ceil(allArticles.length / articlesPerPage)

    const currentArticles = allArticles.slice(
        (currentPage - 1) * articlesPerPage,
        currentPage * articlesPerPage
    )

    const handlePageChange = pageNumber => {
        setCurrentPage(pageNumber)
    }

    if (loading) {
        return (
            <section className={`${backgroundColor} py-16`}>
                <div className="container mx-auto text-center">
                    <p>Đang tải tin tức...</p>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className={`${backgroundColor} py-16`}>
                <div className="container mx-auto text-center text-red-500">
                    <p>{error}</p>
                </div>
            </section>
        )
    }

    if (allArticles.length === 0) {
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
                        {}
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

                {}
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
