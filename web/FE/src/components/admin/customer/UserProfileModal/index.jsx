import React, { useEffect, useState } from 'react';
import { FiX, FiMapPin, FiMail, FiPhone, FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { getByIdUser } from '~/services/admin/userAdminService'; 

const UserProfileModal = ({ userId, isOpen, onClose }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && userId) {
            const fetchDetail = async () => {
                setLoading(true);
                try {
                    const res = await getByIdUser({ userId });
                    if (res && res.data) {
                        setUser(res.data);
                    }
                } catch (error) {
                    console.error("Lỗi tải hồ sơ:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetail();
        } else {
            setUser(null);
        }
    }, [isOpen, userId]);

    if (!isOpen) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const renderStatus = (status) => {
        return status === 1 
            ? <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full border border-green-200">Hoạt động</span>
            : <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full border border-gray-200">Ngừng hoạt động</span>;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm fade-in">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
                
                {/* Header Modal */}
                <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">Hồ sơ chi tiết</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-3">
                            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-gray-500 text-sm">Đang tải dữ liệu...</span>
                        </div>
                    ) : user ? (
                        <div className="space-y-6">
                            {/* Phần 1: Header thông tin cơ bản */}
                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                                        <img 
                                            src={user.avatar_url || "https://ui-avatars.com/api/?name=" + user.full_name + "&background=random"} 
                                            alt="Avatar" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                
                                {/* Tên và trạng thái */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h2 className="text-2xl font-bold text-gray-900">{user.full_name}</h2>
                                        {renderStatus(user.status)}
                                    </div>
                                    <p className="text-gray-500 flex items-center gap-2 text-sm">
                                        <FiUser className="inline"/> ID: <span className="font-mono text-gray-700">#{user.id}</span>
                                        <span className="text-gray-300">|</span>
                                        <span className="capitalize">{user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Khác'}</span>
                                    </p>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Phần 2: Grid thông tin chi tiết */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Cột trái: Liên hệ */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Thông tin liên hệ</h4>
                                    
                                    <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FiMail size={16}/></div>
                                            <div>
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="font-medium text-gray-800 break-all">{user.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><FiPhone size={16}/></div>
                                            <div>
                                                <p className="text-xs text-gray-500">Số điện thoại</p>
                                                <p className="font-medium text-gray-800">{user.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Cột phải: Địa chỉ */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Địa chỉ & Vị trí</h4>
                                    
                                    <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-red-100 text-red-600 rounded-lg"><FiMapPin size={16}/></div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-gray-500">Địa chỉ cụ thể</p>
                                                <p className="font-medium text-gray-800">{user.address}</p>
                                                <p className="text-sm text-gray-600">
                                                    {user.ward}, {user.district}, {user.city}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Phần 3: Footer thông tin hệ thống */}
                            <div className="bg-indigo-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <FiCalendar className="text-indigo-500"/>
                                    <div>
                                        <p className="text-xs text-gray-500">Ngày tạo</p>
                                        <p className="text-sm font-medium text-indigo-900">{formatDate(user.created_at)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FiClock className="text-indigo-500"/>
                                    <div>
                                        <p className="text-xs text-gray-500">Cập nhật lần cuối</p>
                                        <p className="text-sm font-medium text-indigo-900">{formatDate(user.updated_at)}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="text-center text-red-500 py-10">Không tìm thấy dữ liệu người dùng</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;