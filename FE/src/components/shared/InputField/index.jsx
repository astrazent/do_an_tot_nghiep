import React from 'react'
import './inputField.scss'
const InputField = ({
    type,
    placeholder,
    value,
    onChange,
    icon,
    rightIcon,
    name,
    required,
}) => {
    return (
        <div className="input-group">
            {icon && <div className="input-icon">{icon}</div>}

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
                required={required}
                className={icon ? 'has-icon' : ''}
                autoComplete="current-password"
            />

            {rightIcon && <div className="input-icon-right">{rightIcon}</div>}
        </div>
    )
}

export default InputField
