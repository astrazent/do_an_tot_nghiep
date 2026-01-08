import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import Alert from '~/components/shared/Alert'
import { createPostMarketing } from '~/services/admin/aiMarketingService'
import excelIcon from '~/assets/icon/logo/excel.png';

const PostMarketingAI = () => {
    const [sheetFile, setSheetFile] = useState(null)
    const [fileName, setFileName] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

    const REQUIRED_COLUMNS_DISPLAY = [
        'product_scope',
        'content_requirement',
        'product_image',
        'time',
        'type',
    ]

    const handleFileChange = e => {
        const file = e.target.files ? e.target.files[0] : null
        if (file) {
            if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
                setErrorMessage('Vui lòng chọn file Excel (.xlsx hoặc .xls)!')
                setTimeout(() => setErrorMessage(null), 3000)
                return
            }
            setSheetFile(file)
            setFileName(file.name)
            setErrorMessage(null)
        }
    }

    const handleRemoveFile = () => {
        setSheetFile(null)
        setFileName('')
        setErrorMessage(null)
    }

    const validateSheetHeaders = () => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = e => {
                try {
                    const data = e.target.result
                    const workbook = XLSX.read(data, { type: 'array' })
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
                    const headers =
                        XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] || []

                    const missing = REQUIRED_COLUMNS_DISPLAY.filter(
                        col => !headers.includes(col)
                    )

                    if (missing.length) {
                        reject(`File thiếu cột bắt buộc: ${missing.join(', ')}`)
                    } else {
                        resolve(true)
                    }
                } catch {
                    reject('Không thể đọc file Excel.')
                }
            }
            reader.onerror = () => reject('Lỗi khi đọc file!')
            reader.readAsArrayBuffer(sheetFile)
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        if (!sheetFile) {
            setErrorMessage('Vui lòng chọn file Excel!')
            return
        }

        setLoading(true)
        setErrorMessage(null)
        setSuccessMessage(null)

        try {
            await validateSheetHeaders()
            const formData = new FormData()
            formData.append('google_sheet', sheetFile)

            const response = await createPostMarketing(formData)
            setSuccessMessage(response.message || 'Xử lý file thành công!')
            setSheetFile(null)
            setFileName('')
        } catch (err) {
            setErrorMessage(
                err.message ||
                    err.response?.data?.message ||
                    'Có lỗi xảy ra khi xử lý file.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full mx-auto">
                <div className="bg-white  shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#166534] px-8 py-12 text-center">
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Tải File Excel cho Bài Marketing
                        </h1>
                        <p className="mt-4 text-green-100 text-lg max-w-2xl mx-auto">
                            Hệ thống sẽ tự động tạo và đăng bài dựa trên dữ liệu từ file Excel.
                        </p>
                    </div>

                    {/* Body */}
                    <div className="p-8 lg:p-12 space-y-12">
                        {/* Required Columns */}
                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                                Cấu trúc file yêu cầu
                            </h2>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <p className="text-sm text-gray-600 mb-5">
                                    File Excel cần có đúng các cột sau (tên chính xác):
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                    {REQUIRED_COLUMNS_DISPLAY.map(col => (
                                        <div
                                            key={col}
                                            className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-center shadow-sm"
                                        >
                                            <code className="text-sm font-medium text-gray-800 font-mono">
                                                {col}
                                            </code>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Upload Area */}
                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
            
                                Tải lên file Excel
                            </h2>

                            <div className="relative">
                                <input
                                    id="excel-file"
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />

                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-[#166534] hover:bg-green-50/30 transition-all duration-200">
                                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-5">
                                        <img src={excelIcon} alt="excel" className="w-full h-full object-contain" />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                                        Kéo và thả file vào đây
                                    </h3>
                                    <p className="text-gray-600">
                                        hoặc{' '}
                                        <span className="text-[#166534] font-medium underline">
                                            chọn file từ máy
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-500 mt-3">
                                        Chỉ hỗ trợ định dạng .xlsx hoặc .xls
                                    </p>
                                </div>
                            </div>

                            {/* Selected File */}
                            {fileName && (
                                <div className="flex items-center justify-between bg-gray-100 px-5 py-3 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-gray-600">description</span>
                                        <span className="text-gray-800 font-medium truncate max-w-md">
                                            {fileName}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleRemoveFile}
                                        className="text-red-600 hover:text-red-800 text-xl"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </section>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !sheetFile}
                                className="w-full bg-[#166534] hover:bg-[#134d2a] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-lg py-4 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>Đang xử lý...</>
                                ) : (
                                    <>
                                        Gửi file và đăng bài
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages & Footer */}
                <div className="mt-8 text-center space-y-4">
                    {errorMessage && <Alert type="error" message={errorMessage} />}
                    {successMessage && <Alert type="success" message={successMessage} />}
                </div>
            </div>
        </div>
    )
}

export default PostMarketingAI