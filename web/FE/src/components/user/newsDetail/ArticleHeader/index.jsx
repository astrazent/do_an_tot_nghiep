import React from 'react'
import { FaRegClock } from 'react-icons/fa'

const ArticleHeader = ({ title, author, publishedAt }) => {
    return (
        <header className="border-b pb-4 mb-4">
            <h1 className="font-bold text-3xl md:text-4xl text-gray-900 mb-2">
                {title}
            </h1>
            <div className="flex items-center text-sm text-gray-500">
                {author && (
                    <span className="font-semibold uppercase text-green-600">
                        {author},
                    </span>
                )}
                {publishedAt && (
                    <>
                        <FaRegClock className="mx-1.5" />
                        <span>
                            {new Date(publishedAt).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            })}{' '}
                            {new Date(publishedAt).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </>
                )}
            </div>
        </header>
    )
}

export default ArticleHeader
