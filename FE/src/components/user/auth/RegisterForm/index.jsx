import React, { useState } from 'react'
import Button from '~/components/shared/Button'
import InputField from '~/components/shared/InputField'
import { useRegisterUser } from '~/hooks/user/useUser'
import { useAlert } from '~/contexts/AlertContext'
import './registerForm.scss'
import { useNavigate } from 'react-router-dom'

import { HiOutlineUser, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi'
import { RiLockPasswordLine } from 'react-icons/ri'
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'

const RegisterForm = () => {
    const { showAlert } = useAlert()
    const navigate = useNavigate()

    const [full_name, setFullName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)

    // ✅ Dùng TanStack Query mutation
    const { mutate: register, isPending } = useRegisterUser({
        onSuccess: data => {
            showAlert(data.message, { type: 'success', duration: 2000 })
            navigate('/login')
        },
        onError: error => {
            const message = error?.response?.data?.message || 'Đăng ký thất bại'
            showAlert(message, { type: 'error', duration: 2000 })
        },
    })

    const handleRegister = e => {
        e.preventDefault()
        register({ username, email, phone, password, full_name })
    }

    return (
        <div className="register-card">
            <h1 className="register-title">Tạo tài khoản</h1>

            <form className="register-form" onSubmit={handleRegister}>
                <InputField
                    type="text"
                    placeholder="Họ và tên"
                    value={full_name}
                    onChange={e => setFullName(e.target.value)}
                    icon={<HiOutlineUser />}
                    required
                />
                <InputField
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    icon={<HiOutlineUser />}
                    required
                />
                <InputField
                    type="email"
                    placeholder="Địa chỉ email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    icon={<HiOutlineMail />}
                    required
                />
                <InputField
                    type="tel"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    icon={<HiOutlinePhone />}
                    required
                />
                <InputField
                    type={showPw ? 'text' : 'password'}
                    placeholder="Mật khẩu"
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

                <Button
                    type="submit"
                    className="login-button"
                    disabled={isPending}
                >
                    {isPending ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
            </form>

            <p className="signup-link">
                Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
            </p>
        </div>
    )
}

export default RegisterForm
