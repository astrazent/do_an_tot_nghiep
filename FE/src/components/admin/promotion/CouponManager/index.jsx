import React, { useState, useRef, useEffect } from 'react'
import {
    FaEdit,
    FaTrashAlt,
    FaPause,
    FaChartBar,
    FaEllipsisV,
    FaPlus,
} from 'react-icons/fa'

const initialCoupons = [
    {
        code: 'MTAY10',
        programName: 'Giảm 10% Miền Tây',
        type: 'Giảm giá sản phẩm',
        applyTo: 'Theo danh mục',
        value: '10%',
        startDate: '01/10/2025',
        endDate: '31/12/2025',
        status: 'Còn hạn',
        usage: '25 / 100',
    },
    {
        code: 'SHIPFREE25',
        programName: 'Miễn phí vận chuyển',
        type: 'Giảm phí ship',
        applyTo: 'Tất cả sản phẩm',
        value: '20,000đ',
        startDate: '15/09/2025',
        endDate: '15/10/2025',
        status: 'Hết hạn',
        usage: '150 / 150',
    },
    {
        code: 'TETVUIVE',
        programName: 'Voucher Tết 2026',
        type: 'Giảm giá sản phẩm',
        applyTo: 'Theo sản phẩm',
        value: '50,000đ',
        startDate: '20/01/2026',
        endDate: '10/02/2026',
        status: 'Còn hạn',
        usage: '0 / 500',
    },
    {
        code: 'HEVUI',
        programName: 'Khuyến mãi hè',
        type: 'Giảm giá sản phẩm',
        applyTo: 'Theo danh mục',
        value: '15%',
        startDate: '01/06/2025',
        endDate: '31/08/2025',
        status: 'Hết hạn',
        usage: '200 / 200',
    },
]

const StatusPill = ({ status }) => {
    const baseClasses =
        'px-2.5 py-1 text-xs font-semibold rounded-full inline-block'
    let specificClasses = ''

    switch (status) {
        case 'Còn hạn':
            specificClasses = 'bg-green-100 text-green-800'
            break
        case 'Hết hạn':
            specificClasses = 'bg-gray-200 text-gray-800'
            break
        default:
            specificClasses = 'bg-yellow-100 text-yellow-800'
    }

    return <span className={`${baseClasses} ${specificClasses}`}>{status}</span>
}

const ActionDropdown = ({ onEdit, onDelete, onPause, onStats }) => {
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
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
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
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault()
                                onPause()
                                setIsOpen(false)
                            }}
                            className="text-gray-700 group flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                            role="menuitem"
                        >
                            <FaPause className="mr-3 text-gray-400 group-hover:text-gray-600" />
                            Tạm dừng
                        </a>
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault()
                                onStats()
                                setIsOpen(false)
                            }}
                            className="text-gray-700 group flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                            role="menuitem"
                        >
                            <FaChartBar className="mr-3 text-gray-400 group-hover:text-gray-600" />
                            Xem thống kê
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

const AddCouponModal = ({ onClose, onAddCoupon }) => {
    const [formData, setFormData] = useState({
        code: '',
        programName: '',
        type: 'Giảm giá sản phẩm',
        applyTo: 'Tất cả sản phẩm',
        value: '',
        startDate: '',
        endDate: '',
        totalUsage: 100, // Thêm trường số lượng tối đa
    })

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = e => {
        e.preventDefault()
        const newCoupon = {
            ...formData,
            status: 'Còn hạn',
            usage: `0 / ${formData.totalUsage}`,
        }
        onAddCoupon(newCoupon)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6">Thêm Coupon Mới</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Tên chương trình
                            </label>
                            <input
                                type="text"
                                name="programName"
                                value={formData.programName}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Mã Code
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Loại
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option>Giảm giá sản phẩm</option>
                                <option>Giảm phí ship</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Áp dụng cho
                            </label>
                            <select
                                name="applyTo"
                                value={formData.applyTo}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option>Tất cả sản phẩm</option>
                                <option>Theo danh mục</option>
                                <option>Theo sản phẩm</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Giá trị (ví dụ: 15% hoặc 20,000đ)
                            </label>
                            <input
                                type="text"
                                name="value"
                                value={formData.value}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Tổng lượt sử dụng
                            </label>
                            <input
                                type="number"
                                name="totalUsage"
                                value={formData.totalUsage}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Ngày bắt đầu
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Ngày kết thúc
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
                    </div>

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
                            Thêm Coupon
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const CouponManager = () => {
    const [coupons, setCoupons] = useState(initialCoupons)

    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleEdit = () => alert('Chỉnh sửa coupon!')
    const handleDelete = () => alert('Xóa coupon!')
    const handlePause = () => alert('Tạm dừng coupon!')
    const handleStats = () => alert('Xem thống kê!')

    const handleAddCoupon = newCouponData => {
        const formattedCoupon = {
            ...newCouponData,
            startDate: newCouponData.startDate.split('-').reverse().join('/'),
            endDate: newCouponData.endDate.split('-').reverse().join('/'),
        }
        setCoupons(prevCoupons => [formattedCoupon, ...prevCoupons])
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {isModalOpen && (
                <AddCouponModal
                    onClose={() => setIsModalOpen(false)}
                    onAddCoupon={handleAddCoupon}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Quản lý Coupon
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
                        placeholder="Tìm kiếm coupon..."
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Tất cả trạng thái</option>
                        <option>Còn hạn</option>
                        <option>Hết hạn</option>
                    </select>
                    <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Tất cả loại</option>
                        <option>Giảm giá sản phẩm</option>
                        <option>Giảm phí ship</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mã code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên chương trình
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Loại
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Áp dụng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giá trị
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày hiệu lực
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sử dụng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {coupons.map((coupon, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {coupon.code}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {coupon.programName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {coupon.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {coupon.applyTo}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {coupon.value}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {coupon.startDate} - {coupon.endDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusPill status={coupon.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {coupon.usage}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <ActionDropdown
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onPause={handlePause}
                                        onStats={handleStats}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-700">
                    Hiển thị 1 đến {coupons.length} của {coupons.length} kết quả
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

export default CouponManager
