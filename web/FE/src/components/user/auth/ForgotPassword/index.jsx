import React, { useState } from 'react'
import {
    FiMail,
    FiArrowLeft,
    FiCheckCircle,
    FiAlertCircle,
} from 'react-icons/fi'
import { RiLockPasswordLine } from 'react-icons/ri'

// Giả sử đường dẫn import hook của bạn
import { useForgotPassword } from '~/hooks/user/useUser'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    // Không cần state isLoading thủ công nữa, sẽ lấy từ mutation
    const [status, setStatus] = useState('idle')
    const [errorMessage, setErrorMessage] = useState('')

    // Tích hợp Hook useForgotPassword
    const { mutate, isPending: isLoading } = useForgotPassword({
        onSuccess: (data) => {
            // Xử lý khi API thành công
            setStatus('success')
            // Bạn có thể log data.message nếu cần: "Email reset mật khẩu đã được gửi"
        },
        onError: (error) => {
            // Xử lý khi API thất bại
            setStatus('error')
            // Lấy message lỗi từ API (tuỳ thuộc vào cấu trúc trả về của backend bạn)
            const msg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra, vui lòng thử lại.'
            setErrorMessage(msg)
        }
    })

    const validateEmail = email => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    }

    const handleSubmit = e => {
        e.preventDefault()
        setErrorMessage('')

        if (!email) {
            setErrorMessage('Vui lòng nhập địa chỉ email.')
            setStatus('error')
            return
        }

        if (!validateEmail(email)) {
            setErrorMessage('Địa chỉ email không hợp lệ.')
            setStatus('error')
            return
        }

        // Gọi mutation thay vì setTimeout
        // status 'idle' để reset trạng thái lỗi nếu có trước khi loading
        if (status === 'error') setStatus('idle') 
        
        mutate(email)
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-gray-200 p-12 space-y-8">
                <div className="text-center">
                    <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                        <RiLockPasswordLine size={44} />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800">
                        Quên mật khẩu?
                    </h2>
                    <p className="text-gray-500 mt-3 text-base">
                        Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại
                        mật khẩu.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="text-center">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                            <FiCheckCircle
                                className="text-green-600 mx-auto mb-3"
                                size={36}
                            />
                            <h3 className="text-green-800 font-semibold text-lg">
                                Đã gửi email!
                            </h3>
                            <p className="text-green-700 text-sm mt-2">
                                Kiểm tra hộp thư <strong>{email}</strong> để đặt
                                lại mật khẩu.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setStatus('idle')
                                setEmail('')
                                setErrorMessage('')
                            }}
                            className="text-green-600 hover:text-green-700 font-medium hover:underline"
                        >
                            Gửi lại bằng email khác
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Địa chỉ Email
                            </label>

                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="vidu@gmail.com"
                                    value={email}
                                    onChange={e => {
                                        setEmail(e.target.value)
                                        if (status === 'error')
                                            setStatus('idle')
                                    }}
                                    disabled={isLoading}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                                        status === 'error'
                                            ? 'border-red-400 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-green-500'
                                    } focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:text-gray-500`}
                                />
                            </div>

                            {status === 'error' && (
                                <div className="flex items-center text-red-600 text-sm mt-2">
                                    <FiAlertCircle className="mr-1" />
                                    {errorMessage}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                            ) : (
                                'Gửi yêu cầu'
                            )}
                        </button>
                    </form>
                )}

                <div className="text-center pt-4">
                    <a
                        href="/login"
                        className={`inline-flex items-center text-sm text-gray-500 hover:text-green-600 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        <FiArrowLeft className="mr-2" />
                        Quay lại đăng nhập
                    </a>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword