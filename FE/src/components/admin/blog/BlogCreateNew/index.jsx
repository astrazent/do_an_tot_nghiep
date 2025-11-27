// src/components/BlogCreateNew.jsx
import React, { useState, useRef, useEffect } from 'react'
import ReactQuill, { Quill } from 'react-quill-new'
import ImageResize from 'quill-image-resize-module-react'
import 'react-quill-new/dist/quill.snow.css'

// Đăng ký module resize ảnh
Quill.register('modules/imageResize', ImageResize)

const BlogCreateNew = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [content, setContent] = useState('')
    const [author, setAuthor] = useState('Admin Nguyễn')
    const [publishedAt, setPublishedAt] = useState('')
    const [status, setStatus] = useState(true)
    const quillRef = useRef(null)

    // Hàm upload ảnh lên Cloudinary (miễn phí) hoặc server của bạn
    const uploadImageToCloudinary = async file => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'your_upload_preset') // Thay bằng preset của bạn

        const res = await fetch(
            'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', // Thay your_cloud_name
            {
                method: 'POST',
                body: formData,
            }
        )
        const data = await res.json()
        return data.secure_url
    }

    // Nếu bạn dùng server riêng (localhost), dùng hàm này thay thế:
    // const uploadImageToServer = async (file) => {
    //     const formData = new FormData();
    //     formData.append('image', file);
    //     const res = await fetch('/api/upload', { method: 'POST', body: formData });
    //     const json = await res.json();
    //     return json.url;
    // };

    const imageHandler = () => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()

        input.onchange = async () => {
            const file = input.files?.[0]
            if (!file) return

            const quill = quillRef.current?.getEditor()
            if (!quill) return

            const range = quill.getSelection(true) || { index: 0 }

            // Chèn ảnh loading tạm thời
            quill.insertEmbed(
                range.index,
                'image',
                'https://i.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.webp'
            ) // spinner nhỏ
            quill.setSelection(range.index + 1)

            try {
                // Upload ảnh thật
                const imageUrl = await uploadImageToCloudinary(file)

                // Xóa ảnh loading và chèn ảnh thật
                quill.deleteText(range.index, 1)
                quill.insertEmbed(range.index, 'image', imageUrl)
                quill.setSelection(range.index + 1)
            } catch (error) {
                console.error('Upload ảnh thất bại:', error)
                quill.deleteText(range.index, 1)
                alert('Không thể tải ảnh lên. Vui lòng thử lại!')
            }
        }
    }

    useEffect(() => {
        if (!quillRef.current) return

        const quill = quillRef.current.getEditor()

        // 1. Click vào ảnh → tự động chọn ảnh đó
        const handleClick = event => {
            if (event.target && event.target.tagName === 'IMG') {
                const blot = Quill.find(event.target)
                if (blot) {
                    const index = quill.getIndex(blot)
                    quill.setSelection(index, 1, 'user')
                }
            }
        }
        quill.root.addEventListener('click', handleClick)

        // 2. Xóa ảnh bằng Delete hoặc Backspace (mượt như WordPress)
        const deleteImageIfSelected = (range, context) => {
            if (!range || range.length === 0) {
                // Nếu không có vùng chọn, kiểm tra xem con trỏ có đang ở trên ảnh không
                const [blot] = quill.getLeaf(range.index)
                if (blot && blot.domNode && blot.domNode.tagName === 'IMG') {
                    quill.deleteText(range.index, 1, 'user')
                    return false // ngăn hành vi mặc định
                }
            } else {
                // Nếu có vùng chọn, kiểm tra trong vùng chọn có ảnh không
                const contents = quill.getContents(range.index, range.length)
                const hasImage = contents.ops.some(
                    op => op.insert && op.insert.image
                )
                if (hasImage) {
                    quill.deleteText(range.index, range.length, 'user')
                    return false
                }
            }
            return true // để Quill xử lý bình thường
        }

        // Gắn phím Delete và Backspace
        quill.keyboard.addBinding(
            { key: 'Delete' },
            { collapsed: true },
            deleteImageIfSelected
        )
        quill.keyboard.addBinding(
            { key: 'Backspace' },
            { collapsed: true },
            range => {
                if (range.index === 0) return true
                const [blot] = quill.getLeaf(range.index - 1)
                if (blot && blot.domNode && blot.domNode.tagName === 'IMG') {
                    quill.deleteText(range.index - 1, 1, 'user')
                    return false
                }
                return deleteImageIfSelected(range)
            }
        )

        // Cleanup khi component unmount
        return () => {
            quill.root.removeEventListener('click', handleClick)
        }
    }, [])

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // Tiêu đề
            ['bold', 'italic', 'underline', 'strike'], // In đậm, nghiêng...
            [{ list: 'ordered' }, { list: 'bullet' }], // Danh sách
            [{ indent: '-1' }, { indent: '+1' }], // Thụt đầu dòng
            [{ align: [] }], // Căn lề
            ['link', 'image', 'video'], // ← Dòng QUAN TRỌNG NHẤT: có nút ảnh
            ['clean'], // Xóa format
        ],
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize'],
        },
    }

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'bullet',
        'indent',
        'align',
        'link',
        'image',
        'video',
        'color',
        'background',
    ]

    const handleSubmit = e => {
        e.preventDefault()
        const blogData = {
            title,
            description,
            content,
            author,
            publishedAt: publishedAt || new Date().toISOString(),
            status,
        }
        console.log('Bài viết đã lưu:', blogData)
        alert('Đã lưu bài viết thành công!')
    }

    return (
        <>
            <style jsx>{`
                .ql-container.ql-snow {
                    border: none !important;
                }
                .ql-editor {
                    min-height: 350px;
                    padding: 16px;
                    border-radius: 0 0 8px 8px;
                }
                .ql-container {
                    border: 1px solid #d1d5db !important;
                    border-top: none !important;
                    border-radius: 0 0 8px 8px;
                }
                /* Tùy chọn: làm đẹp placeholder */
                .ql-editor.ql-blank::before {
                    color: #9ca3af;
                    font-style: italic;
                }
            `}</style>

            <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
                {/* Phần chính - Soạn bài viết */}
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-6">
                        Soạn bài viết
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Tiêu đề */}
                        <div>
                            <label className="block font-medium mb-2 text-gray-700">
                                Tiêu đề
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Nhập tiêu đề bài viết..."
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                            />
                        </div>

                        {/* Mô tả ngắn */}
                        <div>
                            <label className="block font-medium mb-2 text-gray-700">
                                Mô tả ngắn
                            </label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Mô tả ngắn gọn nội dung bài viết..."
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition"
                            />
                        </div>

                        {/* Nội dung bài viết - ReactQuill */}
                        <div>
                            <label className="block font-medium mb-2 text-gray-700">
                                Nội dung bài viết
                            </label>
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <ReactQuill
                                    ref={quillRef}
                                    theme="snow"
                                    value={content}
                                    onChange={setContent}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Nhập nội dung bài viết (có thể chèn ảnh, định dạng...)"
                                    className="bg-white"
                                    style={{ minHeight: '400px' }}
                                />
                            </div>
                        </div>

                        {/* Nút lưu */}
                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition flex items-center gap-2"
                            >
                                Lưu bài viết
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sidebar - Cài đặt */}
                <div className="w-full md:w-80 bg-white p-6 rounded-2xl shadow-sm space-y-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Cài đặt & Trạng thái
                    </h3>

                    {/* Tác giả */}
                    <div>
                        <label className="block font-medium mb-1 text-gray-700">
                            Tác giả
                        </label>
                        <input
                            type="text"
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Ngày phát hành */}
                    <div>
                        <label className="block font-medium mb-1 text-gray-700">
                            Ngày phát hành
                        </label>
                        <input
                            type="datetime-local"
                            value={publishedAt}
                            onChange={e => setPublishedAt(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Trạng thái */}
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">
                            Trạng thái
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={status}
                                onChange={e => setStatus(e.target.checked)}
                            />
                            <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition"></div>
                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></span>
                        </label>
                    </div>

                    <div className="pt-6 border-t border-gray-200 space-y-3">
                        <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition">
                            Lưu nháp
                        </button>
                        <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2">
                            Đăng bài
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BlogCreateNew
