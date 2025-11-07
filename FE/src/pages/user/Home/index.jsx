import React from 'react'
import FixedNavbar from '~/components/user/home/FixedNavbar'
import Banner from '~/components/user/home/Banner'
import Header from '~/components/user/home/Header'
import Footer from '~/components/user/home/Footer'
import ProductCollection from '~/components/user/home/ProductCollection'
import FeedbackCollection from '~/components/user/home/FeedbackCollection'
import LatestNews from '~/components/user/home/LatestNews'
import './home.scss'
import LogoCarousel from '~/components/user/home/LogoCarousel'
import { useCurrentUser } from '~/hooks/user/useUser'

const Home = () => {
    const { isAuthenticated } = useCurrentUser()
    return (
        <div>
            <Header login={isAuthenticated} />
            <FixedNavbar login={isAuthenticated} />
            <Banner />
            <ProductCollection />
            <FeedbackCollection />
            <LatestNews />
            <LogoCarousel />
            <Footer />
        </div>
    )
}

export default Home
