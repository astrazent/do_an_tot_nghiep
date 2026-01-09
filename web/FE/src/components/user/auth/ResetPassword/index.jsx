import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom' // Cần cài react-router-dom
import {
    FiLock,
    FiEye,
    FiEyeOff,
    FiCheckCircle,
    FiArrowLeft,
    FiAlertCircle,
    FiXCircle,
} from 'react-icons/fi'
import { RiKey2Line } from 'react-icons/ri'

import { useVerifyResetPasswordToken, useResetPassword } from '~/hooks/user/useUser'
import { useAlert } from '~/contexts/AlertContext'

const ResetPassword = () => {
    // --- Hooks & Utils ---
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { showAlert } = useAlert()
    
    // Lấy token từ URL
    const token = searchParams.get('token')

    // --- API Mutations ---
    const verifyTokenMutation = useVerifyResetPasswordToken()
    const resetPasswordMutation = useResetPassword()

    // --- State ---
    const [tokenStatus, setTokenStatus] = useState('verifying') // 'verifying' | 'valid' | 'invalid'
    const [email, setEmail] = useState('') // Lưu email trả về từ verify (nếu cần hiển thị)

    // State form
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    })

    // State hiển thị
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    
    // State submit form
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false) // Đã đổi pass thành công
    const [errorMessage, setErrorMessage] = useState('')

    // --- 1. Verify Token khi Mount ---
    useEffect(() => {
        if (!token) {
            setTokenStatus('invalid')
            return
        }

        // Gọi API verify token
        verifyTokenMutation.mutate(token, {
            onSuccess: (data) => {
                // Kiểm tra cấu trúc response theo yêu cầu
                if (data && data.valid) {
                    setTokenStatus('valid')
                    setEmail(data.email)
                } else {
                    setTokenStatus('invalid')
                }
            },
            onError: (error) => {
                console.error('Token verification failed:', error)
                setTokenStatus('invalid')
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]) // Chỉ chạy 1 lần khi có token

    // --- Handlers ---
    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        if (errorMessage) setErrorMessage('')
    }

    const handleSubmit = e => {
        e.preventDefault()
        setErrorMessage('')

        const { password, confirmPassword } = formData

        // Validate Client-side
        if (!password || !confirmPassword) {
            setErrorMessage('Vui lòng điền đầy đủ thông tin.')
            return
        }
        if (password.length < 6) {
            setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự.')
            return
        }
        if (password !== confirmPassword) {
            setErrorMessage('Mật khẩu nhập lại không khớp.')
            return
        }

        // Gọi API Reset Password
        setIsSubmitting(true)
        resetPasswordMutation.mutate(
            { token, newPassword: password },
            {
                onSuccess: () => {
                    setIsSubmitting(false)
                    setIsSuccess(true)
                },
                onError: (error) => {
                    setIsSubmitting(false)
                    // Lấy message từ response lỗi API
                    const msg = error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.'
                    setErrorMessage(msg)
                    showAlert(msg, { type: 'error' })
                }
            }
        )
    }

    // --- Render Logic ---

    // 1. Màn hình Loading khi đang Verify Token
    if (tokenStatus === 'verifying') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Đang xác thực liên kết...</p>
                </div>
            </div>
        )
    }

    // 2. Màn hình Token Không Hợp Lệ / Hết Hạn
    if (tokenStatus === 'invalid') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className=" w-full max-w-md rounded-2xl shadow-xl p-8 border border-red-100 text-center bg-gray-50">
                    <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <FiXCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Liên kết không hợp lệ
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Liên kết đặt lại mật khẩu này không tồn tại hoặc đã hết hạn. 
                        Vui lòng yêu cầu cấp lại mật khẩu mới.
                    </p>
                    <a
                        href="/forgot-password" 
                        className="inline-block w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-md"
                    >
                        Gửi lại yêu cầu
                    </a>
                    <div className="mt-4">
                        <a href="/login" className="text-sm text-gray-500 hover:text-red-600 transition-colors">
                            Quay về đăng nhập
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    // 3. Màn hình Đổi Mật Khẩu (Token Valid)
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-8 space-y-6 border border-green-100">
                {/* --- Header --- */}
                <div className="text-center">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        <RiKey2Line size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">
                        Đặt lại mật khẩu
                    </h2>
                    {email && (
                        <p className="text-green-600 text-xs font-medium mt-1 bg-green-50 inline-block px-2 py-1 rounded-full">
                            {email}
                        </p>
                    )}
                    <p className="text-gray-500 mt-2 text-sm">
                        Tạo mật khẩu mới mạnh mẽ và an toàn hơn cho tài khoản của bạn.
                    </p>
                </div>

                {/* --- Success State (Sau khi đổi pass thành công) --- */}
                {isSuccess ? (
                    <div className="text-center animate-fade-in">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                            <div className="flex justify-center mb-3">
                                <FiCheckCircle
                                    className="text-green-600"
                                    size={40}
                                />
                            </div>
                            <h3 className="text-green-800 font-bold text-lg">
                                Thành công!
                            </h3>
                            <p className="text-green-700 mt-2">
                                Mật khẩu của bạn đã được cập nhật. Hãy đăng nhập lại bằng mật khẩu mới.
                            </p>
                        </div>
                        <a
                            href="/login"
                            className="w-full block text-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                        >
                            Đăng nhập ngay
                        </a>
                    </div>
                ) : (
                    /* --- Form State --- */
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Mật khẩu mới */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Mật khẩu mới
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className={`block w-full pl-10 pr-10 py-3 border ${errorMessage ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-600 focus:outline-none"
                                >
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Nhập lại mật khẩu */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Nhập lại mật khẩu
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                </div>
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className={`block w-full pl-10 pr-10 py-3 border ${errorMessage ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-600 focus:outline-none"
                                >
                                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="flex items-center text-red-600 text-sm animate-pulse bg-red-50 p-2 rounded border border-red-100">
                                <FiAlertCircle className="mr-2 flex-shrink-0" size={16} />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Đang xử lý...
                                </div>
                            ) : (
                                'Đổi mật khẩu'
                            )}
                        </button>
                    </form>
                )}

                {/* --- Footer --- */}
                <div className="flex items-center justify-center mt-6">
                    <a
                        href="/login"
                        className="flex items-center text-sm font-medium text-gray-500 hover:text-green-600 transition-colors duration-200 group"
                    >
                        <FiArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                        Quay lại đăng nhập
                    </a>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword