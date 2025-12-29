import React from 'react'
import FixedNavbar from '~/components/user/home/FixedNavbar'
import Header from '~/components/user/home/Header'
import Footer from '~/components/user/home/Footer'
import MainSection from '~/components/user/aboutUs/MainSection'
import { useCurrentUser } from '~/hooks/user/useUser'

const AboutUs = () => {
    const { isAuthenticated } = useCurrentUser()
    return (
        <div>
            <Header login={isAuthenticated} />
            <FixedNavbar login={isAuthenticated} />
            <MainSection />
            <Footer />
        </div>
    )
}

export default AboutUs
