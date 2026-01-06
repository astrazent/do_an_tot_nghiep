// src/admin/blog/BlogCreateNew.jsx
import React, { useState, useRef, useEffect } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import ImageResize from 'quill-image-resize-module-react'

import { createPost, getListPostType } from '~/services/admin/postAdminService'
import { getAllCategories } from '~/services/user/categoryService'

// Fix bullet/list + đăng ký resize module
const Quill = ReactQuill.Quill
let Block = Quill.import('blots/block')
Block.tagName = 'div'
Quill.register(Block, true)
Quill.register('modules/imageResize', ImageResize)

const BlogCreateNew = () => {
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')
    const [content, setContent] = useState('')
    const [author, setAuthor] = useState('Admin Nguyễn')
    const [publishedAt, setPublishedAt] = useState('')
    const [status, setStatus] = useState(true)
    const [postTypeId, setPostTypeId] = useState('')
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([])

    const [featuredImageFile, setFeaturedImageFile] = useState(null)
    const [featuredImagePreview, setFeaturedImagePreview] = useState(null)
    const featuredInputRef = useRef(null)

    // Lưu mapping: { imageDataUrl: { file, display_order } }
    const [imageMapping, setImageMapping] = useState({})
    const imageCounterRef = useRef(0)
    const quillRef = useRef(null)

    const [postTypes, setPostTypes] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    // Load data
    useEffect(() => {
        Promise.all([getListPostType(), getAllCategories()])
            .then(([ptRes, catRes]) => {
                setPostTypes(ptRes?.data || ptRes || [])
                setCategories(catRes || [])
            })
            .catch(() => alert('Không tải được dữ liệu loại bài viết hoặc danh mục'))
            .finally(() => setLoading(false))
    }, [])

    // Tạo slug tự động
    useEffect(() => {
        if (!title.trim()) return
        const newSlug = title.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '')
            .trim().replace(/\s+/g, '-').replace(/-+/g, '-')
        setSlug(newSlug)
    }, [title])

    // XỬ LÝ ẢNH: Chuyển thành base64 để hiển thị ổn định
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!quillRef.current) return
            
            const quill = quillRef.current.getEditor()

            const handleImageUpload = (file) => {
                const range = quill.getSelection() || { index: quill.getLength() }
                imageCounterRef.current += 1
                const id = imageCounterRef.current

                const reader = new FileReader()
                reader.onload = (e) => {
                    const imageDataUrl = e.target.result

                    quill.insertEmbed(range.index, 'image', imageDataUrl, 'user')
                    quill.setSelection(range.index + 1)

                    setImageMapping(prev => ({
                        ...prev,
                        [imageDataUrl]: { file, display_order: id }
                    }))

                    console.log('Đã chèn ảnh:', id, file.name)
                }
                reader.readAsDataURL(file)
            }

            // Override toolbar image button
            const toolbar = quill.getModule('toolbar')
            if (toolbar) {
                toolbar.addHandler('image', () => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    input.multiple = false
                    input.onchange = () => {
                        const file = input.files?.[0]
                        if (file) {
                            console.log('Chọn ảnh từ toolbar:', file.name)
                            handleImageUpload(file)
                        }
                    }
                    input.click()
                })
            }

            // Xử lý paste và drop
            const handlePasteAndDrop = (e) => {
                const items = e.clipboardData?.items || e.dataTransfer?.items
                if (!items) return

                const images = Array.from(items).filter(item => item.type.indexOf('image') !== -1)
                
                if (images.length > 0) {
                    e.preventDefault()
                    e.stopPropagation()
                    
                    images.forEach(item => {
                        const file = item.getAsFile()
                        if (file) {
                            console.log('Paste/drop ảnh:', file.name)
                            handleImageUpload(file)
                        }
                    })
                }
            }

            const editor = quill.root
            editor.addEventListener('paste', handlePasteAndDrop, true)
            editor.addEventListener('drop', handlePasteAndDrop, true)

            return () => {
                editor.removeEventListener('paste', handlePasteAndDrop, true)
                editor.removeEventListener('drop', handlePasteAndDrop, true)
            }
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    // TỰ ĐỘNG ĐIỀU CHỈNH CHIỀU CAO EDITOR THEO NỘI DUNG
    useEffect(() => {
        if (!quillRef.current) return
        const quill = quillRef.current.getEditor()
        const container = quill.container

        const adjustHeight = () => {
            container.style.height = 'auto'
            container.style.height = `${container.scrollHeight + 20}px`
        }

        quill.on('text-change', adjustHeight)
        quill.on('selection-change', adjustHeight)

        // Gọi lần đầu sau khi mount
        setTimeout(adjustHeight, 100)

        return () => {
            quill.off('text-change', adjustHeight)
            quill.off('selection-change', adjustHeight)
        }
    }, [])

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['link', 'image', 'video'],
            ['clean']
        ],
        imageResize: { parchment: Quill.import('parchment'), modules: ['Resize', 'DisplaySize'] }
    }

    const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'indent', 'align', 'link', 'image', 'video']

    // SUBMIT: Thay ảnh base64 thành [IMAGE_X] trước khi gửi
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim()) return alert('Vui lòng nhập tiêu đề!')
        if (!featuredImageFile) return alert('Vui lòng chọn ảnh đại diện!')
        
        const uploadedImages = Object.values(imageMapping)
        if (uploadedImages.length === 0) return alert('Vui lòng chèn ít nhất 1 ảnh vào nội dung bài viết!')

        setSubmitting(true)

        let processedContent = content
        
        Object.entries(imageMapping).forEach(([imageDataUrl, data]) => {
            const placeholder = `[IMAGE_${data.display_order}]`
            const escapedUrl = imageDataUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            const imgRegex = new RegExp(`<img[^>]*src="${escapedUrl}"[^>]*>`, 'g')
            processedContent = processedContent.replace(imgRegex, placeholder)
        })

        console.log('Content sau khi xử lý:', processedContent)

        const fd = new FormData()
        fd.append('title', title)
        fd.append('slug', slug)
        fd.append('description', description)
        fd.append('content', processedContent)
        fd.append('author_name', author)
        fd.append('status', status ? 1 : 0)
        fd.append('admin_id', 1)
        if (publishedAt) fd.append('published_at', publishedAt)
        if (postTypeId) fd.append('post_type_id', postTypeId)
        selectedCategoryIds.forEach(id => fd.append('category_ids[]', id))

        // Ảnh đại diện
        fd.append('images', featuredImageFile)
        fd.append('images_meta[is_main][]', 1)
        fd.append('images_meta[display_order][]', 0)
        fd.append('images_meta[placeholder][]', '')

        // Ảnh trong nội dung
        uploadedImages
            .sort((a, b) => a.display_order - b.display_order)
            .forEach(img => {
                fd.append('images', img.file)
                fd.append('images_meta[is_main][]', 0)
                fd.append('images_meta[display_order][]', img.display_order)
                fd.append('images_meta[placeholder][]', `[IMAGE_${img.display_order}]`)
            })

        try {
            await createPost(fd)
            alert('Tạo bài viết thành công!')
        } catch (err) {
            console.error(err)
            alert(err.response?.data?.message || 'Lỗi server!')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="p-6 text-center text-xl">Đang tải dữ liệu...</div>

    return (
        <>
            {/* CSS responsive */}
            <style jsx>{`
                .quill-auto-height .ql-container {
                    min-height: 300px;
                    height: auto !important;
                    overflow: visible !important;
                    border-bottom: none !important;
                }
                .quill-auto-height .ql-editor {
                    min-height: 300px;
                    padding-bottom: 120px;
                    line-height: 1.7;
                }
                .quill-auto-height .ql-toolbar {
                    border-top: 1px solid #ccc;
                    border-left: 1px solid #ccc;
                    border-right: 1px solid #ccc;
                }
                .quill-auto-height:focus-within .ql-container {
                    border-color: #3b82f6 !important;
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
                }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .quill-auto-height .ql-editor {
                        padding-bottom: 100px;
                    }
                    .featured-preview img {
                        height: 240px !important;
                    }
                    .sidebar-section {
                        padding: 1.25rem !important;
                    }
                }

                @media (max-width: 640px) {
                    .quill-auto-height .ql-editor {
                        min-height: 350px;
                    }
                    .featured-preview img {
                        height: 200px !important;
                    }
                }
            `}</style>

            <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 md:mb-8">
                        Tạo bài viết mới
                    </h1>

                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* PHẦN CHÍNH - FORM */}
                        <div className="flex-1 bg-white rounded-2xl shadow-lg p-5 sm:p-6 lg:p-8 order-2 lg:order-1">
                            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                                <input
                                    type="text"
                                    placeholder="Tiêu đề bài viết *"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full text-3xl sm:text-4xl font-bold border-b-2 focus:border-blue-500 outline-none pb-3 sm:pb-4"
                                    required
                                />

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-600">
                                    <span className="font-medium">Slug:</span>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={e => setSlug(e.target.value)}
                                        className="flex-1 bg-gray-100 rounded-lg px-4 py-2 outline-none"
                                    />
                                </div>

                                {/* ẢNH ĐẠI DIỆN */}
                                <div>
                                    <label className="block text-lg font-semibold mb-3 sm:mb-4">
                                        Ảnh đại diện *
                                    </label>
                                    {!featuredImagePreview ? (
                                        <div
                                            onClick={() => featuredInputRef.current?.click()}
                                            className="border-2 border-dashed border-gray-400 rounded-xl h-64 sm:h-80 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-50"
                                        >
                                            <p className="text-base sm:text-lg text-gray-500 px-4 text-center">
                                                Nhấn để chọn ảnh đại diện
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="relative featured-preview">
                                            <img
                                                src={featuredImagePreview}
                                                alt="Featured"
                                                className="w-full h-64 sm:h-96 object-cover rounded-xl"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFeaturedImageFile(null)
                                                    setFeaturedImagePreview(null)
                                                }}
                                                className="absolute top-3 right-3 bg-red-600 text-white w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-red-700 flex items-center justify-center text-lg sm:text-xl"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                    <input
                                        ref={featuredInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                setFeaturedImageFile(file)
                                                setFeaturedImagePreview(URL.createObjectURL(file))
                                            }
                                        }}
                                        className="hidden"
                                    />
                                </div>

                                <textarea
                                    placeholder="Mô tả ngắn (SEO)..."
                                    rows={4}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full border rounded-lg px-4 sm:px-5 py-3 sm:py-4 resize-none focus:ring-2 focus:ring-blue-500 outline-none text-base"
                                />

                                {/* EDITOR */}
                                <div>
                                    <label className="block text-lg font-semibold mb-3">
                                        Nội dung bài viết
                                    </label>
                                    <div className="border border-gray-300 rounded-lg overflow-hidden quill-auto-height">
                                        <ReactQuill
                                            ref={quillRef}
                                            theme="snow"
                                            value={content}
                                            onChange={setContent}
                                            modules={modules}
                                            formats={formats}
                                            placeholder="Viết nội dung... Paste/drop ảnh để chèn!"
                                            className="bg-white text-base"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-blue-600 text-white text-base sm:text-lg font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                                    >
                                        {submitting ? 'Đang tạo...' : 'Tạo bài viết'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* SIDEBAR */}
                        <div className="w-full lg:w-96 space-y-5 sm:space-y-6 order-1 lg:order-2">
                            <div className="bg-white p-5 sm:p-6 rounded-xl shadow sidebar-section">
                                <h3 className="font-bold text-lg mb-4">Loại bài viết</h3>
                                <select
                                    value={postTypeId}
                                    onChange={e => setPostTypeId(e.target.value)}
                                    className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">-- Chọn loại --</option>
                                    {postTypes.map(pt => (
                                        <option key={pt.id} value={pt.id}>
                                            {pt.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-white p-5 sm:p-6 rounded-xl shadow sidebar-section">
                                <h3 className="font-bold text-lg mb-4">Danh mục</h3>
                                <div className="max-h-56 sm:max-h-64 overflow-y-auto space-y-2.5">
                                    {categories.map(cat => (
                                        <label
                                            key={cat.id}
                                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedCategoryIds.includes(cat.id)}
                                                onChange={e => {
                                                    if (e.target.checked) {
                                                        setSelectedCategoryIds(prev => [...prev, cat.id])
                                                    } else {
                                                        setSelectedCategoryIds(prev => prev.filter(id => id !== cat.id))
                                                    }
                                                }}
                                                className="w-5 h-5 text-blue-600 rounded"
                                            />
                                            <span className="text-gray-700">{cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-5 sm:p-6 rounded-xl shadow space-y-5 sidebar-section">
                                <div>
                                    <label className="block font-medium mb-2">Tác giả</label>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={e => setAuthor(e.target.value)}
                                        className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-2">Ngày đăng</label>
                                    <input
                                        type="datetime-local"
                                        value={publishedAt}
                                        onChange={e => setPublishedAt(e.target.value)}
                                        className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Công khai</span>
                                    <input
                                        type="checkbox"
                                        checked={status}
                                        onChange={e => setStatus(e.target.checked)}
                                        className="w-5 h-5 text-blue-600 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BlogCreateNew