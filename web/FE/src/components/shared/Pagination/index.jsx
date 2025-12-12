import React from 'react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const baseButtonClass =
        'flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold transition-colors duration-300 hover:bg-green-50'
    const activeButtonClass =
        'flex items-center justify-center w-8 h-8 rounded-lg border border-green-600 bg-green-600 text-white font-semibold'
    const ellipsisClass =
        'flex items-center justify-center w-8 h-8 text-gray-500'

    if (totalPages <= 1) {
        return null
    }

    const createPageLinks = () => {
        const pages = []

        pages.push(1)

        if (currentPage > 3) {
            pages.push('...')
        }

        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i > 1 && i < totalPages) {
                pages.push(i)
            }
        }

        if (currentPage < totalPages - 2) {
            pages.push('...')
        }

        if (totalPages > 1) {
            pages.push(totalPages)
        }

        return [...new Set(pages)]
    }

    const pagesToRender = createPageLinks()

    return (
        <nav className="flex justify-center items-center space-x-2 mt-5">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${baseButtonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                &lt;
            </button>

            {pagesToRender.map((page, index) =>
                typeof page === 'number' ? (
                    <button
                        key={index}
                        onClick={() => onPageChange(page)}
                        className={
                            currentPage === page
                                ? activeButtonClass
                                : baseButtonClass
                        }
                    >
                        {page}
                    </button>
                ) : (
                    <span key={index} className={ellipsisClass}>
                        {page}
                    </span>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${baseButtonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                &gt;
            </button>
        </nav>
    )
}

export default Pagination
