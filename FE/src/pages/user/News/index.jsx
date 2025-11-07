import React, { useEffect } from 'react'
import FeaturedSection from '~/components/user/news/FeaturedSection'
import HotTopics from '~/components/user/news/HotTopic'
import ArticleList from '~/components/user/news/ArticleList'
import { usePosts, useInfinitePosts } from '~/hooks/user/usePost'

const transformPostData = post => {
    if (!post) return null
    return {
        id: post.id,
        title: post.title,
        summary: post.description,
        imageUrl:
            post.images?.[0]?.url ||
            'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
        category: post.post_type_name,
        timestamp: new Date(post.published_at).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }),
        slug: post.slug,
    }
}

function News() {
    // --- Featured Posts ---
    const {
        data: featuredPostsData,
        isLoading: isFeaturedLoading,
        isError: isFeaturedError,
    } = usePosts({ limit: 3, sort: 'newest' })

    // --- Hot Topics ---
    const {
        data: hotTopicPostsData,
        isLoading: isHotTopicsLoading,
        isError: isHotTopicsError,
    } = usePosts({
        type: 'postType',
        slug: 'bai-viet-noi-bat',
        limit: 8,
    })

    // --- Infinite scroll cho list ---
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isListLoading,
        isError: isListError,
    } = useInfinitePosts({
        sort: 'post_type',
        limit: 10,
    })

    // --- Chuyển đổi dữ liệu ---
    const mainArticle = featuredPostsData
        ? transformPostData(featuredPostsData[0])
        : null
    const sideArticles =
        featuredPostsData?.length > 1
            ? featuredPostsData.slice(1, 3).map(transformPostData)
            : []

    const hotTopicArticles = hotTopicPostsData
        ? hotTopicPostsData.map(transformPostData)
        : []

    // Lấy toàn bộ bài viết từ các page
    const listPostsData = data?.pages.flat() || []

    const listArticles = listPostsData
        .filter(post => post.post_type_slug !== 'bai-viet-noi-bat')
        .map(transformPostData)

    // --- Infinite scroll event ---
    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } =
                document.documentElement
            if (
                scrollTop + clientHeight >= scrollHeight - 800 &&
                hasNextPage &&
                !isFetchingNextPage
            ) {
                fetchNextPage()
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [fetchNextPage, hasNextPage, isFetchingNextPage])

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="container mx-auto p-4 md:p-8">
                {/* Featured Section */}
                {isFeaturedLoading && (
                    <p className="text-center py-4">
                        Đang tải bài viết nổi bật...
                    </p>
                )}
                {isFeaturedError && (
                    <p className="text-center py-4 text-red-500">
                        Đã xảy ra lỗi khi tải bài viết nổi bật.
                    </p>
                )}
                {mainArticle && (
                    <FeaturedSection
                        mainArticle={mainArticle}
                        sideArticles={sideArticles}
                    />
                )}

                {/* Hot Topics */}
                {isHotTopicsLoading && (
                    <p className="text-center py-4 mt-8">
                        Đang tải chủ đề nóng...
                    </p>
                )}
                {isHotTopicsError && (
                    <p className="text-center py-4 mt-8 text-red-500">
                        Đã xảy ra lỗi khi tải chủ đề nóng.
                    </p>
                )}
                {hotTopicArticles.length > 0 && (
                    <HotTopics articles={hotTopicArticles} />
                )}

                {/* Article List + Infinite Scroll */}
                {isListLoading && (
                    <p className="text-center py-4 mt-8">
                        Đang tải danh sách bài viết...
                    </p>
                )}
                {isListError && (
                    <p className="text-center py-4 mt-8 text-red-500">
                        Đã xảy ra lỗi khi tải danh sách bài viết.
                    </p>
                )}
                {listArticles.length > 0 && (
                    <ArticleList articles={listArticles} />
                )}
                {isFetchingNextPage && (
                    <p className="text-center py-4 text-gray-500">
                        Đang tải thêm bài viết...
                    </p>
                )}
                {!hasNextPage && !isListLoading && (
                    <p className="text-center py-6 text-gray-400">
                        Đã hiển thị tất cả bài viết.
                    </p>
                )}
            </div>
        </div>
    )
}

export default News
