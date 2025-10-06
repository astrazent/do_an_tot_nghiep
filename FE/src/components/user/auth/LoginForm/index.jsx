import React, { useState } from 'react'
import Button from '~/components/shared/Button'
import InputField from '~/components/shared/InputField'
import './loginForm.scss'

//Import icons
import { FcGoogle } from 'react-icons/fc'
import { FaApple } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'
import { RiLockPasswordLine } from 'react-icons/ri'
import { AiOutlineEyeInvisible } from 'react-icons/ai'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

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

            <form className="login-form">
                <InputField
                    type="email"
                    placeholder="Địa chỉ email"
                    value={email}
                    onChange={e => setEmail(e.targe.value)}
                    icon={<HiOutlineMail />}
                    required
                />
                <InputField
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    icon={<RiLockPasswordLine />}
                    rightIcon={<AiOutlineEyeInvisible />}
                    required
                />

                <a href="#" className="forgot-password">
                    Quên mật khẩu?
                </a>

                <Button type="submit" className="login-button">
                    Đăng nhập
                </Button>
            </form>

            <p className="signup-link">
                Chưa có tài khoản? <a href="#">Đăng kí ngay</a>
            </p>
        </div>
    )
}

export default LoginForm
