import React, { useState } from 'react'
import Header from '~/components/admin/dashboard/Header'
import Sidebar from '~/components/admin/dashboard/Sidebar'
import Footer from '~/components/admin/dashboard/Footer'
import { Outlet } from 'react-router-dom'

const SidebarLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col">
            <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex flex-1">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                <main className="flex-1 p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 lg:ml-72">
                    <div className="rounded-xl">
                        <Outlet />
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    )
}

export default SidebarLayout
