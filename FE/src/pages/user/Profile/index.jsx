import React, { useState, useEffect } from 'react'
const Profile = () => {
    const [profile, setProfile] = useState({
        username: 'mickey',
        name: 'Nguyên',
        email: 'no**********@gmail.com',
        gender: '',
        day: '',
        month: '',
        year: '',
        address: '',
        province: '',
        district: '',
        ward: '',
    })

    const [avatarPreview, setAvatarPreview] = useState(
        'https:
    )

    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch(
                    'https://provinces.open-api.vn/api/'
                )
                const data = await response.json()
                setProvinces(data)
            } catch (error) {
                console.error('Lỗi khi fetch tỉnh/thành phố:', error)
            }
        }
        fetchProvinces()
    }, [])

    useEffect(() => {
        if (profile.province) {
            const fetchDistricts = async () => {
                try {
                    const response = await fetch(
                        `https://provinces.open-api.vn/api/p/${profile.province}?depth=2`
                    )
                    const data = await response.json()
                    setDistricts(data.districts || [])
                    setWards([])
                    setProfile(prev => ({ ...prev, district: '', ward: '' }))
                } catch (error) {
                    console.error('Lỗi khi fetch quận/huyện:', error)
                }
            }
            fetchDistricts()
        }
    }, [profile.province])

    useEffect(() => {
        if (profile.district) {
            const fetchWards = async () => {
                try {
                    const response = await fetch(
                        `https://provinces.open-api.vn/api/d/${profile.district}?depth=2`
                    )
                    const data = await response.json()
                    setWards(data.wards || [])
                    setProfile(prev => ({ ...prev, ward: '' }))
                } catch (error) {
                    console.error('Lỗi khi fetch phường/xã:', error)
                }
            }
            fetchWards()
        }
    }, [profile.district])

    const handleInputChange = e => {
        const { name, value } = e.target
        setProfile(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = e => {
        if (e.target.files && e.target.files[0]) {
            setAvatarPreview(URL.createObjectURL(e.target.files[0]))
        }
    }

    const handleSubmit = e => {
        e.preventDefault()
        alert('Thông tin đã được lưu!')
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
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
                                className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed text-gray-500 focus:outline-none"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Tên đăng nhập chỉ có thể thay đổi một lần.
                            </p>
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
                                    className="px-4 py-1 border border-l-0 ml-5 border-green-600 bg-green-600 text-white font-semibold rounded-r-md hover:bg-green-700 transition"
                                >
                                    Thay Đổi
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Số điện thoại
                            </label>
                            <button
                                type="button"
                                className="mt-1 px-4 py-2 text-green-600 hover:text-green-800 font-semibold bg-transparent hover:bg-green-50 rounded-md border border-transparent hover:border-green-200 transition-all duration-200"
                            >
                                Thêm số điện thoại
                            </button>
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
                                        value={profile.province}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black text-sm"
                                    >
                                        <option value="">
                                            Chọn tỉnh/thành
                                        </option>
                                        {provinces.map(province => (
                                            <option
                                                key={province.code}
                                                value={province.code}
                                            >
                                                {province.name}
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
                                                key={district.code}
                                                value={district.code}
                                            >
                                                {district.name}
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
                                                key={ward.code}
                                                value={ward.code}
                                            >
                                                {ward.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Giới tính
                            </label>
                            <div className="mt-2 flex items-center space-x-6">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-green-600 border-gray-300 focus:ring-black"
                                    />
                                    <span className="ml-2 text-gray-700">
                                        Nam
                                    </span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-green-600 border-gray-300 focus:ring-black"
                                    />
                                    <span className="ml-2 text-gray-700">
                                        Nữ
                                    </span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="other"
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-green-600 border-gray-300 focus:ring-black"
                                    />
                                    <span className="ml-2 text-gray-700">
                                        Khác
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Ngày sinh
                            </label>
                            <div className="mt-1 grid grid-cols-3 gap-3">
                                <select
                                    name="day"
                                    value={profile.day}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm  focus:ring-black focus:border-black"
                                >
                                    <option value="">Ngày</option>
                                    {Array.from(
                                        { length: 31 },
                                        (_, i) => i + 1
                                    ).map(day => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name="month"
                                    value={profile.month}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm  focus:ring-black focus:border-black"
                                >
                                    <option value="">Tháng</option>
                                    {Array.from(
                                        { length: 12 },
                                        (_, i) => i + 1
                                    ).map(month => (
                                        <option key={month} value={month}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name="year"
                                    value={profile.year}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm  focus:ring-black focus:border-black"
                                >
                                    <option value="">Năm</option>
                                    {Array.from(
                                        { length: 100 },
                                        (_, i) => new Date().getFullYear() - i
                                    ).map(year => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
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
