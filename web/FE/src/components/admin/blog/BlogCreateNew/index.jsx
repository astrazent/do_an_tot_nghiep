import React, { useState } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const BlogCreateNew = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [content, setContent] = useState('')
    const [author, setAuthor] = useState('Admin Nguyễn')
    const [publishedAt, setPublishedAt] = useState('')
    const [status, setStatus] = useState(true)

    const handleSubmit = e => {
        e.preventDefault()
        const data = {
            title,
            description,
            content,
            author,
            publishedAt,
            status,
        }
        console.log('Form data:', data)
        alert('Đã lưu bài viết!')
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
            <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-semibold mb-4">📝 Soạn bài viết</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block font-medium mb-2">
                            Tiêu đề
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Nhập tiêu đề bài viết..."
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-2">
                            Mô tả ngắn
                        </label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Mô tả ngắn gọn nội dung bài viết..."
                            rows="3"
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block font-medium mb-2">
                            Nội dung bài viết
                        </label>
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            placeholder="Nhập nội dung bài viết (có thể chèn ảnh, định dạng...)"
                            className="h-64"
                        />
                    </div>

                    <div className="pt-6 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            💾 Lưu bài viết
                        </button>
                    </div>
                </form>
            </div>

            <div className="w-full md:w-80 bg-white p-6 rounded-2xl shadow-sm space-y-6">
                <h3 className="text-lg font-semibold mb-3">
                    ⚙️ Cài đặt & Trạng thái
                </h3>

                <div>
                    <label className="block font-medium mb-1">Tác giả</label>
                    <input
                        type="text"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        Ngày phát hành
                    </label>
                    <input
                        type="datetime-local"
                        value={publishedAt}
                        onChange={e => setPublishedAt(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <span className="font-medium">Trạng thái</span>
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={status}
                            onChange={e => setStatus(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 relative transition-all">
                            <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></span>
                        </div>
                    </label>
                </div>

                <div className="pt-6 border-t">
                    <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg mb-2">
                        📝 Lưu nháp
                    </button>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg">
                        🚀 Đăng bài
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BlogCreateNew
