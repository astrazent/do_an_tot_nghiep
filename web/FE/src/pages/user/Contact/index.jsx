import React from 'react'
import FixedNavbar from '~/components/user/home/FixedNavbar'
import Header from '~/components/user/home/Header'
import Footer from '~/components/user/home/Footer'
import MainContact from '~/components/user/Contact'
import { useCurrentUser } from '~/hooks/user/useUser'

const Contact = () => {
    const { isAuthenticated } = useCurrentUser()
    return (
        <div>
            <Header login={isAuthenticated} />
            <FixedNavbar login={isAuthenticated} />
            <MainContact />
            <Footer />
        </div>
    )
}

export default Contact
