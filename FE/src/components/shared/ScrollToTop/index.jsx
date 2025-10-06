import React, { useState, useEffect } from 'react'
import { FaArrowUp } from 'react-icons/fa'

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false)

    const toggleVisibility = () => {
        const scrollPercentage =
            (window.scrollY /
                (document.documentElement.scrollHeight - window.innerHeight)) *
            100
        setIsVisible(scrollPercentage > 30)
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility)
        return () => {
            window.removeEventListener('scroll', toggleVisibility)
        }
    }, [])

    return (
        <button
            onClick={scrollToTop}
            className={`
                fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 
                text-white p-3 rounded-full shadow-lg z-50
                transition-all duration-500 ease-in-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
            `}
            aria-label="Lên đầu trang"
        >
            <FaArrowUp className="w-5 h-5" />
        </button>
    )
}

export default ScrollToTop
