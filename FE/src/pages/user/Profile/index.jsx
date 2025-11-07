import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux' // Giả sử bạn dùng react-redux
import provincesData from '~/assets/data/provinces.json'
import { useCurrentUser } from '~/hooks/user/useUser'
import ChangeInfoPopup from '../ChangeInfoPopup'

const Profile = () => {
    const { user } = useCurrentUser() // Lấy dữ liệu người dùng từ hook
    console.log('user: ', user)
    const [profile, setProfile] = useState({
        username: '',
        name: '', // Sẽ được map từ fullName
        email: '',
        phone: '',
        gender: '',
        day: '',
        month: '',
        year: '',
        address: '',
        province: '', // Sẽ lưu ID
        district: '', // Sẽ lưu ID
        ward: '', // Sẽ lưu ID
    })

<<<<<<< HEAD
    const [avatarPreview, setAvatarPreview] = useState(
        'https://i.pravatar.cc/150?u=a042581f4e29026704d'
    )

    const [provinces, setProvinces] = useState([])
=======
    const [avatarPreview, setAvatarPreview] = useState('')
    const [allProvinces] = useState(provincesData)
>>>>>>> 4546453962015922ccfa4ccb13de87fd625e2fc1
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])

    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [popupType, setPopupType] = useState('') // 'username', 'email', hoặc 'password'
    const [currentPassword, setCurrentPassword] = useState('')
    const [newValue, setNewValue] = useState('') // Dùng cho username và email mới
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')

    // Effect để điền dữ liệu người dùng vào form khi component được tạo
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

            // ✅ Cập nhật ánh xạ đúng tên key snake_case
            setProfile({
                username: user.username ?? '',
                name: user.full_name ?? '', // Sửa fullName → full_name
                email: user.email ?? '',
                phone: user.phone ?? '',
                gender: user.gender ?? '',
                address: user.address ?? '',
                province: provinceId,
                district: districtId,
                ward: wardId,
                day: '',
                month: '',
                year: '',
            })

            if (user.avatar_url) {
                setAvatarPreview(user.avatar_url)
            }
        }
    }, [user, allProvinces])

    // Effect này không còn cần thiết vì đã gộp logic vào useEffect ở trên để xử lý lần đầu
    // Tuy nhiên, chúng ta cần một phiên bản khác để xử lý khi người dùng TỰ THAY ĐỔI lựa chọn
    useEffect(() => {
        if (profile.province) {
            const selectedProvince = allProvinces.find(
                p => p.Id === profile.province
            )
            setDistricts(selectedProvince?.Districts || [])
        } else {
            setDistricts([])
        }
        // KHÔNG reset district và ward ở đây, vì sẽ làm mất dữ liệu khi load lần đầu
    }, [profile.province])

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

        // Khi người dùng *chủ động* thay đổi tỉnh, reset huyện và xã
        if (name === 'province') {
            newProfile.district = ''
            newProfile.ward = ''
            setWards([]) // Reset danh sách xã
        }

        // Khi người dùng *chủ động* thay đổi huyện, reset xã
        if (name === 'district') {
            newProfile.ward = ''
        }

        setProfile(newProfile)
    }

    const handleImageChange = e => {
        if (e.target.files && e.target.files[0]) {
            setAvatarPreview(URL.createObjectURL(e.target.files[0]))
        }
    }
    const openPopup = type => {
        setPopupType(type)
        setIsPopupOpen(true)
        // Reset các trường input trong popup
        setCurrentPassword('')
        setNewValue('')
        setNewPassword('')
        setConfirmNewPassword('')
    }

    const closePopup = () => {
        setIsPopupOpen(false)
    }
    const handleSaveChanges = () => {
        // --- GIẢ LẬP VIỆC GỌI API ĐỂ XÁC THỰC MẬT KHẨU ---
        // Trong thực tế, bạn sẽ gửi `currentPassword` lên server để kiểm tra
        if (currentPassword !== 'password123') {
            // Giả sử mật khẩu đúng là 'password123'
            alert('Mật khẩu hiện tại không chính xác!')
            return
        }

        // Xử lý logic thay đổi dựa trên loại popup
        switch (popupType) {
            case 'username':
                setProfile({ ...profile, username: newValue })
                alert('Tên đăng nhập đã được thay đổi!')
                break
            case 'email':
                setProfile({ ...profile, email: newValue })
                alert('Email đã được thay đổi!')
                break
            case 'password':
                if (newPassword !== confirmNewPassword) {
                    alert('Mật khẩu mới và xác nhận mật khẩu không khớp!')
                    return
                }
                if (newPassword.length < 6) {
                    alert('Mật khẩu mới phải có ít nhất 6 ký tự.')
                    return
                }
                // Logic gọi API đổi mật khẩu ở đây
                alert('Mật khẩu đã được thay đổi thành công!')
                break
            default:
                break
        }

        closePopup() // Đóng popup sau khi hoàn tất
    }
    const handleSubmit = e => {
        e.preventDefault()
        console.log('Dữ liệu được cập nhật:', profile)
        alert('Thông tin đã được lưu!')
    }
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
                    <div className="md:col-span-2 space-y-6">
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
                                className="px-4 py-1 border border-l-0 ml-5 border-green-600 bg-green-600 text-white font-semibold rounded-r-md hover:bg-green-700 transition"
                            >
                                Thay Đổi
                            </button>
                        </div>

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
                                <button
                                    type="button"
                                    onClick={() => openPopup('email')}
                                    className="px-4 py-1 border border-l-0 ml-5 border-green-600 bg-green-600 text-white font-semibold rounded-r-md hover:bg-green-700 transition"
                                >
                                    Thay Đổi
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Mật khẩu
                            </label>
                            <div className="mt-1">
                                <button
                                    type="button"
                                    onClick={() => openPopup('password')}
                                    className="mt-1 px-4 py-2 text-green-600 hover:text-green-800 font-semibold bg-transparent hover:bg-green-50 rounded-md border border-transparent hover:border-green-200 transition-all duration-200"
                                >
                                    Đổi Mật khẩu
                                </button>
                            </div>
                        </div>

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
                                        value={profile.province} // <-- value là ID
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
                                        value={profile.district} // <-- value là ID
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
                                        value={profile.ward} // <-- value là ID
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

                        {/* ... Các phần còn lại của form ... */}
                    </div>

                    <div className="flex flex-col items-center justify-start pt-6">
                        <div
                            className="w-32 h-32 rounded-full bg-cover bg-center mb-4 shadow-md"
                            style={{ backgroundImage: `url(${avatarPreview})` }}
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

                    <div className="md:col-span-3 text-right pt-6 border-t border-gray-200">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300"
                        >
                            Lưu Thay Đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Profile
