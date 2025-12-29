import React from 'react'
import HeroSection from '~/components/user/recruitment/HeroSection'
import ProductList from '~/components/user/recruitment/ProductList'
import BenefitsSection from '~/components/user/recruitment/BenefitSection'
import RequirementsSection from '~/components/user/recruitment/RequirementsSection'
import RegistrationForm from '~/components/user/recruitment/RegistrationForm'

const MainSection = () => {
    return (
        <div className="font-sans text-gray-800 bg-gray-50">
            <HeroSection />
            <ProductList />
            <BenefitsSection />
            <RequirementsSection />
            <RegistrationForm />
        </div>
    )
}

export default MainSection
