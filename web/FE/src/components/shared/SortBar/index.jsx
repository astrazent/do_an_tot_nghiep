import React from 'react'
import { IoChevronDownSharp } from 'react-icons/io5'

const SortBar = ({ sortBy, onSortChange, hidePromotionButton = false }) => {
    return (
        <section className="mb-8 p-4 bg-white rounded-lg">
            <div className="mb-3">
                <span className="font-semibold text-gray-800">
                    Sắp xếp theo
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={() => onSortChange('newest')}
                    className={`px-3 h-9 text-sm rounded-md font-medium border border-gray-300 flex items-center justify-center ${
                        sortBy === 'newest'
                            ? 'bg-green-700 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                    Mới Nhất
                </button>

                {!hidePromotionButton && (
                    <button
                        onClick={() => onSortChange('promotion')}
                        className={`px-3 h-9 text-sm rounded-md font-medium border border-gray-300 flex items-center justify-center ${
                            sortBy === 'promotion'
                                ? 'bg-green-700 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                        Khuyến Mại
                    </button>
                )}

                <div className="relative inline-block h-9">
                    <select
                        value={sortBy.startsWith('ocop') ? sortBy : ''}
                        onChange={e => onSortChange(e.target.value)}
                        className="px-3 h-full text-sm font-medium text-green-800 bg-gray-100 rounded-md cursor-pointer appearance-none focus:outline-none focus:ring-0 flex items-center"
                    >
                        <option value="" disabled>
                            OCOP
                        </option>
                        <option value="ocop-3">OCOP 3 Sao</option>
                        <option value="ocop-4">OCOP 4 Sao</option>
                    </select>
                    <IoChevronDownSharp className="absolute right-2 top-1/2 -translate-y-1/2 text-green-700 text-xl pointer-events-none" />
                </div>

                <div className="relative inline-block w-40 h-9">
                    <select
                        value={sortBy.startsWith('rating') ? sortBy : ''}
                        onChange={e => onSortChange(e.target.value)}
                        className="px-3 h-full text-sm font-medium text-green-800 bg-gray-100 rounded-md cursor-pointer appearance-none focus:outline-none focus:ring-0 w-full flex items-center"
                    >
                        <option value="" disabled>
                            Đánh giá
                        </option>
                        <option value="rating-desc">Cao đến Thấp</option>
                        <option value="rating-asc">Thấp đến Cao</option>
                    </select>
                    <IoChevronDownSharp className="absolute right-2 top-1/2 -translate-y-1/2 text-green-700 text-xl pointer-events-none" />
                </div>

                <div className="relative inline-block h-9">
                    <select
                        value={sortBy.startsWith('price') ? sortBy : ''}
                        onChange={e => onSortChange(e.target.value)}
                        className="px-3 h-full text-sm font-medium text-green-800 bg-gray-100 rounded-md cursor-pointer appearance-none focus:outline-none focus:ring-0 flex items-center"
                    >
                        <option value="" disabled>
                            Giá
                        </option>
                        <option value="price-asc">Thấp đến Cao</option>
                        <option value="price-desc">Cao đến Thấp</option>
                    </select>
                    <IoChevronDownSharp className="absolute right-2 top-1/2 -translate-y-1/2 text-green-700 text-xl pointer-events-none" />
                </div>
            </div>
        </section>
    )
}

export default SortBar
