import React, { useState, useEffect, useRef } from 'react'
import { FiPlus, FiX, FiPackage, FiChevronDown } from 'react-icons/fi'
import {
    createProduct,
    getListCategory,
} from '~/services/admin/productAdminService'

const CreateProductModal = ({ isOpen, onClose, onCreateSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        origin_price: 0,
        price: 0,
        stock_qty: 0,
        low_stock_threshold: 10,
        status: 1,
        category_id: '',
    })

    const [images, setImages] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])
    const [categories, setCategories] = useState([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const fileInputRef = useRef(null)
    const dropdownRef = useRef(null)

    // Reset form + load danh mục khi mở modal
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                slug: '',
                description: '',
                origin_price: 0,
                price: 0,
                stock_qty: 0,
                low_stock_threshold: 10,
                status: 1,
                category_id: '',
            })
            setImages([])
            setImagePreviews(prev => {
                prev.forEach(url => URL.revokeObjectURL(url))
                return []
            })
            setError(null)

            const fetchCategories = async () => {
                try {
                    setIsLoadingCategories(true)
                    const res = await getListCategory()
                    console.log('Danh mục từ API:', res)

                    const list = Array.isArray(res) ? res : (res?.data || [])
                    setCategories(list)

                    if (list.length > 0) {
                        setFormData(prev => ({ ...prev, category_id: list[0].id }))
                    }
                } catch (err) {
                    console.error('Lỗi lấy danh mục:', err)
                    setError('Không tải được danh mục')
                } finally {
                    setIsLoadingCategories(false)
                }
            }
            fetchCategories()
        }
    }, [isOpen])

    // Đóng dropdown khi click ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Xử lý tất cả input (text, number, checkbox)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? (checked ? 1 : 0)
                : ['price', 'origin_price', 'stock_qty', 'low_stock_threshold'].includes(name)
                    ? Number(value) || 0
                    : value
        }))
    }

    const handleCategorySelect = (id) => {
        setFormData(prev => ({ ...prev, category_id: id }))
        setDropdownOpen(false)
    }

    const selectedCategory = categories.find(c => c.id === formData.category_id)

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        if (files.length + images.length > 10) {
            alert('Tối đa 10 ảnh!')
            return
        }
        setImages(prev => [...prev, ...files])
        const previews = files.map(f => URL.createObjectURL(f))
        setImagePreviews(prev => [...prev, ...previews])
    }

    const removeImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index])
        setImages(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // DEBUG – XEM DỮ LIỆU GỬI ĐI
        console.log('Gửi đi:', { ...formData, images: images.length })

        if (!formData.name.trim()) return setError('Vui lòng nhập tên sản phẩm!')
        if (formData.price <= 0) return setError('Giá bán phải lớn hơn 0!')
        if (images.length === 0) return setError('Vui lòng chọn ít nhất 1 ảnh!')
        if (!formData.category_id) return setError('Vui lòng chọn danh mục!')

        setIsSaving(true)
        setError(null)

        const payload = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            payload.append(key, value)
        })
        images.forEach(file => payload.append('images', file))

        try {
            await createProduct(payload)
            alert(`Tạo sản phẩm "${formData.name}" thành công!`)
            onCreateSuccess?.()
            onClose()
        } catch (err) {
            const msg = err.response?.data?.message || 'Lỗi tạo sản phẩm'
            setError(msg)
            console.error('Lỗi:', err.response?.data)
        } finally {
            setIsSaving(false)
        }
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black/30 flex justify-center items-center z-50"
            style={{ backdropFilter: 'blur(8px)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative overflow-y-auto max-h-screen"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FiPlus className="text-emerald-600 text-3xl" />
                    Tạo Sản Phẩm Mới
                </h2>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
                >
                    <FiX className="w-6 h-6 text-gray-500" />
                </button>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Tên & Slug */}
                    <div className="grid grid-cols-2 gap-6">
                        <label className="block">
                            <span className="text-gray-700 font-medium">Tên sản phẩm *</span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                                placeholder="Nhập tên sản phẩm"
                            />
                        </label>
                        <label className="block">
                            <span className="text-gray-700 font-medium">Slug</span>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="Tự động nếu để trống"
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                            />
                        </label>
                    </div>

                    {/* Danh mục */}
                    <div className="relative" ref={dropdownRef}>
                        <span className="text-gray-700 font-medium block mb-2">Danh mục *</span>
                        <div
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center hover:border-indigo-500 transition-colors"
                        >
                            <span className={selectedCategory ? 'text-gray-900' : 'text-gray-400'}>
                                {isLoadingCategories ? 'Đang tải danh mục...' : selectedCategory?.name || 'Chọn danh mục'}
                            </span>
                            <FiChevronDown className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {dropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                                {categories.length === 0 ? (
                                    <div className="px-4 py-3 text-gray-500 text-center">Không có danh mục</div>
                                ) : (
                                    categories.map(cat => (
                                        <div
                                            key={cat.id}
                                            onClick={() => handleCategorySelect(cat.id)}
                                            className={`px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-colors ${formData.category_id === cat.id ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-700'}`}
                                        >
                                            {cat.name}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mô tả */}
                    <label className="block">
                        <span className="text-gray-700 font-medium">Mô tả sản phẩm</span>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                        />
                    </label>

                    {/* Upload ảnh */}
                    <div>
                        <span className="text-gray-700 font-medium block mb-3">
                            Hình ảnh sản phẩm * (Tối đa 10)
                        </span>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 cursor-pointer transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <FiPackage className="mx-auto text-6xl text-gray-400 mb-4" />
                            <p className="text-gray-600">Click để chọn ảnh</p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-5 gap-4 mt-6">
                                {imagePreviews.map((src, i) => (
                                    <div key={i} className="relative group rounded-lg overflow-hidden border-2 border-gray-200">
                                        <img src={src} alt={`Preview ${i}`} className="w-full h-32 object-cover" />
                                        {i === 0 && (
                                            <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
                                                Chính
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <FiX className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-sm text-gray-500 mt-2">{images.length}/10 ảnh</p>
                    </div>

                    {/* Giá & Kho */}
                    <div className="grid grid-cols-2 gap-6">
                        <label className="block">
                            <span className="text-gray-700 font-medium">Giá gốc (VND)</span>
                            <input
                                type="number"
                                name="origin_price"
                                value={formData.origin_price}
                                onChange={handleChange}
                                min="0"
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                            />
                        </label>
                        <label className="block">
                            <span className="text-gray-700 font-medium text-red-600">Giá bán (VND) *</span>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="1"
                                required
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 font-semibold"
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <label className="block">
                            <span className="text-gray-700 font-medium">Tồn kho</span>
                            <input
                                type="number"
                                name="stock_qty"
                                value={formData.stock_qty}
                                onChange={handleChange}
                                min="0"
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                            />
                        </label>
                        <label className="block">
                            <span className="text-gray-700 font-medium">Ngưỡng cảnh báo</span>
                            <input
                                type="number"
                                name="low_stock_threshold"
                                value={formData.low_stock_threshold}
                                onChange={handleChange}
                                min="0"
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                            />
                        </label>
                        <div className="flex items-end">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="status"
                                    checked={formData.status === 1}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                />
                                <span className="font-medium text-gray-700">Đang bán ngay</span>
                            </label>
                        </div>
                    </div>

                    {/* Nút submit */}
                    <div className="flex justify-end pt-6 border-t">
                        <button
                            type="submit"
                            disabled={isSaving || isLoadingCategories}
                            className={`px-8 py-3 rounded-lg text-white font-semibold flex items-center gap-2 transition-all ${
                                isSaving || isLoadingCategories
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg'
                            }`}
                        >
                            <FiPlus className="text-xl" />
                            {isSaving ? 'Đang tạo...' : 'Tạo sản phẩm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateProductModal