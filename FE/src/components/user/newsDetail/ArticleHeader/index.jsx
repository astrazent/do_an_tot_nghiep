import React from 'react'
import { FaRegClock } from 'react-icons/fa'

const ArticleHeader = () => {
    return (
        <header className="border-b pb-4 mb-4">
            <h1 className="font-bold text-3xl md:text-4xl text-gray-900 mb-2">
                Xúc xích cốm – hương vị Hà Nội trong từng miếng ăn
            </h1>
            <div className="flex items-center text-sm text-gray-500">
                <span className="font-semibold uppercase text-green-600">
                    PHAN NGUYÊN,
                </span>
                <FaRegClock className="mx-1.5" />
                <span>21:05 07/10/2025</span>
            </div>
        </header>
    )
}

export default ArticleHeader
