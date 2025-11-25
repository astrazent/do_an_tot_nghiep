import React, { useState, useEffect, useRef } from 'react'
import {
    FaEdit,
    FaTrashAlt,
    FaEye,
    FaSyncAlt,
    FaEllipsisV,
    FaSearch,
    FaFilter,
    FaNewspaper,
    FaTimes,
    FaCalendar,
    FaUser,
    FaFileAlt
} from 'react-icons/fa'
import { getListPost, getByIdPost } from '~/services/admin/postAdminService'

// Utility Functions
const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
}

const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    const day = date.toLocaleDateString('vi-VN')
    return `${time} ${day}`
}
const SkeletonRow = () => (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 animate-pulse">
        <div className="col-span-3">
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="col-span-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="col-span-3">
            <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-4/5"></div>
        </div>
        <div className="col-span-2">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="col-span-1">
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="col-span-1 flex justify-center">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
    </div>
)

// Status Badge Component
const StatusBadge = ({ status }) => {
    const isPublished = status === 'Đăng'
    const config = isPublished 
        ? { label: 'Đăng', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' }
        : { label: 'Ẩn', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`}></span>
            {config.label}
        </span>
    )
}

// Status Filter Dropdown
const StatusDropdown = ({ value, onChange }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const statuses = [
        { key: 'Tất cả', label: 'Tất cả trạng thái' },
        { key: 'Đăng', label: 'Đã đăng' },
        { key: 'Ẩn', label: 'Đã ẩn' },
    ]
    
    const currentLabel = statuses.find(s => s.key === value)?.label

    return (
        <div className="relative w-full" ref={ref}>
            <div 
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:border-indigo-400 transition-colors text-sm text-gray-700"
            >
                <span className="truncate">{currentLabel}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            {open && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden">
                    {statuses.map(item => (
                        <div 
                            key={item.key}
                            onClick={() => { onChange(item.key); setOpen(false) }}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                                value === item.key 
                                    ? 'bg-indigo-50 text-indigo-600 font-medium' 
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// Action Dropdown Component
const ActionDropdown = ({ post, onToggleStatus, onEdit, onPreview, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = event => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const toggleStatusText = post.status === 'Đăng' ? 'Chuyển sang Ẩn' : 'Chuyển sang Đăng'

    const handleAction = action => {
        action()
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors"
            >
                <FaEllipsisV className="w-4 h-4" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-40 overflow-hidden">
                    <button 
                        onClick={() => handleAction(() => onPreview(post.id))} 
                        className="w-full px-4 py-3 text-left hover:bg-indigo-50 text-sm text-gray-700 flex items-center gap-3 transition-colors"
                    >
                        <FaEye className="text-indigo-500"/> Xem trước
                    </button>
                    <button 
                        onClick={() => handleAction(() => onEdit(post.id))} 
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 text-sm text-gray-700 flex items-center gap-3 transition-colors"
                    >
                        <FaEdit className="text-blue-500"/> Chỉnh sửa
                    </button>
                    <button 
                        onClick={() => handleAction(() => onToggleStatus(post.id))} 
                        className="w-full px-4 py-3 text-left hover:bg-green-50 text-sm text-green-600 flex items-center gap-3 transition-colors"
                    >
                        <FaSyncAlt className="text-green-500"/> {toggleStatusText}
                    </button>
                    <div className="h-px bg-gray-100 mx-3"></div>
                    <button 
                        onClick={() => handleAction(() => onDelete(post.id))} 
                        className="w-full px-4 py-3 text-left hover:bg-red-50 text-sm text-red-600 flex items-center gap-3 transition-colors"
                    >
                        <FaTrashAlt className="text-red-500"/> Xóa bài viết
                    </button>
                </div>
            )}
        </div>
    )
}

// Detail Modal Component
const PostDetailModal = ({ post, isOpen, onClose }) => {
    const [postDetail, setPostDetail] = useState(null)
    const [isLoadingDetail, setIsLoadingDetail] = useState(false)
    const [detailError, setDetailError] = useState(null)

    useEffect(() => {
        if (isOpen && post) {
            fetchPostDetail()
        }
    }, [isOpen, post])

    const fetchPostDetail = async () => {
        if (!post?.id) return
        
        setIsLoadingDetail(true)
        setDetailError(null)
        try {
            const response = await getByIdPost(post.id)
            setPostDetail(response.data)
        } catch (error) {
            console.error('Lỗi khi tải chi tiết bài viết:', error)
            setDetailError('Không thể tải chi tiết bài viết')
        } finally {
            setIsLoadingDetail(false)
        }
    }

    if (!isOpen) return null

    const handleModalClick = (e) => e.stopPropagation()

    const backdropStyle = {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
    }

    // Parse content và thay thế [IMAGE_X] bằng ảnh thật
    const parseContent = (content, images) => {
        if (!content) return 'Không có nội dung'
        
        let parsedContent = content
        if (images && images.length > 0) {
            images.forEach((img, index) => {
                const placeholder = `[IMAGE_${index + 1}]`
                const imgTag = `<img src="${img.url}" alt="${img.caption || ''}" class="w-full rounded-lg my-4" />`
                parsedContent = parsedContent.replace(placeholder, imgTag)
            })
        }
        return parsedContent
    }

    return (
        <div
            className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4"
            style={backdropStyle}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
                onClick={handleModalClick}
            >
                <button
                    onClick={onClose}
                    className="sticky top-4 right-4 float-right text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors z-10 bg-white shadow-md"
                >
                    <FaTimes className="w-5 h-5" />
                </button>

                {isLoadingDetail ? (
                    <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-gray-500">Đang tải chi tiết bài viết...</p>
                    </div>
                ) : detailError ? (
                    <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <p className="text-red-600 font-medium">{detailError}</p>
                        <button 
                            onClick={fetchPostDetail}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : postDetail ? (
                    <div className="p-8">
                        {/* Header with main image */}
                        {postDetail.images && postDetail.images.length > 0 && (
                            <div className="mb-6 -mx-8 -mt-8">
                                <img 
                                    src={postDetail.images[0].url} 
                                    alt={postDetail.images[0].caption || postDetail.title}
                                    className="w-full h-64 object-cover rounded-t-2xl"
                                />
                            </div>
                        )}

                        {/* Title and metadata */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{postDetail.title}</h2>
                            <p className="text-base text-gray-600 italic mb-3">{postDetail.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <FaUser className="text-indigo-500"/> {postDetail.author_name}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <FaCalendar className="text-indigo-500"/> {formatDateTime(postDetail.published_at)}
                                </span>
                                <span>•</span>
                                <StatusBadge status={postDetail.status === 1 ? 'Đăng' : 'Ẩn'} />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose max-w-none mb-6">
                            <div 
                                className="text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ 
                                    __html: parseContent(postDetail.content, postDetail.images.slice(1)) 
                                }}
                            />
                        </div>

                        {/* Additional images gallery */}
                        {postDetail.images && postDetail.images.length > 1 && (
                            <div className="border-t pt-6">
                                <h3 className="font-semibold text-gray-700 mb-3">Thư viện ảnh</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {postDetail.images.slice(1).map((img, index) => (
                                        <div key={index} className="relative group">
                                            <img 
                                                src={img.url} 
                                                alt={img.caption || `Image ${index + 1}`}
                                                className="w-full h-40 object-cover rounded-lg"
                                            />
                                            {img.caption && (
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center p-2">
                                                    <p className="text-white text-xs text-center">{img.caption}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Meta information */}
                        <div className="border-t pt-6 mt-6 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Slug:</span>
                                <span className="ml-2 font-mono text-gray-700">{postDetail.slug}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">ID bài viết:</span>
                                <span className="ml-2 font-medium text-gray-700">#{postDetail.id}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Ngày tạo:</span>
                                <span className="ml-2 text-gray-700">{formatDateTime(postDetail.created_at)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Cập nhật lần cuối:</span>
                                <span className="ml-2 text-gray-700">{formatDateTime(postDetail.updated_at)}</span>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

// Main Component
const BlogManager = () => {
    const [posts, setPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('Tất cả')
    const [dateFilter, setDateFilter] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedPost, setSelectedPost] = useState(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [error, setError] = useState(null)
    const [refreshKey, setRefreshKey] = useState(0)
    
    const displayPerPage = 5

    // Fetch posts from API
    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await getListPost()
                // Giả sử response có cấu trúc: { data: [...] } hoặc trực tiếp là array
                const postsData = response.data || response
                
                // Transform data để phù hợp với component (nếu cần)
                const transformedPosts = postsData.map(post => ({
                    id: post.id,
                    title: post.title || 'Không có tiêu đề',
                    author: post.author || post.author_name || 'Không rõ',
                    description: post.description || post.content || '',
                    published_at: post.published_at || post.created_at || '',
                    status: post.status === 1 || post.status === 'active' ? 'Đăng' : 'Ẩn',
                    views: post.views || post.view_count || 0,
                }))
                
                setPosts(transformedPosts)
                setFilteredPosts(transformedPosts)
            } catch (error) {
                console.error('Lỗi khi tải danh sách bài viết:', error)
                setError('Không thể tải dữ liệu. Vui lòng thử lại sau.')
            } finally {
                setTimeout(() => setIsLoading(false), 300)
            }
        }
        fetchPosts()
    }, [refreshKey])

    useEffect(() => {
        let result = posts
        
        if (searchTerm) {
            result = result.filter(post =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        
        if (statusFilter !== 'Tất cả') {
            result = result.filter(post => post.status === statusFilter)
        }
        
        if (dateFilter) {
            result = result.filter(post => {
                const postDate = post.published_at?.split('T')[0]
                return postDate === dateFilter
            })
        }
        
        result.sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
        setFilteredPosts(result)
        setCurrentPage(1)
    }, [searchTerm, statusFilter, dateFilter, posts])

    const handleResetFilters = () => {
        setSearchTerm('')
        setStatusFilter('Tất cả')
        setDateFilter('')
        setCurrentPage(1)
    }
    
    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1)
    }

    const handleEdit = postId => alert(`Sửa bài viết ID: ${postId}`)
    const handlePreview = postId => {
        const post = posts.find(p => p.id === postId)
        setSelectedPost(post)
        setIsDetailModalOpen(true)
    }
    
    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false)
        setTimeout(() => setSelectedPost(null), 200)
    }
    
    const handleDelete = postId => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))
            // TODO: Call API delete here
            // await deletePost(postId)
            // handleRefresh()
        }
    }
    
    const handleToggleStatus = postId => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? { ...post, status: post.status === 'Đăng' ? 'Ẩn' : 'Đăng' }
                    : post
            )
        )
        // TODO: Call API update status here
        // await updatePostStatus(postId, newStatus)
        // handleRefresh()
    }

    // Pagination
    const totalPages = Math.ceil(filteredPosts.length / displayPerPage)
    const currentPosts = filteredPosts.slice(
        (currentPage - 1) * displayPerPage,
        currentPage * displayPerPage
    )

    const pages = () => {
        if (totalPages <= 5) return [...Array(totalPages).keys()].map(i => i + 1)
        if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages]
        if (currentPage >= totalPages - 2)
            return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Bài viết</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý và theo dõi các bài viết của bạn</p>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                        <FaTimes />
                    </button>
                </div>
            )}

            {/* Filter Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    <FaFilter className="text-indigo-500" /> Bộ lọc tìm kiếm
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm theo tiêu đề, tác giả, mô tả..."
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div className="md:col-span-3">
                        <StatusDropdown value={statusFilter} onChange={setStatusFilter} />
                    </div>

                    <div className="md:col-span-3">
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={e => { setDateFilter(e.target.value); setCurrentPage(1) }}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-600"
                        />
                    </div>
                </div>
            </div>

            {/* Data Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden pb-4">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-3">Bài viết</div>
                    <div className="col-span-2">Tác giả</div>
                    <div className="col-span-3">Mô tả</div>
                    <div className="col-span-2">Ngày phát hành</div>
                    <div className="col-span-1">Trạng thái</div>
                    <div className="col-span-1 text-center">Thao tác</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-50">
                    {isLoading ? (
                        [...Array(displayPerPage)].map((_, i) => <SkeletonRow key={i} />)
                    ) : currentPosts.length > 0 ? (
                        currentPosts.map(post => (
                            <div key={post.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/80 transition-colors group">
                                <div className="col-span-3 flex flex-col justify-center overflow-hidden">
                                    <div className="font-medium text-gray-900 text-sm truncate" title={post.title}>
                                        {post.title}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                        {new Intl.NumberFormat('vi-VN').format(post.views)} lượt xem
                                    </div>
                                </div>
                                
                                <div className="col-span-2">
                                    <div className="text-sm text-gray-700 font-medium">{post.author}</div>
                                </div>
                                
                                <div className="col-span-3">
                                    <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
                                </div>
                                
                                <div className="col-span-2">
                                    <div className="text-sm text-gray-700">{formatDate(post.published_at)}</div>
                                    <div className="text-xs text-gray-400">{formatDateTime(post.published_at)}</div>
                                </div>
                                
                                <div className="col-span-1">
                                    <StatusBadge status={post.status} />
                                </div>
                                
                                <div className="col-span-1 flex items-center justify-center">
                                    <ActionDropdown
                                        post={post}
                                        onToggleStatus={handleToggleStatus}
                                        onEdit={handleEdit}
                                        onPreview={handlePreview}
                                        onDelete={handleDelete}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FaNewspaper className="text-gray-400 text-2xl" />
                            </div>
                            <h3 className="text-gray-900 font-medium">Không tìm thấy bài viết nào</h3>
                            <p className="text-gray-500 text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredPosts.length > 0 && (
                    <div className="flex justify-center gap-2 mt-6 mb-2">
                        <button 
                            disabled={currentPage === 1} 
                            onClick={() => setCurrentPage(1)} 
                            className="px-3 py-2 border rounded-lg disabled:text-gray-400 hover:bg-gray-50 transition-colors"
                        >
                            «
                        </button>
                        <button 
                            disabled={currentPage === 1} 
                            onClick={() => setCurrentPage(p => p - 1)} 
                            className="px-3 py-2 border rounded-lg disabled:text-gray-400 hover:bg-gray-50 transition-colors"
                        >
                            ‹
                        </button>

                        {pages().map((p, i) =>
                            p === "..." ? (
                                <span key={i} className="px-3 py-2">…</span>
                            ) : (
                                <button 
                                    key={i} 
                                    onClick={() => setCurrentPage(p)}
                                    className={`px-3 py-2 border rounded-lg transition-colors ${
                                        currentPage === p 
                                            ? "bg-indigo-500 text-white" 
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    {p}
                                </button>
                            )
                        )}

                        <button 
                            disabled={currentPage === totalPages} 
                            onClick={() => setCurrentPage(p => p + 1)} 
                            className="px-3 py-2 border rounded-lg disabled:text-gray-400 hover:bg-gray-50 transition-colors"
                        >
                            ›
                        </button>
                        <button 
                            disabled={currentPage === totalPages} 
                            onClick={() => setCurrentPage(totalPages)} 
                            className="px-3 py-2 border rounded-lg disabled:text-gray-400 hover:bg-gray-50 transition-colors"
                        >
                            »
                        </button>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <PostDetailModal
                post={selectedPost}
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetailModal}
            />
        </div>
    )
}

export default BlogManager