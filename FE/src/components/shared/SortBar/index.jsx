import React from 'react'
import { IoChevronDownSharp } from 'react-icons/io5'
const SortBar = ({ sortBy, onSortChange }) => {
    return (
        <section className="mb-8 p-4 bg-white rounded-lg flex flex-wrap items-center justify-between gap-3">
            <span className="font-semibold text-gray-800">Sắp xếp theo</span>

            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={() => onSortChange('newest')}
                    className={`px-3 py-1 text-sm rounded-md font-medium border border-gray-300 ${
                        sortBy === 'newest'
                            ? 'bg-green-700 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                    Mới Nhất
                </button>
                <button
                    onClick={() => onSortChange('promotion')}
                    className={`px-3 py-1 text-sm rounded-md font-medium border border-gray-300 ${
                        sortBy === 'promotion'
                            ? 'bg-green-700 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                    Khuyến Mại
                </button>
                <div className="relative inline-block">
                    <select
                        value={sortBy.startsWith('ocop') ? sortBy : ''}
                        onChange={e => onSortChange(e.target.value)}
                        className="px-3 py-1 pr-8 text-sm font-medium text-green-800 bg-gray-100 py-3 rounded-md cursor-pointer appearance-none focus:outline-none focus:ring-0"
                    >
                        <option value="" disabled>
                            OCOP
                        </option>
                        <option value="ocop-3">OCOP 3 Sao</option>
                        <option value="ocop-4">OCOP 4 Sao</option>
                    </select>

                    <IoChevronDownSharp className="absolute right-2 top-1/2 -translate-y-1/2 text-green-700 text-xl pointer-events-none" />
                </div>
                <div className="relative inline-block">
                    <select
                        value={sortBy.startsWith('rating') ? sortBy : ''}
                        onChange={e => onSortChange(e.target.value)}
                        className="px-3 py-1 pr-8 text-sm font-medium text-green-800 bg-gray-100 py-3 rounded-md cursor-pointer appearance-none focus:outline-none focus:ring-0"
                    >
                        <option value="" disabled>
                            Đánh giá
                        </option>
                        <option value="rating-desc">
                            Đánh giá: Cao đến Thấp
                        </option>
                        <option value="rating-asc">
                            Đánh giá: Thấp đến Cao
                        </option>
                    </select>

                    <IoChevronDownSharp className="absolute right-2 top-1/2 -translate-y-1/2 text-green-700 text-xl pointer-events-none" />
                </div>

                <div className="relative inline-block">
                    <select
                        value={sortBy.startsWith('price') ? sortBy : ''}
                        onChange={e => onSortChange(e.target.value)}
                        className="px-3 py-1 pr-8 text-sm font-medium text-green-800 bg-gray-100 py-3 rounded-md cursor-pointer appearance-none focus:outline-none focus:ring-0"
                    >
                        <option value="" disabled>
                            Giá
                        </option>
                        <option value="price-asc">Giá: Thấp đến Cao</option>
                        <option value="price-desc">Giá: Cao đến Thấp</option>
                    </select>

                    <IoChevronDownSharp className="absolute right-2 top-1/2 -translate-y-1/2 text-green-700 text-xl pointer-events-none" />
                </div>
            </div>
        </section>
    )
}

export default SortBar
