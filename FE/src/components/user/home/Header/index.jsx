import React, { useState } from 'react'
import './header.scss'
import FloatingContactBar from '~/components/shared/FloatingContactBar'
import NavigationBar from '~/components/shared/NavigationBar'
import MainHeader from '~/components/shared/MainHeader'
import TopBar from '~/components/shared/TopBar'

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [cartCount, setCartCount] = useState(5)

    const handleLogout = () => {
        console.log('Đăng xuất...')
        setIsLoggedIn(false)
    }

    return (
        <header className="shadow">
            <TopBar />
            <MainHeader
                login={isLoggedIn}
                handleLogout={handleLogout}
                cartItemCount={cartCount}
            />
            <NavigationBar />

            <FloatingContactBar />
        </header>
    )
}

export default Header
