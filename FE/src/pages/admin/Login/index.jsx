import React from 'react'
import LoginForm from '~/components/user/auth/LoginForm'
import AuthTheme from '~/components/user/auth/AuthTheme'
import background from '~/assets/image/admin/auth/background_admin.jpg'
import icon from '~/assets/icon/logo/brand-logo.png'
const Login = () => {
    return (
        <AuthTheme mainBgImage={background} iconImage={icon}>
            <LoginForm isAdmin={true}/>
        </AuthTheme>
    )
}

export default Login
