import React from 'react'
import Header from '~/components/admin/dashboard/Header'
import Sidebar from '~/components/admin/dashboard/Sidebar'
import Footer from '~/components/admin/dashboard/Footer'
import { Outlet } from 'react-router-dom'

const SidebarLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header nằm trên cùng, chiếm toàn bộ chiều ngang */}
            <Header />

            {/* Phần còn lại chia làm Sidebar + Content */}
            <div className="flex flex-1">
                {/* Sidebar bên trái */}
                <Sidebar />

                {/* Content chính */}
                <main className="flex-1 p-5 bg-gray-100">
                    <div className=" rounded-xl">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Footer nhỏ gọn */}
            <Footer />
        </div>
    )
}

export default SidebarLayout
