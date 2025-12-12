import React from 'react'
import './button.scss'
const Button = ({ children, onClick, type = 'button', className, icon }) => {
    return (
        <button
            type={type}
            className={`btn ${className || ''}`}
            onClick={onClick}
        >
            {icon && <span className="btn-icon">{icon}</span>}
            {children}
        </button>
    )
}

export default Button
