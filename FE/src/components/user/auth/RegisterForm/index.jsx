import React, { useState } from 'react'
import Button from '~/components/shared/Button'
import InputField from '~/components/shared/InputField'
import './registerForm.scss'

import { HiOutlineUser, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi'
import { RiLockPasswordLine } from 'react-icons/ri'
import { AiOutlineEyeInvisible } from 'react-icons/ai'

const RegisterForm = () => {
    const [fullName, setFullName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div className="register-card">
            <h1 className="register-title">Tạo tài khoản</h1>

            <form className="register-form">
                <InputField
                    type="text"
                    placeholder="Họ và tên"
                    value={fullName}
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
                    rightIcon={<AiOutlineEyeInvisible />}
                    required
                />

                <Button type="submit" className="login-button">
                    Đăng ký
                </Button>
            </form>

            <p className="signup-link">
                Đã có tài khoản? <a href="#">Đăng nhập ngay</a>
            </p>
        </div>
    )
}

export default RegisterForm
