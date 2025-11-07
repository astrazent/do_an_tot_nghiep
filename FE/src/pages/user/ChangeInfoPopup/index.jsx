import React, { useState, useEffect } from 'react';
import { useCheckPasswordAndUpdate } from '~/hooks/user/useUser';
import { useAlert } from '~/contexts/AlertContext'; // Đảm bảo bạn đã import useAlert

const ChangeInfoPopup = ({
    isOpen,
    onClose,
    popupType,
    currentPassword,
    setCurrentPassword,
    newValue,
    setNewValue,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    userId,
    refetchUser,
}) => {
    // 1. Lấy hàm showAlert từ context
    const { showAlert } = useAlert();

    // Gọi hook mutation
    const {
        mutateAsync: updateUser,
        isLoading,
        error: mutationError,
    } = useCheckPasswordAndUpdate();

    const [displayError, setDisplayError] = useState(null);

    // Reset lỗi khi popup được mở
    useEffect(() => {
        if (isOpen) {
            setDisplayError(null);
        }
    }, [isOpen]);

    // Hiển thị lỗi từ hook mutation bên trong form
    useEffect(() => {
        if (mutationError) {
            const errorMessage =
                mutationError.response?.data?.message ||
                'Đã có lỗi xảy ra. Vui lòng thử lại.';
            setDisplayError(errorMessage);
        }
    }, [mutationError]);

    if (!isOpen) return null;

    const getTitleAndLabel = () => {
        switch (popupType) {
            case 'username':
                return {
                    title: 'Thay đổi Tên đăng nhập',
                    label: 'Tên đăng nhập mới',
                };
            case 'email':
                return { title: 'Thay đổi Email', label: 'Email mới' };
            case 'password':
                return { title: 'Thay đổi Mật khẩu', label: 'Mật khẩu mới' };
            default:
                return { title: '', label: '' };
        }
    };

    const { title, label } = getTitleAndLabel();

    const handleSubmit = async () => {
        setDisplayError(null);

        // Kiểm tra xác nhận mật khẩu mới
        if (popupType === 'password') {
            if (!newPassword) {
                setDisplayError('Mật khẩu mới không được để trống.');
                return;
            }
            if (newPassword !== confirmNewPassword) {
                setDisplayError('Mật khẩu mới không khớp.');
                return;
            }
        }

        try {
            // Xây dựng đối tượng data để gửi đi
            const dataToUpdate = {
                userId,
                old_password: currentPassword,
                provider: 'local',
            };

            if (popupType === 'password') {
                dataToUpdate.password = newPassword;
            } else {
                dataToUpdate[popupType] = newValue;
            }

            // Gọi API
            await updateUser(dataToUpdate);

            // **TÍCH HỢP THÔNG BÁO THÀNH CÔNG**
            showAlert('Cập nhật thông tin thành công!', 'success');

            // Cập nhật lại dữ liệu người dùng và đóng popup
            if (refetchUser) {
                refetchUser();
            }
            onClose();
        } catch (err) {
            // **TÍCH HỢP THÔNG BÁO THẤT BẠI**
            const errorMessage =
                err.response?.data?.message ||
                'Cập nhật thất bại. Vui lòng thử lại.';
            showAlert(errorMessage, 'error');

            // Lỗi đã được useEffect ở trên xử lý để hiển thị trong form
            console.error('Update failed:', err);
        }
    };

    const renderNewValueInput = () => {
        if (popupType === 'password') {
            return (
                <>
                    <div>
                        <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            {label}
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="confirmNewPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Xác nhận mật khẩu mới
                        </label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) =>
                                setConfirmNewPassword(e.target.value)
                            }
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                            required
                        />
                    </div>
                </>
            );
        }

        return (
            <div>
                <label
                    htmlFor="newValue"
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
                <input
                    type={popupType === 'email' ? 'email' : 'text'}
                    id="newValue"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    required
                />
            </div>
        );
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {title}
                </h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="currentPassword"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nhập mật khẩu hiện tại để xác nhận
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                required
                            />
                        </div>
                        {renderNewValueInput()}
                    </div>

                    {displayError && (
                        <p className="mt-2 text-sm text-red-600">
                            {displayError}
                        </p>
                    )}

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                            disabled={isLoading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangeInfoPopup;