import React, { useState, useEffect } from 'react'
import { HiX, HiTrash, HiPlus, HiSearch } from 'react-icons/hi'
import { useAlert } from '~/contexts/AlertContext'
import { getAllDiscountProducts } from '~/services/admin/discountProductService'
import { getListProduct } from '~/services/admin/productAdminService'
import { getProductById } from '~/services/admin/productAdminService'

const EditDiscountModal = ({
    isOpen,
    onClose,
    discount,
    onSubmit,
    isSubmitting,
}) => {
    const { showAlert } = useAlert()

    const [form, setForm] = useState({
        name: '',
        description: '',
        value: '',
        start_date: '',
        end_date: '',
        status: true,
    })

    const [currentProducts, setCurrentProducts] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [loadingProducts, setLoadingProducts] = useState(false)
    const [addedProductIds, setAddedProductIds] = useState([])
    const [removedProductIds, setRemovedProductIds] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        if (discount && isOpen) {
            setForm({
                name: discount.name || '',
                description: discount.description || '',
                value: discount.value || '',
                start_date: discount.start_date
                    ? new Date(discount.start_date).toISOString().slice(0, 16)
                    : '',
                end_date: discount.end_date
                    ? new Date(discount.end_date).toISOString().slice(0, 16)
                    : '',
                status: discount.status === 1 || discount.status === true,
            })

            setAddedProductIds([])
            setRemovedProductIds([])
            fetchCurrentProducts()
            fetchAllProducts()
        }
    }, [discount, isOpen])

    const fetchCurrentProducts = async () => {
        try {
            setLoadingProducts(true)
            const response = await getAllDiscountProducts()
            const discountProducts = response.filter(
                dp => dp.discount_id === discount.id
            )
            const productDetails = await Promise.all(
                discountProducts.map(dp => getProductById(dp.product_id))
            )
            setCurrentProducts(
                productDetails.filter(p => p?.data).map(p => p.data)
            )
        } catch {
            showAlert('Lỗi khi tải danh sách sản phẩm hiện tại', {
                type: 'error',
            })
        } finally {
            setLoadingProducts(false)
        }
    }

    const fetchAllProducts = async () => {
        try {
            setLoadingProducts(true)
            const response = await getListProduct({ limit: 1000, offset: 0 })
            setAllProducts(response.data || [])
        } catch {
            showAlert('Lỗi khi tải danh sách sản phẩm', { type: 'error' })
        } finally {
            setLoadingProducts(false)
        }
    }

    const handleChange = e => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleAddProduct = productId => {
        if (!addedProductIds.includes(productId)) {
            setAddedProductIds(prev => [...prev, productId])
        }
    }

    const handleRemoveProduct = productId => {
        setCurrentProducts(prev => prev.filter(p => p.id !== productId))
        setRemovedProductIds(prev => [...new Set([...prev, productId])])
    }

    const handleRestoreProduct = productId => {
        const product = allProducts.find(p => p.id === productId)
        if (product) {
            setCurrentProducts(prev => [...prev, product])
        }
        setRemovedProductIds(prev => prev.filter(id => id !== productId))
    }

    const handleRemoveAddedProduct = productId => {
        setAddedProductIds(prev => prev.filter(id => id !== productId))
    }

    /* ======================= VALIDATION + SUBMIT ======================= */
    const handleSubmit = async e => {
        e.preventDefault()

        /* ---- NAME ---- */
        if (!form.name || !form.name.trim()) {
            return showAlert('Tên chương trình không được để trống', {
                type: 'error',
            })
        }
        if (form.name.trim().length < 3) {
            return showAlert('Tên chương trình phải có ít nhất 3 ký tự', {
                type: 'error',
            })
        }

        /* ---- VALUE ---- */
        const discountValue = Number(form.value)
        if (isNaN(discountValue)) {
            return showAlert('Giá trị giảm phải là số', { type: 'error' })
        }
        if (discountValue <= 0) {
            return showAlert('Giá trị giảm phải lớn hơn 0', {
                type: 'error',
            })
        }

        /* ---- DATE ---- */
        if (form.end_date && !form.start_date) {
            return showAlert('Vui lòng chọn ngày bắt đầu trước', {
                type: 'error',
            })
        }

        if (form.start_date && form.end_date) {
            const start = new Date(form.start_date)
            const end = new Date(form.end_date)

            if (end <= start) {
                return showAlert('Ngày kết thúc phải sau ngày bắt đầu', {
                    type: 'error',
                })
            }
        }

        /* ---- PRODUCTS ---- */
        const finalProductIds = [
            ...currentProducts
                .map(p => p.id)
                .filter(id => !removedProductIds.includes(id)),
            ...addedProductIds,
        ]

        if (finalProductIds.length === 0) {
            return showAlert('Phải áp dụng khuyến mãi cho ít nhất 1 sản phẩm', {
                type: 'error',
            })
        }

        const payload = {
            name: form.name.trim(),
            description: form.description?.trim() || '',
            value: discountValue,
            status: form.status ? 1 : 0,
            start_date: form.start_date
                ? new Date(form.start_date).toISOString()
                : null,
            end_date: form.end_date
                ? new Date(form.end_date).toISOString()
                : null,
            product_ids: finalProductIds,
        }

        try {
            await onSubmit(discount.id, payload)
            showAlert('Cập nhật chương trình khuyến mãi thành công!', {
                type: 'success',
            })
            onClose()
        } catch {
            showAlert('Lỗi khi cập nhật chương trình khuyến mãi', {
                type: 'error',
            })
        }
    }

    const filteredProducts = allProducts.filter(p =>
        p?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Chỉnh sửa chương trình khuyến mãi
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <HiX size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Thông tin cơ bản */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Tên chương trình{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Mô tả
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Giá trị giảm {' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="value"
                                        value={form.value}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Ngày bắt đầu
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="start_date"
                                        value={form.start_date}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Ngày kết thúc
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="end_date"
                                        value={form.end_date}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="status"
                                    id="status"
                                    checked={form.status}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="status"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Kích hoạt chương trình
                                </label>
                            </div>
                        </div>

                        {/* Quản lý sản phẩm */}
                        <div className="border-t border-gray-200 pt-6 space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Quản lý sản phẩm áp dụng
                            </h3>

                            {/* Sản phẩm hiện có */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-semibold text-gray-700">
                                        Sản phẩm đang áp dụng (
                                        {currentProducts.length})
                                    </h4>
                                </div>

                                {loadingProducts ? (
                                    <div className="text-center py-8 text-gray-500">
                                        Đang tải...
                                    </div>
                                ) : (
                                    <div className="border border-gray-200 rounded-md overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            Tên sản phẩm
                                                        </th>
                                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            Giá gốc
                                                        </th>
                                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-24">
                                                            Thao tác
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {currentProducts.length ===
                                                    0 ? (
                                                        <tr>
                                                            <td
                                                                colSpan="3"
                                                                className="px-4 py-8 text-center text-gray-500"
                                                            >
                                                                Chưa có sản phẩm
                                                                nào được áp dụng
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        currentProducts.map(
                                                            p =>
                                                                p && p.id ? (
                                                                    <tr
                                                                        key={
                                                                            p.id
                                                                        }
                                                                        className="hover:bg-gray-50"
                                                                    >
                                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                                            {p.name ||
                                                                                'Không có tên'}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                                                                            {p.price
                                                                                ? p.price.toLocaleString(
                                                                                      'vi-VN'
                                                                                  ) +
                                                                                  'đ'
                                                                                : 'N/A'}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-center">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleRemoveProduct(
                                                                                        p.id
                                                                                    )
                                                                                }
                                                                                className="inline-flex items-center justify-center text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded transition-colors"
                                                                                title="Gỡ khỏi chương trình"
                                                                            >
                                                                                <HiTrash
                                                                                    size={
                                                                                        18
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ) : null
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sản phẩm sẽ bị gỡ */}
                            {removedProductIds.length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                    <h4 className="text-sm font-semibold text-red-900 mb-2">
                                        Sản phẩm sẽ bị gỡ khỏi chương trình (
                                        {removedProductIds.length})
                                    </h4>
                                    <ul className="space-y-1">
                                        {removedProductIds.map(id => {
                                            const prod = allProducts.find(
                                                p => p.id === id
                                            )
                                            return prod ? (
                                                <li
                                                    key={id}
                                                    className="flex items-center justify-between text-sm text-red-900"
                                                >
                                                    <span>
                                                        •{' '}
                                                        {prod.name ||
                                                            'Không có tên'}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRestoreProduct(
                                                                id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-800 ml-2"
                                                        title="Khôi phục"
                                                    >
                                                        <HiPlus size={16} />
                                                    </button>
                                                </li>
                                            ) : null
                                        })}
                                    </ul>
                                </div>
                            )}

                            {/* Thêm sản phẩm mới */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-semibold text-gray-700">
                                        Thêm sản phẩm
                                    </h4>
                                </div>

                                {/* Ô tìm kiếm */}
                                <div className="mb-3">
                                    <div className="relative">
                                        <HiSearch
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            size={20}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm sản phẩm theo tên..."
                                            value={searchTerm}
                                            onChange={e =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {loadingProducts ? (
                                    <div className="text-center py-8 text-gray-500">
                                        Đang tải danh sách sản phẩm...
                                    </div>
                                ) : (
                                    <div className="border border-gray-200 rounded-md overflow-hidden">
                                        <div className="max-h-80 overflow-y-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            Tên sản phẩm
                                                        </th>
                                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            Giá gốc
                                                        </th>
                                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-32">
                                                            Thao tác
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {filteredProducts.length ===
                                                    0 ? (
                                                        <tr>
                                                            <td
                                                                colSpan="3"
                                                                className="px-4 py-8 text-center text-gray-500"
                                                            >
                                                                {searchTerm
                                                                    ? 'Không tìm thấy sản phẩm phù hợp'
                                                                    : 'Không có sản phẩm nào'}
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        filteredProducts.map(
                                                            p =>
                                                                p && p.id ? (
                                                                    <tr
                                                                        key={
                                                                            p.id
                                                                        }
                                                                        className="hover:bg-gray-50"
                                                                    >
                                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                                            {p.name ||
                                                                                'Không có tên'}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                                                                            {p.price
                                                                                ? p.price.toLocaleString(
                                                                                      'vi-VN'
                                                                                  ) +
                                                                                  'đ'
                                                                                : 'N/A'}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-center">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleAddProduct(
                                                                                        p.id
                                                                                    )
                                                                                }
                                                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                                                                disabled={
                                                                                    currentProducts.some(
                                                                                        cp =>
                                                                                            cp.id ===
                                                                                            p.id
                                                                                    ) ||
                                                                                    addedProductIds.includes(
                                                                                        p.id
                                                                                    ) ||
                                                                                    removedProductIds.includes(
                                                                                        p.id
                                                                                    ) // tránh thêm lại cái vừa xóa
                                                                                }
                                                                            >
                                                                                <HiPlus
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                                Thêm
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ) : null
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Danh sách sản phẩm mới thêm */}
                            {addedProductIds.length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-blue-900">
                                            Sản phẩm sẽ được thêm (
                                            {addedProductIds.length})
                                        </h4>
                                    </div>
                                    <ul className="space-y-1">
                                        {addedProductIds.map(id => {
                                            const prod = allProducts.find(
                                                p => p.id === id
                                            )
                                            return (
                                                prod && (
                                                    <li
                                                        key={id}
                                                        className="flex items-center justify-between text-sm text-blue-900"
                                                    >
                                                        <span>
                                                            •{' '}
                                                            {prod.name ||
                                                                'Không có tên'}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveAddedProduct(
                                                                    id
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-800 ml-2"
                                                        >
                                                            <HiX size={16} />
                                                        </button>
                                                    </li>
                                                )
                                            )
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditDiscountModal
