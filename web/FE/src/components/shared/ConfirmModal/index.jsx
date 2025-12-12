import React from 'react'
import { FiX, FiAlertCircle } from 'react-icons/fi'

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl p-6 w-80 max-w-full relative animate-slide-up">
                {}
                <button
                    onClick={onCancel}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FiX size={20} />
                </button>

                <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                    Xác nhận hành động
                </h2>

                {}
                <div className="flex justify-center mb-4 text-red-500">
                    <FiAlertCircle size={60} />
                </div>

                <p className="text-gray-600 text-sm mb-6 text-center">
                    {message}
                </p>

                <div className="flex justify-center gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                    >
                        Đồng ý
                    </button>
                </div>
            </div>

            {}
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes slide-up {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
                .animate-slide-up {
                    animation: slide-up 0.2s ease-out;
                }
            `}</style>
        </div>
    )
}

export default ConfirmModal
