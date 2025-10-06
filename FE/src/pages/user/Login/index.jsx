//src/pages/User/Login.jsx
import React from 'react'
import LoginForm from '~/components/user/auth/LoginForm'
import AuthTheme from '~/components/user/auth/AuthTheme'
import background from '~/assets/image/user/auth/background.png'
import icon from '~/assets/icon/logo/brand-logo.png'
const Login = () => {
    return (
        <AuthTheme mainBgImage={background} iconImage={icon}>
            <LoginForm />
        </AuthTheme>
    )
}

export default Login
