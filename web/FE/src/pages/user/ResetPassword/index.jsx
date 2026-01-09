import React from 'react'
import Reset from '~/components/user/auth/ResetPassword'
import AuthTheme from '~/components/user/auth/AuthTheme'
import background from '~/assets/image/user/auth/background.png'
import icon from '~/assets/icon/logo/brand-logo.png'
const ResetPassword = () => {
    return (
        <AuthTheme mainBgImage={background} iconImage={icon}>
            <Reset />
        </AuthTheme>
    )
}

export default ResetPassword