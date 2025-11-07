import React, { useState } from 'react'
import Button from '~/components/shared/Button'
import InputField from '~/components/shared/InputField'
import { useLoginUser } from '~/hooks/user/useUser'
import { useAlert } from '~/contexts/AlertContext'
import { updateUser } from '~/Redux/reducers/userReducer'
import './loginForm.scss'

import { FcGoogle } from 'react-icons/fc'
import { FaApple } from 'react-icons/fa'
import { HiOutlineUser } from 'react-icons/hi'
import { RiLockPasswordLine } from 'react-icons/ri'
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
    const { showAlert } = useAlert()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)

    // ✅ Dùng TanStack Query mutation
    const { mutate: login, isPending } = useLoginUser({
        onSuccess: data => {
            dispatch(updateUser({ ...data.data }))
            showAlert(data.message, { type: 'success', duration: 2000 })
            navigate('/')
        },
        onError: error => {
            const message =
                error?.response?.data?.message || 'Đăng nhập thất bại'
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
            <div className="social-buttons">
                <Button icon={<FcGoogle size={22} />}>Google</Button>
                <Button icon={<FaApple size={22} />}>Apple</Button>
            </div>

            <div className="separator">
                <span className="separator-line"></span>
                <span className="separator-text">hoặc</span>
                <span className="separator-line"></span>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
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

                <a href="#" className="forgot-password">
                    Quên mật khẩu?
                </a>

                <Button
                    type="submit"
                    className="login-button"
                    disabled={isPending}
                >
                    {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
            </form>

            <p className="signup-link">
                Chưa có tài khoản? <a href="register">Đăng kí ngay</a>
            </p>
        </div>
    )
}

export default LoginForm
