import React from 'react'
import HeroSection from '../HeroSection'
import BrandStory from '../BrandStory'
import CoreValues from '../CoreValues'
import MissionSection from '../MissionSection'
import CTASection from '../CTASection'

const AboutUs = () => {
    return (
        <div className="bg-stone-50 font-sans text-stone-800 overflow-hidden">
            <HeroSection />
            <BrandStory />
            <CoreValues />
            <MissionSection />
            <CTASection />
        </div>
    )
}

export default AboutUs
