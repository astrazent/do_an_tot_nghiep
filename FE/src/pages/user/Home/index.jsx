import React from 'react'
import FixedNavbar from '~/components/user/home/FixedNavbar'
import Banner from '~/components/user/home/Banner'
import Header from '~/components/user/home/Header'
import Footer from '~/components/user/home/Footer'
import ProductCollection from '~/components/user/home/ProductCollection'
import FeedbackCollection from '~/components/user/home/FeedbackCollection'
import LatestNews from '~/components/user/home/LatestNews'
import { useState } from 'react'
import './home.scss'
import LogoCarousel from '~/components/user/home/LogoCarousel'

const Home = () => {
    return (
        <div>
            <Header />
            <FixedNavbar />
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
