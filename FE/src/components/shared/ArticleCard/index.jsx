import React from 'react'

const ArticleCard = ({ image, title, date }) => {
    return (
        <article className="group">
            <a href="#" className="block">
                <div className="overflow-hidden rounded-lg shadow-md mb-4">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight group-hover:text-green-700 transition-colors duration-300">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500">{date}</p>
                </div>
            </a>
        </article>
    )
}

export default ArticleCard
