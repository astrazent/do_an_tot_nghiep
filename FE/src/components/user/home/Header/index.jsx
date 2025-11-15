import React, { useState } from 'react'
import './header.scss'
import FloatingContactBar from '~/components/shared/FloatingContactBar'
import NavigationBar from '~/components/shared/NavigationBar'
import MainHeader from '~/components/shared/MainHeader'
import TopBar from '~/components/shared/TopBar'

const Header = () => {
    return (
        <header className="shadow">
            <TopBar />
            <MainHeader />
            <NavigationBar />
            <FloatingContactBar />
        </header>
    )
}

export default Header
