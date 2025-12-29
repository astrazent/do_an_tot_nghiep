import React, { useState, useMemo, useEffect, useRef } from 'react'
import {
    HiSearch,
    HiPlus,
} from 'react-icons/hi'
import { useInfiniteProductCollections } from '~/hooks/user/useProduct'
import { useAllCategories } from '~/hooks/user/useCategory'
import {
    useAllDiscounts,
    useCreateDiscount,
    useDeleteDiscount,
} from '~/hooks/user/useDiscount'
import {
    useAllDiscountProducts,
    useCreateDiscountProduct,
    useDeleteDiscountProduct,
} from '~/hooks/user/useDiscountProduct'
import BaseModal from '~/components/admin/discount/BaseModal'
import { useAlert } from '~/contexts/AlertContext'
import ConfirmModal from '~/components/shared/ConfirmModal'
import ViewDiscountDetailModal from '~/components/admin/discount/ViewDiscountDetailModal'
import ProductDetailModal from '~/components/admin/discount/ProductDetailModal'
import { formatCurrency } from '~/utils/formatCurrency'
import { formatDateTime } from '~/utils/formatDateTime'
import DiscountTable from '~/components/admin/discount/DiscountTable'
import ProductTable from '~/components/admin/discount/ProductTable'
import CreateDiscountModal from '~/components/admin/discount/CreateDiscountModal'
import AddProductPreviewModal from '~/components/admin/discount/AddProductPreviewModal'
const formatDateTimeForApi = dateStr => {
    if (!dateStr) return null
    return new Date(dateStr).toISOString()
}

