import React from 'react'
import BaseModal from '~/components/admin/discount/BaseModal'

const CreateDiscountModal = ({
    isOpen,
    onClose,
    form,
    setForm,
    onSubmit,
    isSubmitting,
}) => (
    <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Tạo chương trình khuyến mãi mới"
    >
        <div className="p-6">
            <form
                id="createDiscountForm"
                onSubmit={onSubmit}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block font-medium mb-1 text-sm text-gray-700">
                            Tên chương trình{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={e =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="VD: Sale Hè 2025"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1 text-sm text-gray-700">
                            Giá trị giảm <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={form.value}
                            onChange={e =>
                                setForm({ ...form, value: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            ≤ 100: Theo % | &gt; 100: Theo tiền mặt (VND)
                        </p>
                    </div>

                    <div className="flex flex-col justify-end pb-2">
                        <label className="inline-flex items-center cursor-pointer bg-gray-50 p-3 rounded-lg border justify-between w-full">
                            <span className="font-medium text-gray-700 text-sm">
                                Trạng thái (Active)
                            </span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={form.status}
                                    onChange={e =>
                                        setForm({
                                            ...form,
                                            status: e.target.checked,
                                        })
                                    }
                                />
                                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 relative transition-all">
                                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5" />
                                </div>
                            </div>
                        </label>
                    </div>

                    <div>
                        <label className="block font-medium mb-1 text-sm text-gray-700">
                            Ngày bắt đầu
                        </label>
                        <input
                            type="datetime-local"
                            required
                            value={form.start_date}
                            onChange={e =>
                                setForm({ ...form, start_date: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1 text-sm text-gray-700">
                            Ngày kết thúc
                        </label>
                        <input
                            type="datetime-local"
                            required
                            value={form.end_date}
                            onChange={e =>
                                setForm({ ...form, end_date: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block font-medium mb-1 text-sm text-gray-700">
                            Mô tả
                        </label>
                        <textarea
                            value={form.description}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                            rows={2}
                            placeholder="Mô tả chương trình..."
                        />
                    </div>
                </div>
            </form>
        </div>

        <div className="p-6 bg-gray-50 flex justify-end">
            <button
                type="submit"
                form="createDiscountForm"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
            >
                {isSubmitting && (
                    <svg
                        className="animate-spin h-4 w-4 text-white"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                Lưu chương trình
            </button>
        </div>
    </BaseModal>
)

export default CreateDiscountModal
