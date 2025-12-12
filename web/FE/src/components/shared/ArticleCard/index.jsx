import React from 'react'
import { Link } from 'react-router-dom'

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
            <Link to={`/news-detail/${slug}`} className="block">
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
