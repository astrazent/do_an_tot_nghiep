import React from 'react'
import Forgot from '~/components/user/auth/ForgotPassword'
import AuthTheme from '~/components/user/auth/AuthTheme'
import background from '~/assets/image/user/auth/background.png'
import icon from '~/assets/icon/logo/brand-logo.png'
const ForgotPassword = () => {
    return (
        <AuthTheme mainBgImage={background} iconImage={icon}>
            <Forgot />
        </AuthTheme>
    )
}

export default ForgotPassword