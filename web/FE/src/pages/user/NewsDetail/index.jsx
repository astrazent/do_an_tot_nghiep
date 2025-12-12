import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { usePostBySlug, useRelatedPostsBySlug } from '~/hooks/user/usePost'

import ArticleHeader from '~/components/user/newsDetail/ArticleHeader'
import ArticleBody from '~/components/user/newsDetail/ArticleBody'
import SocialSidebar from '~/components/user/newsDetail/SocialSidebar'
import RelatedArticle from '~/components/user/newsDetail/RelatedArticle'

function NewsDetail() {
    const { slug } = useParams()

    const {
        data: postData,
        isLoading: isLoadingPost,
        isError: isErrorPost,
    } = usePostBySlug(slug)

    const {
        data: relatedPostsData,
        isLoading: isLoadingRelated,
        isError: isErrorRelated,
    } = useRelatedPostsBySlug(slug)

    const relatedArticles = useMemo(() => {
        if (!relatedPostsData) return []
        const { relatedByCategory, relatedByPostType } = relatedPostsData
        const allRelatedPosts = [
            ...(relatedByCategory || []),
            ...(relatedByPostType || []),
        ]
        const uniquePosts = Array.from(
            new Map(allRelatedPosts.map(post => [post.id, post])).values()
        )
        return uniquePosts.map(post => ({
            id: post.id,
            image:
                post.images && post.images.length > 0
                    ? post.images[0]
                    : '/path/to/default-image.png',
            title: post.title,
            date: new Date(post.published_at).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }),
        }))
    }, [relatedPostsData])

    if (isLoadingPost) {
        return (
            <div className="min-h-screen text-center p-10">
                Đang tải bài viết...
            </div>
        )
    }

    if (isErrorPost || !postData) {
        return (
            <div className="min-h-screen text-center p-10 text-red-500">
                Không tìm thấy bài viết hoặc có lỗi xảy ra.
            </div>
        )
    }

    const highlights = postData.description
        ? postData.description.split('. ')
        : []
    const content = postData.content ? [postData.content] : []

    const images =
        postData.images
            ?.sort((a, b) => a.display_order - b.display_order)
            .map(imageObj => ({
                url: imageObj.url,
                caption: imageObj.caption,
            })) || []

    return (
        <div className="min-h-screen">
            <main className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg relative">
                <SocialSidebar />
                <ArticleHeader
                    title={postData.title}
                    author={postData.author_name}
                    publishedAt={postData.published_at}
                />
                <ArticleBody
                    highlights={highlights}
                    content={content}
                    images={images}
                />

                {isLoadingRelated && (
                    <p className="text-center mt-8">
                        Đang tải bài viết liên quan...
                    </p>
                )}
                {isErrorRelated && (
                    <p className="text-center mt-8 text-red-500">
                        Không thể tải được bài viết liên quan.
                    </p>
                )}
                {!isLoadingRelated &&
                    !isErrorRelated &&
                    relatedArticles.length > 0 && (
                        <RelatedArticle
                            title="Các bài viết liên quan"
                            articles={relatedArticles}
                        />
                    )}
            </main>
        </div>
    )
}

export default NewsDetail
