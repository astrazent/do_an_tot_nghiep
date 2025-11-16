import React, { useState, useEffect } from 'react'
import { useCheckPasswordAndUpdate } from '~/hooks/user/useUser'
import { useAlert } from '~/contexts/AlertContext'

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
    const { showAlert } = useAlert()

    const {
        mutateAsync: updateUser,
        isLoading,
        error: mutationError,
    } = useCheckPasswordAndUpdate()

    const [displayError, setDisplayError] = useState(null)

    useEffect(() => {
        if (isOpen) {
            setDisplayError(null)
        }
    }, [isOpen])

    useEffect(() => {
        if (mutationError) {
            const errorMessage =
                mutationError.response?.data?.message ||
                'Đã có lỗi xảy ra. Vui lòng thử lại.'
            setDisplayError(errorMessage)
        }
    }, [mutationError])

    if (!isOpen) return null

    const getTitleAndLabel = () => {
        switch (popupType) {
            case 'username':
                return {
                    title: 'Thay đổi Tên đăng nhập',
                    label: 'Tên đăng nhập mới',
                }
            case 'email':
                return { title: 'Thay đổi Email', label: 'Email mới' }
            case 'password':
                return { title: 'Thay đổi Mật khẩu', label: 'Mật khẩu mới' }
            default:
                return { title: '', label: '' }
        }
    }

    const { title, label } = getTitleAndLabel()

    const handleSubmit = async () => {
        setDisplayError(null)

        if (popupType === 'password') {
            if (!newPassword) {
                setDisplayError('Mật khẩu mới không được để trống.')
                return
            }
            if (newPassword !== confirmNewPassword) {
                setDisplayError('Mật khẩu mới không khớp.')
                return
            }
        }

        try {
            const dataToUpdate = {
                userId,
                old_password: currentPassword,
                provider: 'local',
            }

            if (popupType === 'password') {
                dataToUpdate.password = newPassword
            } else {
                dataToUpdate[popupType] = newValue
            }

            await updateUser(dataToUpdate)

            showAlert('Cập nhật thông tin thành công!', 'success')

            if (refetchUser) {
                refetchUser()
            }
            onClose()
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                'Cập nhật thất bại. Vui lòng thử lại.'
            showAlert(errorMessage, 'error')

            console.error('Update failed:', err)
        }
    }

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
            )
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
        )
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {title}
                </h2>
                <form
                    onSubmit={e => {
                        e.preventDefault()
                        handleSubmit()
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
    )
}

export default ChangeInfoPopup
