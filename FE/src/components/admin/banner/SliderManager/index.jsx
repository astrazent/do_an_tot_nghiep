import React, { useState, useRef, useEffect } from 'react'
import { FaEdit, FaTrashAlt, FaPlus, FaEllipsisV } from 'react-icons/fa'

const initialSliders = [
    {
        id: 1,
        image: 'https://via.placeholder.com/150x80.png?text=Summer+Sale',
        name: 'Mùa hè rực rỡ',
        description: 'Giảm giá 50% tất cả sản phẩm hè',
        link: '/khuyen-mai-he',
        order: 1,
        status: 'Hiển thị',
        startDate: '01/06/2025',
        endDate: '30/06/2025',
    },
    {
        id: 2,
        image: 'https://via.placeholder.com/150x80.png?text=Back+To+School',
        name: 'Tựu trường sale to',
        description: 'Ưu đãi cho học sinh, sinh viên',
        link: '/tuu-truong',
        order: 2,
        status: 'Hiển thị',
        startDate: '01/08/2025',
        endDate: '31/08/2025',
    },
    {
        id: 3,
        image: 'https://via.placeholder.com/150x80.png?text=Black+Friday',
        name: 'Black Friday siêu sale',
        description: 'Giảm giá sâu nhất năm',
        link: '/black-friday',
        order: 3,
        status: 'Ẩn',
        startDate: '28/11/2025',
        endDate: '30/11/2025',
    },
]

const StatusDisplay = ({ status }) => {
    const isVisible = status === 'Hiển thị'
    const text = isVisible ? 'Hiển thị' : 'Ẩn'
    const icon = isVisible ? '✅' : '❌'
    const colorClass = isVisible ? 'text-green-700' : 'text-red-700'

    return (
        <span
            className={`text-sm font-medium ${colorClass}`}
        >{`${icon} ${text}`}</span>
    )
}

const ActionDropdown = ({ onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = event => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <FaEllipsisV className="h-4 w-4" />
                </button>
            </div>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                    >
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault()
                                onEdit()
                                setIsOpen(false)
                            }}
                            className="text-gray-700 group flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                            role="menuitem"
                        >
                            <FaEdit className="mr-3 text-gray-400 group-hover:text-gray-600" />
                            Chỉnh sửa
                        </a>
                        <div className="border-t border-gray-100"></div>
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault()
                                onDelete()
                                setIsOpen(false)
                            }}
                            className="text-red-600 group flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                            role="menuitem"
                        >
                            <FaTrashAlt className="mr-3 text-red-400 group-hover:text-red-600" />
                            Xóa
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}

const AddSliderModal = ({ onClose, onAddSlider }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        link: '',
        order: '',
        image: '', // URL ảnh
        status: 'Hiển thị',
        startDate: '',
        endDate: '',
    })

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = e => {
        e.preventDefault()
        const newSlider = {
            id: Date.now(), // Tạo id duy nhất
            ...formData,
            // Chuyển đổi định dạng ngày tháng trước khi thêm
            startDate: formData.startDate.split('-').reverse().join('/'),
            endDate: formData.endDate.split('-').reverse().join('/'),
        }
        onAddSlider(newSlider)
        onClose() // Đóng modal sau khi thêm
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-6">Thêm Slider Mới</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tên slider */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Tên slider
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        {/* Thứ tự */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Thứ tự
                            </label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                    </div>
                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mô tả
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Liên kết */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Liên kết
                            </label>
                            <input
                                type="text"
                                name="link"
                                value={formData.link}
                                placeholder="/san-pham/ten-san-pham"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        {/* URL Ảnh */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                URL Ảnh
                            </label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/image.png"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        {/* Ngày bắt đầu */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Ngày bắt đầu hiển thị
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        {/* Ngày kết thúc */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Ngày kết thúc hiển thị
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        {/* Trạng thái */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Trạng thái
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option>Hiển thị</option>
                                <option>Ẩn</option>
                            </select>
                        </div>
                    </div>

                    {/* Nút bấm */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Thêm Slider
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const SliderManager = () => {
    const [sliders, setSliders] = useState(initialSliders)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Hàm xử lý logic
    const handleEdit = sliderId => alert(`Chỉnh sửa slider có ID: ${sliderId}`)
    const handleDelete = sliderId => {
        if (window.confirm('Bạn có chắc chắn muốn xóa slider này?')) {
            setSliders(sliders.filter(slider => slider.id !== sliderId))
            alert(`Đã xóa slider có ID: ${sliderId}`)
        }
    }

    const handleAddSlider = newSliderData => {
        setSliders(prevSliders => [newSliderData, ...prevSliders])
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {isModalOpen && (
                <AddSliderModal
                    onClose={() => setIsModalOpen(false)}
                    onAddSlider={handleAddSlider}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Quản lý Slider
                </h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <FaPlus className="mr-2" />
                        Thêm mới
                    </button>
                    <input
                        type="text"
                        placeholder="Tìm kiếm slider..."
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Tất cả trạng thái</option>
                        <option>Hiển thị</option>
                        <option>Ẩn</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ảnh
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên slider
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mô tả
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Liên kết
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thứ tự
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày hiển thị
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sliders.map(slider => (
                            <tr key={slider.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img
                                        src={slider.image}
                                        alt={slider.name}
                                        className="w-24 h-14 object-cover rounded-md"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {slider.name}
                                </td>
                                <td className="px-6 py-4 max-w-xs text-sm text-gray-700 truncate">
                                    {slider.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                                    <a
                                        href={slider.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {slider.link}
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {slider.order}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusDisplay status={slider.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {slider.startDate} - {slider.endDate}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <ActionDropdown
                                        onEdit={() => handleEdit(slider.id)}
                                        onDelete={() => handleDelete(slider.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-700">
                    Hiển thị 1 đến {sliders.length} của {sliders.length} kết quả
                </p>
                <div className="flex items-center">
                    <button
                        className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                        disabled
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1 bg-blue-500 text-white rounded-lg mx-2">
                        1
                    </span>
                    <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SliderManager
