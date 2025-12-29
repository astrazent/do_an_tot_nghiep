import { useEffect } from 'react'
import { HiX } from 'react-icons/hi'
import { formatCurrency } from '~/utils/formatCurrency'

const BaseModal = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-4xl',
    saleValue,
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-lg shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden animate-slide-up`}
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 flex justify-between items-center bg-white flex-shrink-0 gap-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-900">
                            {title}
                        </h2>
                        {saleValue !== undefined && (
                            <div
                                className={`px-3 py-1 rounded-lg font-medium text-sm
                            ${
                                saleValue <= 100
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-green-100 text-green-700'
                            }`}
                            >
                                {saleValue <= 100
                                    ? `${saleValue}%`
                                    : formatCurrency(saleValue)}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                        style={{ padding: 0 }}
                    >
                        <HiX size={24} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto pb-3">{children}</div>
            </div>
        </div>
    )
}

export default BaseModal
