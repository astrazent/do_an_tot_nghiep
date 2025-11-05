import React from 'react';

const ChangeInfoPopup = ({
    isOpen,
    onClose,
    popupType, // 'username', 'email', or 'password'
    currentPassword,
    setCurrentPassword,
    newValue,
    setNewValue,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    onSubmit,
}) => {
    if (!isOpen) return null;

    const getTitleAndLabel = () => {
        switch (popupType) {
            case 'username':
                return { title: 'Thay đổi Tên đăng nhập', label: 'Tên đăng nhập mới' };
            case 'email':
                return { title: 'Thay đổi Email', label: 'Email mới' };
            case 'password':
                return { title: 'Thay đổi Mật khẩu', label: 'Mật khẩu mới' };
            default:
                return { title: '', label: '' };
        }
    };

    const { title, label } = getTitleAndLabel();

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
                            onChange={e => setNewPassword(e.target.value)}
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
                            onChange={e =>
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
                    onChange={e => setNewValue(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    required
                />
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {title}
                </h2>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        onSubmit();
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
                                onChange={e =>
                                    setCurrentPassword(e.target.value)
                                }
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                required
                            />
                        </div>

                        {renderNewValueInput()}
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangeInfoPopup;