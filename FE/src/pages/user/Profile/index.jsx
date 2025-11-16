import React, { useState, useEffect } from 'react'
import provincesData from '~/assets/data/provinces.json'
import { useCurrentUser } from '~/hooks/user/useUser'
import ChangeInfoPopup from '../ChangeInfoPopup'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { useUpdateUserById } from '~/hooks/user/useUser'
import { useAlert } from '~/contexts/AlertContext'
const Profile = () => {
    const { user, refetchUser } = useCurrentUser()
    const [profile, setProfile] = useState({
        username: '',
        name: '',
        email: '',
        phone: '',
        gender: '',
        address: '',
        province: '',
        district: '',
        ward: '',
    })
    const { showAlert } = useAlert()
    const [avatarPreview, setAvatarPreview] = useState('')
    const [avatarFile, setAvatarFile] = useState(null)
    const [allProvinces] = useState(provincesData)
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])

    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [popupType, setPopupType] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newValue, setNewValue] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')

    const { mutate: updateUser, isLoading: isUpdating } = useUpdateUserById({
        onSuccess: () => {
            showAlert('Cập nhật thông tin thành công!', { type: 'success' })
            refetchUser()
        },
        onError: error => {
            console.log(error)

            const errorMessage =
                error?.response?.data?.message ||
                'Đã có lỗi xảy ra khi cập nhật.'
            showAlert(errorMessage, { type: 'error' })
        },
    })

    useEffect(() => {
        if (user && user.username) {
            const selectedProvince = allProvinces.find(
                p => p.Name === user.city
            )
            const provinceId = selectedProvince ? selectedProvince.Id : ''

            let districtsOfSelectedProvince = []
            if (selectedProvince) {
                districtsOfSelectedProvince = selectedProvince.Districts
                setDistricts(districtsOfSelectedProvince)
            }

            const selectedDistrict = districtsOfSelectedProvince.find(
                d => d.Name === user.district
            )
            const districtId = selectedDistrict ? selectedDistrict.Id : ''

            let wardsOfSelectedDistrict = []
            if (selectedDistrict) {
                wardsOfSelectedDistrict = selectedDistrict.Wards
                setWards(wardsOfSelectedDistrict)
            }

            const selectedWard = wardsOfSelectedDistrict.find(
                w => w.Name === user.ward
            )
            const wardId = selectedWard ? selectedWard.Id : ''

            setProfile({
                username: user.username ?? '',
                name: user.full_name ?? '',
                email: user.email ?? '',
                phone: user.phone ?? '',
                gender: user.gender ?? '',
                address: user.address ?? '',
                province: provinceId,
                district: districtId,
                ward: wardId,
            })

            if (user.avatar_url) {
                setAvatarPreview(user.avatar_url)
            }
        }
    }, [user, allProvinces])

    useEffect(() => {
        if (profile.province) {
            const selectedProvince = allProvinces.find(
                p => p.Id === profile.province
            )
            setDistricts(selectedProvince?.Districts || [])
        } else {
            setDistricts([])
        }
    }, [profile.province, allProvinces])

    useEffect(() => {
        if (profile.district) {
            const selectedDistrict = districts.find(
                d => d.Id === profile.district
            )
            setWards(selectedDistrict?.Wards || [])
        } else {
            setWards([])
        }
    }, [profile.district, districts])

    const handleInputChange = e => {
        const { name, value } = e.target
        const newProfile = { ...profile, [name]: value }

        if (name === 'province') {
            newProfile.district = ''
            newProfile.ward = ''
            setWards([])
        }

        if (name === 'district') {
            newProfile.ward = ''
        }

        setProfile(newProfile)
    }

    const handleImageChange = e => {
        const file = e.target.files[0]
        if (file) {
            setAvatarPreview(URL.createObjectURL(file))
            setAvatarFile(file)
        }
    }

    const openPopup = type => {
        setPopupType(type)
        setIsPopupOpen(true)
        setCurrentPassword('')
        setNewValue('')
        setNewPassword('')
        setConfirmNewPassword('')
    }

    const closePopup = () => setIsPopupOpen(false)

    const handleSaveChanges = () => {
        if (currentPassword !== 'password123') {
            showAlert('Mật khẩu hiện tại không chính xác!', { type: 'error' })
            return
        }
        switch (popupType) {
            case 'username':
                setProfile({ ...profile, username: newValue })
                showAlert('Tên đăng nhập đã được thay đổi!', {
                    type: 'success',
                })
                break
            case 'email':
                setProfile({ ...profile, email: newValue })
                showAlert('Email đã được thay đổi!', { type: 'success' })
                break
            case 'password':
                if (newPassword !== confirmNewPassword) {
                    showAlert('Mật khẩu mới và xác nhận mật khẩu không khớp!', {
                        type: 'error',
                    })
                    return
                }
                if (newPassword.length < 6) {
                    showAlert('Mật khẩu mới phải có ít nhất 6 ký tự.', {
                        type: 'error',
                    })
                    return
                }
                showAlert('Mật khẩu đã được thay đổi thành công!', {
                    type: 'success',
                })
                break
            default:
                break
        }
        closePopup()
    }

    const handleSubmit = e => {
        e.preventDefault()
        if (!user?.user_id) {
            showAlert('Không tìm thấy ID người dùng để cập nhật.', {
                type: 'error',
            })
            return
        }

        const selectedProvince = allProvinces.find(
            p => p.Id === profile.province
        )
        const selectedDistrict = districts.find(d => d.Id === profile.district)
        const selectedWard = wards.find(w => w.Id === profile.ward)

        const dataToUpdate = {
            full_name: profile.name,
            phone: profile.phone,
            gender: profile.gender,
            address: profile.address,
            city: selectedProvince?.Name || '',
            district: selectedDistrict?.Name || '',
            ward: selectedWard?.Name || '',
            provider: 'local',
        }

        const formData = new FormData()
        Object.keys(dataToUpdate).forEach(key => {
            formData.append(key, dataToUpdate[key])
        })

        if (avatarFile) {
            formData.append('avatar', avatarFile)
        }

        updateUser({ userId: user.user_id, data: formData })
    }
    console.log(user)
    return (
        <div className="min-h-screen flex items-center justify-center">
            <ChangeInfoPopup
                isOpen={isPopupOpen}
                onClose={closePopup}
                popupType={popupType}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newValue={newValue}
                setNewValue={setNewValue}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmNewPassword={confirmNewPassword}
                setConfirmNewPassword={setConfirmNewPassword}
                onSubmit={handleSaveChanges}
                userId={user.user_id}
                refetchUser={refetchUser}
            />
            <div className="bg-white w-full max-w-4xl rounded-lg p-8">
                <div className="pb-6 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Hồ Sơ Của Tôi
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Quản lý thông tin hồ sơ để bảo mật tài khoản
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-10"
                >
                    {}
                    <div className="md:col-span-2 space-y-6">
                        {}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Tên đăng nhập
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={profile.username}
                                readOnly
                                className="flex-grow max-w-md px-4 py-2 bg-gray-100 border border-gray-300 rounded-l-md text-gray-500 cursor-not-allowed focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => openPopup('username')}
                                className="px-4 py-1 border border-l-0 ml-5 border-gray-400 bg-gray-200 text-gray-700 font-semibold rounded-r-md hover:bg-gray-300 transition"
                            >
                                Thay Đổi
                            </button>
                        </div>
                        {}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Tên
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={profile.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:ring-black focus:border-black"
                            />
                        </div>
                        {}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>

                            <div className="mt-1 flex items-center">
                                <input
                                    type="email"
                                    id="email"
                                    value={profile.email}
                                    readOnly
                                    className="flex-grow max-w-md px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed focus:outline-none"
                                />
                                {user?.provider === 'local' && (
                                    <button
                                        type="button"
                                        onClick={() => openPopup('email')}
                                        className="px-4 py-1 border border-l-0 ml-5 border-gray-400 bg-gray-200 text-gray-700 font-semibold rounded-r-md hover:bg-gray-300 transition"
                                    >
                                        Thay Đổi
                                    </button>
                                )}
                            </div>

                            {user?.email_verified ? (
                                <div className="mt-1 ml-3 flex items-center text-green-600 text-xs font-medium">
                                    <FaCheckCircle className="mr-1 text-green-500 text-sm" />
                                    <span>Email đã được xác thực</span>
                                </div>
                            ) : (
                                <div
                                    onClick={() =>
                                        alert('Gửi email xác thực...')
                                    }
                                    className="mt-1 ml-3 flex items-center text-red-500 text-xs font-medium cursor-pointer hover:text-red-600 transition"
                                >
                                    <FaExclamationCircle className="mr-1 text-red-500 text-sm" />
                                    <span>Email chưa được xác thực</span>
                                </div>
                            )}
                        </div>
                        {}
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Số điện thoại
                            </label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={profile.phone || ''}
                                onChange={handleInputChange}
                                placeholder="Nhập số điện thoại"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                            />
                        </div>
                        {}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Giới tính
                            </label>
                            <div className="mt-2 flex items-center space-x-6">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={profile.gender === 'male'}
                                        onChange={handleInputChange}
                                        className="text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-gray-700 text-sm">
                                        Nam
                                    </span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={profile.gender === 'female'}
                                        onChange={handleInputChange}
                                        className="text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-gray-700 text-sm">
                                        Nữ
                                    </span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="other"
                                        checked={profile.gender === 'other'}
                                        onChange={handleInputChange}
                                        className="text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-gray-700 text-sm">
                                        Khác
                                    </span>
                                </label>
                            </div>
                        </div>
                        {}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Địa chỉ
                            </label>
                            <div className="mb-8">
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={profile.address}
                                    onChange={handleInputChange}
                                    placeholder="Số nhà, tên đường..."
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label
                                        htmlFor="province"
                                        className="block text-xs font-medium text-gray-700 mb-1"
                                    >
                                        Tỉnh/Thành phố
                                    </label>
                                    <select
                                        id="province"
                                        name="province"
                                        value={profile.province}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-sm"
                                    >
                                        <option value="">
                                            Chọn tỉnh/thành
                                        </option>
                                        {allProvinces.map(province => (
                                            <option
                                                key={province.Id}
                                                value={province.Id}
                                            >
                                                {province.Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label
                                        htmlFor="district"
                                        className="block text-xs font-medium text-gray-700 mb-1"
                                    >
                                        Quận/Huyện
                                    </label>
                                    <select
                                        id="district"
                                        name="district"
                                        value={profile.district}
                                        onChange={handleInputChange}
                                        disabled={!profile.province}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                                    >
                                        <option value="">
                                            Chọn quận/huyện
                                        </option>
                                        {districts.map(district => (
                                            <option
                                                key={district.Id}
                                                value={district.Id}
                                            >
                                                {district.Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label
                                        htmlFor="ward"
                                        className="block text-xs font-medium text-gray-700 mb-1"
                                    >
                                        Phường/Xã
                                    </label>
                                    <select
                                        id="ward"
                                        name="ward"
                                        value={profile.ward}
                                        onChange={handleInputChange}
                                        disabled={!profile.district}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                                    >
                                        <option value="">Chọn phường/xã</option>
                                        {wards.map(ward => (
                                            <option
                                                key={ward.Id}
                                                value={ward.Id}
                                            >
                                                {ward.Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="flex flex-col items-center justify-start pt-6">
                        <div
                            className="w-32 h-32 rounded-full bg-cover bg-center mb-4 shadow-md"
                            style={{
                                backgroundImage: `url(${avatarPreview})`,
                            }}
                        ></div>
                        <label
                            htmlFor="avatar-upload"
                            className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-md transition duration-300"
                        >
                            Chọn Ảnh
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            className="hidden"
                            accept=".png, .jpg, .jpeg"
                            onChange={handleImageChange}
                        />
                        <p className="mt-3 text-xs text-gray-500 text-center">
                            Dung lượng file tối đa 1 MB
                            <br />
                            Định dạng: .JPEG, .PNG
                        </p>
                    </div>

                    {}
                    <div className="md:col-span-3 flex justify-end items-center gap-4 pt-6 border-t border-gray-200">
                        {user?.provider === 'local' && (
                            <button
                                type="button"
                                onClick={() => openPopup('password')}
                                className="px-4 py-3 text-green-600 hover:text-green-700 font-semibold bg-transparent hover:bg-green-50 rounded-lg border border-green-600 transition-all duration-200"
                            >
                                Đổi Mật khẩu
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Profile
