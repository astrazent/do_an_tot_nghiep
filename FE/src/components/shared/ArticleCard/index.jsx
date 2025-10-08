import React from 'react'
import { Link } from 'react-router-dom' // 1. Import Link

// 2. Thêm 'slug' vào danh sách props
const ArticleCard = ({
    image,
    title,
    date,
    slug,
    hoverEffect = true,
    imageHeight = 'h-48',
}) => {
    return (
        <article className="group">
            {/* 3. Thay thế thẻ <a> bằng component <Link> */}
            <Link
                to={`/news-detail/${slug}`} // 4. Sử dụng prop 'to' với đường dẫn động
                className="block"
            >
                <div
                    className={`overflow-hidden rounded-lg shadow-md mb-4 ${imageHeight}`}
                >
                    <img
                        src={image}
                        alt={title}
                        className={`w-full h-full object-cover transform transition-transform duration-300 ease-in-out ${
                            hoverEffect ? 'group-hover:scale-105' : ''
                        }`}
                    />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight group-hover:text-green-700 transition-colors duration-300 line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500">{date}</p>
                </div>
            </Link>
        </article>
    )
}

export default ArticleCard