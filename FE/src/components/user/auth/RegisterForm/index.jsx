import React, { useState } from 'react'
import Button from '~/components/shared/Button'
import InputField from '~/components/shared/InputField'
import { RegisterUser } from '~/Service/userService'
import { useAlert } from '~/contexts/AlertContext'
import './registerForm.scss'

//Import icons
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi'
import { RiLockPasswordLine } from 'react-icons/ri'
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'

const RegisterForm = () => {
    const { showAlert } = useAlert()
    const [full_name, setFullName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPw, setShowPw] = useState(false)

    const handleRegister = async e => {
        e.preventDefault()
        try {
            setLoading(true)
            const data = await RegisterUser({ username, email, phone, password, full_name })
            showAlert(data.message, { type: 'success', duration: 2000 })
            // window.location.href = '/'
        } catch (error) {
            const message = error?.response?.data?.message
            showAlert(message, { type: 'error', duration: 2000 })
        } finally {
            setLoading(false)
        }
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
                    type="password"
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

                <Button type="submit" className="login-button" disabled={loading}> 
                    {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
            </form>

            <p className="signup-link">
                Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
            </p>
        </div>
    )
}

export default RegisterForm
