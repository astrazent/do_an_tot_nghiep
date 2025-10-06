import React from 'react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const baseButtonClass =
        'flex items-center justify-center w-8 h-8 rounded-none border border-gray-300 bg-white text-gray-700 font-semibold transition-colors duration-300 hover:bg-green-50'
    const activeButtonClass =
        'flex items-center justify-center w-8 h-8 rounded-none border border-green-600 bg-green-600 text-white font-semibold'

    return (
        <nav className="flex justify-center items-center space-x-2 mt-5">
            <button
                onClick={() => onPageChange(1)}
                className={
                    currentPage === 1 ? activeButtonClass : baseButtonClass
                }
            >
                1
            </button>

            <button
                onClick={() => onPageChange(2)}
                className={
                    currentPage === 2 ? activeButtonClass : baseButtonClass
                }
            >
                2
            </button>

            <button
                onClick={() => onPageChange(3)}
                className={
                    currentPage === 3 ? activeButtonClass : baseButtonClass
                }
            >
                3
            </button>

            <span className="flex items-center justify-center w-10 h-10 text-gray-500">
                ...
            </span>

            <button
                onClick={() => onPageChange(totalPages)}
                className={
                    currentPage === totalPages
                        ? activeButtonClass
                        : baseButtonClass
                }
            >
                {totalPages}
            </button>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${baseButtonClass} disabled:opacity-50`}
            >
                &gt;
            </button>
        </nav>
    )
}

export default Pagination
