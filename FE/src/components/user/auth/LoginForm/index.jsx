import React, { useState } from 'react'
import Button from '~/components/shared/Button'
import InputField from '~/components/shared/InputField'

import { useLoginUser, useLoginGoogle } from '~/hooks/user/useUser'
import { GoogleLogin } from '@react-oauth/google'
import { useAlert } from '~/contexts/AlertContext'
import { updateUser } from '~/Redux/reducers/userReducer'
import './loginForm.scss'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineUser } from 'react-icons/hi'
import { RiLockPasswordLine } from 'react-icons/ri'
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { persistor } from '~/Redux/store'

const LoginForm = () => {
    const { showAlert } = useAlert()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)

    const { mutate: login, isPending } = useLoginUser({
        onSuccess: async data => {
            dispatch({ type: 'auth/logout' })
            await persistor.purge()
            dispatch(updateUser({ ...data.data }))
            showAlert(data.message, { type: 'success', duration: 2000 })
            navigate('/')
        },
        onError: error => {
            console.log(error)
            const message =
                error?.response?.data?.message || 'Đăng nhập thất bại'
            showAlert(message, { type: 'error', duration: 2000 })
        },
    })

    const { mutate: loginGoogle, isPending: isGooglePending } = useLoginGoogle({
        onSuccess: data => {
            dispatch(updateUser({ ...data.data }))
            showAlert(data.message, { type: 'success', duration: 2000 })
            navigate('/')
        },
        onError: error => {
            const message =
                error?.response?.data?.message || 'Đăng nhập Google thất bại'
            showAlert(message, { type: 'error', duration: 2000 })
        },
    })

    const handleLogin = e => {
        e.preventDefault()
        login({ username, password })
    }

    return (
        <div className="login-card">
            <h1 className="login-title">Đăng nhập với</h1>
            <div className="social-buttons flex justify-center items-center">
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        const tokenId = credentialResponse.credential
                        loginGoogle({ tokenId })
                    }}
                    onError={() => {
                        showAlert('Đăng nhập Google thất bại', {
                            type: 'error',
                            duration: 2000,
                        })
                    }}
                    width={240}
                    shape="rectangular"
                />
            </div>

            <div className="separator">
                <span className="separator-line"></span>
                <span className="separator-text">hoặc</span>
                <span className="separator-line"></span>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
                {}
                <InputField
                    type="text"
                    placeholder="Tên đăng nhập"
                    autoComplete="off"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    icon={<HiOutlineUser />}
                    required
                />
                <InputField
                    type={showPw ? 'text' : 'password'}
                    placeholder="Mật khẩu"
                    autoComplete="off"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    icon={<RiLockPasswordLine />}
                    rightIcon={
                        showPw ? (
                            <AiOutlineEye onClick={() => setShowPw(false)} />
                        ) : (
                            <AiOutlineEyeInvisible
                                onClick={() => setShowPw(true)}
                            />
                        )
                    }
                    required
                />

                <p className="forgot-password">
                    <Link
                        to="/forgot-password"
                        className="text-green-600 hover:underline"
                    >
                        Quên mật khẩu?
                    </Link>
                </p>

                <Button
                    type="submit"
                    className="login-button"
                    disabled={isPending || isGooglePending}
                >
                    {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
            </form>

            <p className="signup-link">
                Chưa có tài khoản? <Link to="/register">Đăng kí ngay</Link>
            </p>
        </div>
    )
}

export default LoginForm
