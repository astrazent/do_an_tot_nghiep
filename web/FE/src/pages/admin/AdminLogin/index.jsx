import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm dòng này
import logo from '../../../assets/icon/logo/brand-logo.png';
import { adminLogin } from '~/services/admin/authAdminService';
import { useDispatch } from 'react-redux';
import { updateAccount } from '~/Redux/reducers/accountReducer';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [error, setError] = useState(''); // Thông báo lỗi
    const dispatch = useDispatch()
    const navigate = useNavigate(); // Hook để chuyển hướng

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = {
                username: username.trim(),
                password_hash: password,
            };

            const response = await adminLogin(data);

            console.log('Login thành công:', response.admin);
            dispatch(updateAccount({
                fullName: response.admin.full_name,
                role_id: response.admin.role_id,
            }))

            navigate('/admin');
        } catch (err) {
            let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';

            if (err.response) {
                const status = err.response.status;
                if (status === 401) {
                    errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng.';
                } else if (status === 400) {
                    errorMessage = err.response.data?.message || 'Dữ liệu không hợp lệ.';
                } else {
                    errorMessage = err.response.data?.message || errorMessage;
                }
            } else if (err.request) {
                errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
            }

            setError(errorMessage);
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-300">
            {/* Background dots pattern */}
            <div
                className="absolute inset-0 pointer-events-none z-0 opacity-60"
                style={{
                    backgroundImage: 'radial-gradient(#d1d5db 1.5px, transparent 1.5px)',
                    backgroundSize: '24px 24px',
                }}
            ></div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-10 overflow-hidden transform transition-all duration-300 border border-gray-100 dark:border-gray-700">
                {/* Header with Logo */}
                <div className="pt-10 pb-6 px-8 text-center bg-gradient-to-b from-green-50/50 to-transparent dark:from-green-900/10 dark:to-transparent">
                    <div className="relative w-32 h-32 mx-auto mb-4 bg-white dark:bg-gray-700 rounded-full shadow-sm flex items-center justify-center p-2 ring-4 ring-white dark:ring-gray-700">
                        <img
                            alt="Logo Bếp Sạch Việt"
                            className="w-full h-full object-contain rounded-full"
                            src={logo}
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 tracking-tight">
                        BẾP SẠCH VIỆT
                    </h1>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">
                        Quản Trị Hệ Thống
                    </p>
                </div>

                {/* Form */}
                <div className="px-8 pb-10">
                    {/* Hiển thị lỗi nếu có */}
                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="username">
                                Tên đăng nhập / Email
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-green-700 sm:text-sm bg-gray-50 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors outline-none"
                                    id="username"
                                    name="username"
                                    placeholder="admin@bepsachviet.com"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">
                                Mật khẩu
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-green-700 sm:text-sm bg-gray-50 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors outline-none"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 cursor-pointer"
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={loading}
                                />
                                <label className="ml-2 block text-sm text-gray-600 dark:text-gray-400 cursor-pointer" htmlFor="remember-me">
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>
                            <div className="text-sm">
                                <a className="font-medium text-green-700 hover:text-green-800 dark:hover:text-green-300 transition-colors" href="#" onClick={(e) => e.preventDefault()}>
                                    Quên mật khẩu?
                                </a>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 transition-all duration-200 shadow-lg hover:shadow-xl dark:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={loading}
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                </span>
                                {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-gray-700/50 px-8 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        © 2023 Bếp Sạch Việt. Bản quyền đã được bảo hộ.
                    </p>
                </div>
            </div>
        </div>
    );
}