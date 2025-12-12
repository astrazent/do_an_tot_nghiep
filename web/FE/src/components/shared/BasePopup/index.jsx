import React, { useEffect, useRef, useState } from 'react'
import { FiX } from 'react-icons/fi'

const BasePopup = ({ title, children, onClose }) => {
    const [scrolled, setScrolled] = useState(false)
    const contentRef = useRef(null)

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        const handleScroll = () => {
            if (contentRef.current) {
                setScrolled(contentRef.current.scrollTop > 0)
            }
        }

        const el = contentRef.current
        el.addEventListener('scroll', handleScroll)

        return () => {
            document.body.style.overflow = 'auto'
            el.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative overflow-hidden flex flex-col">
                <div
                    className={`
                        bg-white
                        flex items-center justify-center
                        py-3 px-6
                        relative
                        transition-shadow duration-300
                        ${scrolled ? 'shadow-md backdrop-blur-sm' : ''}
                    `}
                >
                    {title && (
                        <h2 className="text-xl font-bold text-center flex-1">
                            {title}
                        </h2>
                    )}
                    <button
                        onClick={onClose}
                        className="absolute top-1 right-0 text-gray-600 hover:text-black transition transform hover:scale-110 active:scale-95"
                        style={{ fontSize: '1.5rem', lineHeight: 1 }}
                    >
                        <FiX />
                    </button>
                </div>

                <div
                    ref={contentRef}
                    className="p-6 overflow-y-auto max-h-[75vh]"
                >
                    {children}
                </div>
            </div>
        </div>
    )
}

export default BasePopup
