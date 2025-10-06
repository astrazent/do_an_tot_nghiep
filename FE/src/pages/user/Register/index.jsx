//src/pages/User/Register.jsx
import React from 'react'
import AuthTheme from '~/components/user/auth/AuthTheme'
import RegisterForm from '~/components/user/auth/RegisterForm'
import background from '~/assets/image/user/auth/background.png'
import icon from '~/assets/icon/logo/brand-logo.png'
const register = () => {
    return (
        <AuthTheme mainBgImage={background} iconImage={icon}>
            <RegisterForm />
        </AuthTheme>
    )
}

export default register
