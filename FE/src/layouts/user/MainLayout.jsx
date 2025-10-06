import React from 'react'
import Header from '~/components/user/home/Header'
import Footer from '~/components/user/home/Footer'
import { Outlet } from 'react-router-dom'
import FixedNavbar from '~/components/user/home/FixedNavbar'

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <FixedNavbar />

            <div className="flex-1 py-6 px-[200px]">
                <div className="container mx-auto">
                    <main className="bg-white rounded-lg shadow-md p-6">
                        <Outlet />
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default MainLayout
