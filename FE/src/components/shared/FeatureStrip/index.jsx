import React from 'react'
import { FaShippingFast } from 'react-icons/fa'
import { MdOutlineMarkEmailRead } from 'react-icons/md'
import { BiTimeFive } from 'react-icons/bi'
import './featureStrip.scss'

const FeatureStrip = ({ width = '100%', bordered = true }) => {
    return (
        <div
            className={`feature-strip-container ${bordered ? 'bordered' : ''}`}
            style={{ width }}
        >
            <div className="feature-item">
                <FaShippingFast className="feature-icon truck-icon" />
                <div className="feature-text">
                    <h4>Miễn phí vận chuyển</h4>
                    <p>Bán kính 5 km khi mua từ 5kg</p>
                </div>
            </div>

            <div className="feature-item">
                <MdOutlineMarkEmailRead className="feature-icon email-icon" />
                <div className="feature-text">
                    <h4>Hỗ trợ 24/7</h4>
                    <p>Hotline: 0868839655 | 0963538357</p>
                </div>
            </div>

            <div className="feature-item">
                <BiTimeFive className="feature-icon clock-icon" />
                <div className="feature-text">
                    <h4>Giờ làm việc</h4>
                    <p>T2 - T7 Giờ hành chính</p>
                </div>
            </div>
        </div>
    )
}

export default FeatureStrip
