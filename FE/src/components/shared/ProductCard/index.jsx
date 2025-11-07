import React from 'react'
import { Link } from 'react-router-dom'
import { BsStarFill, BsStar } from 'react-icons/bs'
import ocop3Star from '~/assets/icon/ocop/ocop-3-star.png'
import ocop4Star from '~/assets/icon/ocop/ocop-4-star.svg'

const ProductCard = ({
    image,
    name,
    price,
    oldPrice,
    ocop,
    rating = 0,
    reviewCount = 0,
    slug,
    size = 'medium',
}) => {
    const ocopMap = {
        3: ocop3Star,
        4: ocop4Star,
    }
    const ocopImg = ocopMap[ocop] || null

    const sizeStyles = {
        small: {
            card: 'w-45 h-80',
            ocopImg: 'w-15 h-10',
            title: 'text-base min-h-[40px]',
            price: 'text-base',
            star: 'text-sm',
        },
        medium: {
            card: 'w-56 h-96',
            ocopImg: 'w-16 h-10',
            title: 'text-sm min-h-[40px]',
            price: 'text-lg',
            star: 'text-sm',
        },
        large: {
            card: 'w-64 h-104',
            ocopImg: 'w-20 h-12',
            title: 'text-base min-h-[48px]',
            price: 'text-xl',
            star: 'text-base',
        },
    }

    const styles = sizeStyles[size] || sizeStyles.medium

    const stars = Array.from({ length: 5 }, (_, index) => {
        const starNumber = index + 1
        return starNumber <= rating ? (
            <BsStarFill
                key={index}
                className={`text-yellow-400 ${styles.star}`}
            />
        ) : (
            <BsStar key={index} className={`text-gray-300 ${styles.star}`} />
        )
    })

    let discountPercent = 0
    if (oldPrice && price) {
        const old = parseFloat(String(oldPrice).replace(/[^0-9.-]+/g, ''))
        const current = parseFloat(String(price).replace(/[^0-9.-]+/g, ''))
        if (old > current) {
            discountPercent = Math.round(((old - current) / old) * 100)
        }
    }

    return (
        <Link
            to={`/product/${slug}`}
            className={`block relative flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 font-sans border border-gray-100 ${styles.card}`}
        >
            <div className="w-full h-32 mb-2">
                <img src={image} alt={name} className="w-full h-full object-contain" />
            </div>

            {ocopImg && (
                <div className="absolute top-0 right-0 bg-white flex items-center justify-center p-1 shadow-sm">
                    <img
                        src={ocopImg}
                        alt={`OCOP ${ocop}`}
                        className={`${styles.ocopImg} object-contain`}
                    />
                </div>
            )}

            <h2 className={`font-normal text-gray-800 line-clamp-2 mb-1 ${styles.title}`}>
                {name}
            </h2>

            <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5">{stars}</div>
                    {reviewCount > 0 && (
                        <span className="text-gray-400 text-xs">({reviewCount})</span>
                    )}
                </div>
            </div>

            <div className="flex flex-col mt-auto">
                <div className="flex items-baseline">
                    <span className={`text-red-500 font-bold ${styles.price}`}>{price}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 min-h-[20px]">
                    {oldPrice && discountPercent > 0 && (
                        <>
                            <span className="bg-gray-100 rounded px-1 py-0.5 border border-gray-200">
                                -{discountPercent}%
                            </span>
                            <span className="line-through">{oldPrice}</span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default ProductCard