const DiscountManagement = () => {
    const { showAlert } = useAlert()

    const { data: categoryData } = useAllCategories()
    const { data: discountData } = useAllDiscounts()
    const { data: discountProductData } = useAllDiscountProducts()
    const createDiscountMutation = useCreateDiscount()
    const deleteDiscountMutation = useDeleteDiscount()
    const createDiscountProductMutation = useCreateDiscountProduct()
    const deleteDiscountProductMutation = useDeleteDiscountProduct()

    const {
        data: productData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteProductCollections({
        limit: 1000,
        slug: 'all',
        sort: 'newest',
    })

    const [discounts, setDiscounts] = useState([])
    const [selectedIds, setSelectedIds] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc',
    })
    const [targetDiscountId, setTargetDiscountId] = useState('NEW')

    const [viewingProduct, setViewingProduct] = useState(null)
    const [selectedDiscountIds, setSelectedDiscountIds] = useState([])
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [viewingDiscount, setViewingDiscount] = useState(null)
    const [selectedPopupProductIds, setSelectedPopupProductIds] = useState([])
    const [isAddPreviewModalOpen, setIsAddPreviewModalOpen] = useState(false)
    const [pendingAddData, setPendingAddData] = useState({
        discount: null,
        products: [],
    })
    const [discountForm, setDiscountForm] = useState({
        name: '',
        description: '',
        value: 0,
        start_date: '',
        end_date: '',
        status: true,
    })

    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        message: '',
        onConfirm: () => {},
    })

    const closeConfirm = () =>
        setConfirmState(prev => ({ ...prev, isOpen: false }))
    const openConfirm = (message, action) => {
        setConfirmState({
            isOpen: true,
            message,
            onConfirm: async () => {
                await action()
                closeConfirm()
            },
        })
    }

    useEffect(() => {
        if (discountData && Array.isArray(discountData)) {
            const formattedDiscounts = discountData.map(d => ({
                ...d,
                value: parseFloat(d.value),
            }))
            setDiscounts(formattedDiscounts)
        }
    }, [discountData])

    const discountRelations = useMemo(() => {
        return Array.isArray(discountProductData) ? discountProductData : []
    }, [discountProductData])

    const categoryMap = useMemo(() => {
        if (!categoryData) return {}
        return categoryData.reduce((acc, cat) => {
            acc[cat.id] = cat
            return acc
        }, {})
    }, [categoryData])

    const allProducts = useMemo(() => {
        if (!productData) return []
        const rawProducts = productData.pages
            .flatMap(page => page.data)
            .map(product => ({
                ...product,
                price: parseFloat(product.price),
                origin_price: parseFloat(product.origin_price),
                import_price: parseFloat(product.import_price),
                category_name:
                    categoryMap[product.category_id]?.name ||
                    `Danh mục ${product.category_id}`,
            }))
        return Array.from(
            new Map(rawProducts.map(item => [item.id, item])).values()
        )
    }, [productData, categoryMap])

    const filteredProducts = useMemo(() => {
        const lowerTerm = searchTerm.toLowerCase()
        return allProducts.filter(
            p =>
                p.name.toLowerCase().includes(lowerTerm) ||
                p.category_name.toLowerCase().includes(lowerTerm)
        )
    }, [allProducts, searchTerm])

    const sortedProducts = useMemo(() => {
        let items = [...filteredProducts]
        if (sortConfig.key) {
            items.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key])
                    return sortConfig.direction === 'asc' ? -1 : 1
                if (a[sortConfig.key] > b[sortConfig.key])
                    return sortConfig.direction === 'asc' ? 1 : -1
                return 0
            })
        }
        return items
    }, [filteredProducts, sortConfig])

    const productsInViewingDiscount = useMemo(() => {
        if (!viewingDiscount) return []
        const ids = discountRelations
            .filter(r => r.discount_id === viewingDiscount.id)
            .map(r => r.product_id)
        return allProducts.filter(p => ids.includes(p.id))
    }, [viewingDiscount, discountRelations, allProducts])

    const disabledProductIds = useMemo(
        () =>
            !targetDiscountId || targetDiscountId === 'NEW'
                ? []
                : discountRelations
                      .filter(r => r.discount_id === parseInt(targetDiscountId))
                      .map(r => r.product_id),
        [targetDiscountId, discountRelations]
    )

    const handleSort = key =>
        setSortConfig({
            key,
            direction:
                sortConfig.key === key && sortConfig.direction === 'asc'
                    ? 'desc'
                    : 'asc',
        })
    const handleSelectProduct = id =>
        !disabledProductIds.includes(id) &&
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    const handleSelectAllProducts = e =>
        setSelectedIds(
            e.target.checked
                ? filteredProducts
                      .filter(p => !disabledProductIds.includes(p.id))
                      .map(p => p.id)
                : []
        )
    const handleSelectDiscount = id =>
        setSelectedDiscountIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )

    const handleSelectAllDiscounts = e => {
        if (e.target.checked) {
            setSelectedDiscountIds(discounts.map(d => d.id))
        } else {
            setSelectedDiscountIds([])
        }
    }

    const handleViewDiscount = d => {
        setSelectedPopupProductIds([])
        setViewingDiscount(d)
    }

    const handleDeleteSelectedDiscounts = () => {
        openConfirm(
            `Bạn có chắc muốn xoá ${selectedDiscountIds.length} chương trình này không?`,
            async () => {
                try {
                    await Promise.all(
                        selectedDiscountIds.map(id =>
                            deleteDiscountMutation.mutateAsync(id)
                        )
                    )
                    setSelectedDiscountIds([])
                    showAlert('Xoá chương trình khuyến mãi thành công', {
                        type: 'success',
                    })
                } catch (error) {
                    console.error(error)
                    showAlert('Có lỗi xảy ra khi xoá chương trình!', {
                        type: 'error',
                    })
                }
            }
        )
    }

    const handleAddProductsToDiscount = () => {
        if (selectedIds.length === 0 || !targetDiscountId)
            return showAlert('Vui lòng chọn sản phẩm và chương trình!', {
                type: 'info',
            })
        const selectedProductObjects = allProducts.filter(p =>
            selectedIds.includes(p.id)
        )

        if (targetDiscountId === 'NEW') {
            const now = new Date()
            const nextWeek = new Date(now.getTime() + 7 * 86400000)
            const toISO = d =>
                new Date(d.getTime() - d.getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 16)
            setDiscountForm({
                name: '',
                description: '',
                value: 0,
                start_date: toISO(now),
                end_date: toISO(nextWeek),
                status: true,
            })
            setIsCreateModalOpen(true)
        } else {
            const target = discounts.find(
                d => d.id === parseInt(targetDiscountId)
            )
            setPendingAddData({
                discount: target,
                products: selectedProductObjects,
            })
            setIsAddPreviewModalOpen(true)
        }
    }

    const handleConfirmAdd = async () => {
        if (!pendingAddData.discount) return
        try {
            await Promise.all(
                pendingAddData.products.map(p =>
                    createDiscountProductMutation.mutateAsync({
                        discount_id: pendingAddData.discount.id,
                        product_id: p.id,
                    })
                )
            )

            showAlert(
                `Đã thêm ${pendingAddData.products.length} sản phẩm vào "${pendingAddData.discount.name}"`,
                { type: 'success' }
            )
            setIsAddPreviewModalOpen(false)
            setSelectedIds([])
            setTargetDiscountId(String(pendingAddData.discount.id))
        } catch (error) {
            console.error(error)
            showAlert('Lỗi khi thêm sản phẩm vào khuyến mãi!', {
                type: 'error',
            })
        }
    }

    const handleSubmitNewDiscount = async e => {
        e.preventDefault()

        const discountPayload = {
            name: discountForm.name,
            description:
                discountForm.description ||
                `Giảm giá ${discountForm.value}${discountForm.value <= 100 ? '%' : ' VND'}`,
            value: parseFloat(discountForm.value),
            status: discountForm.status ? 1 : 0,
            start_date: formatDateTimeForApi(discountForm.start_date),
            end_date: formatDateTimeForApi(discountForm.end_date),
        }

        try {
            const newDiscount =
                await createDiscountMutation.mutateAsync(discountPayload)

            if (newDiscount && newDiscount.id && selectedIds.length > 0) {
                await Promise.all(
                    selectedIds.map(pid =>
                        createDiscountProductMutation.mutateAsync({
                            discount_id: newDiscount.id,
                            product_id: pid,
                        })
                    )
                )
            }
            showAlert(`Đã tạo chương trình "${newDiscount.name}" thành công!`, {
                type: 'success',
            })
            setIsCreateModalOpen(false)
            setSelectedIds([])
            setTargetDiscountId('NEW')
        } catch (error) {
            console.error(error)
            showAlert('Lỗi khi tạo chương trình khuyến mãi!', { type: 'error' })
        }
    }

    const handleRemoveProductsFromDiscount = () => {
        if (!viewingDiscount || selectedPopupProductIds.length === 0) return

        openConfirm(
            `Xoá ${selectedPopupProductIds.length} sản phẩm khỏi chương trình này?`,
            async () => {
                try {
                    const relationsToDelete = discountRelations.filter(
                        r =>
                            r.discount_id === viewingDiscount.id &&
                            selectedPopupProductIds.includes(r.product_id)
                    )
                    await Promise.all(
                        relationsToDelete.map(r =>
                            deleteDiscountProductMutation.mutateAsync(r.id)
                        )
                    )
                    setSelectedPopupProductIds([])
                    showAlert('Đã xoá sản phẩm khỏi chương trình', {
                        type: 'success',
                    })
                } catch (error) {
                    console.error(error)
                    showAlert('Lỗi khi xoá sản phẩm khỏi khuyến mãi!', {
                        type: 'error',
                    })
                }
            }
        )
    }

    return (
        <div className="flex flex-col gap-6 min-h-screen font-sans">
            <DiscountTable
                discounts={discounts}
                discountRelations={discountRelations}
                selectedIds={selectedDiscountIds}
                onSelect={handleSelectDiscount}
                onSelectAll={handleSelectAllDiscounts}
                onView={handleViewDiscount}
                formatDate={formatDateTime}
                onDeleteSelected={handleDeleteSelectedDiscounts}
                isDeleting={deleteDiscountMutation.isPending}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[700px]">
                <div className="p-5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white flex-shrink-0">
                    <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto items-center">
                        <h2 className="text-lg font-bold text-gray-900 whitespace-nowrap">
                            Kho Sản phẩm ({allProducts.length})
                        </h2>
                        <div className="relative w-full md:w-64">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <HiSearch size={20} />
                            </span>
                            <input
                                type="text"
                                placeholder="Tìm tên hoặc danh mục..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition bg-white"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                        <select
                            className="border border-gray-300 rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-200 outline-none text-gray-700 min-w-[200px]"
                            value={targetDiscountId}
                            onChange={e => {
                                setTargetDiscountId(e.target.value)
                                setSelectedIds([])
                            }}
                        >
                            <option
                                value="NEW"
                                className="font-bold text-blue-600"
                            >
                                Tạo mới
                            </option>
                            {discounts.map(d => (
                                <option key={d.id} value={d.id}>
                                    {d.name} (
                                    {d.value <= 100
                                        ? `-${d.value}%`
                                        : `-${(d.value / 1000).toLocaleString()}k`}
                                    )
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddProductsToDiscount}
                            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition shadow-lg whitespace-nowrap ${selectedIds.length > 0 && targetDiscountId ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
                            disabled={
                                selectedIds.length === 0 || !targetDiscountId
                            }
                        >
                            <HiPlus size={20} />
                            <span>Thêm khuyến mãi ({selectedIds.length})</span>
                        </button>
                    </div>
                </div>

                <ProductTable
                    products={sortedProducts}
                    selectedIds={selectedIds}
                    onSelect={handleSelectProduct}
                    onSelectAll={handleSelectAllProducts}
                    onSort={handleSort}
                    onViewDetail={setViewingProduct}
                    disabledIds={disabledProductIds}
                    selectableCount={
                        filteredProducts.filter(
                            p => !disabledProductIds.includes(p.id)
                        ).length
                    }
                    formatCurrency={formatCurrency}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    isLoading={isLoading}
                />
            </div>

            <CreateDiscountModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                form={discountForm}
                setForm={setDiscountForm}
                onSubmit={handleSubmitNewDiscount}
                isSubmitting={
                    createDiscountMutation.isPending ||
                    createDiscountProductMutation.isPending
                }
            />

            <ViewDiscountDetailModal
                discount={viewingDiscount}
                onClose={() => setViewingDiscount(null)}
                products={productsInViewingDiscount}
                selectedProductIds={selectedPopupProductIds}
                onSelectProduct={id =>
                    setSelectedPopupProductIds(prev =>
                        prev.includes(id)
                            ? prev.filter(i => i !== id)
                            : [...prev, id]
                    )
                }
                onSelectAll={e =>
                    setSelectedPopupProductIds(
                        e.target.checked
                            ? productsInViewingDiscount.map(p => p.id)
                            : []
                    )
                }
                onRemoveProducts={handleRemoveProductsFromDiscount}
                isRemoving={deleteDiscountProductMutation.isPending}
            />

            <AddProductPreviewModal
                isOpen={isAddPreviewModalOpen}
                data={pendingAddData}
                onClose={() => setIsAddPreviewModalOpen(false)}
                onConfirm={handleConfirmAdd}
                isAdding={createDiscountProductMutation.isPending}
            />

            <ProductDetailModal
                product={viewingProduct}
                onClose={() => setViewingProduct(null)}
            />

            <ConfirmModal
                isOpen={confirmState.isOpen}
                message={confirmState.message}
                onConfirm={confirmState.onConfirm}
                onCancel={closeConfirm}
            />
        </div>
    )
}

export default DiscountManagement
