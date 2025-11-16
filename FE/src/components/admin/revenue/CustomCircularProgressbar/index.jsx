import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const CustomCircularProgressbar = ({
    percentage,
    title,
    gradientFrom,
    gradientTo,
    gradientId,
}) => {
    return (
        <div className="w-52 h-full relative">
            <svg style={{ height: 0, width: 0 }}>
                <defs>
                    <linearGradient
                        id={gradientId}
                        gradientTransform="rotate(90)"
                    >
                        <stop offset="0%" stopColor={gradientFrom} />
                        <stop offset="100%" stopColor={gradientTo} />
                    </linearGradient>
                </defs>
            </svg>

            <CircularProgressbar
                value={percentage}
                strokeWidth={6}
                styles={buildStyles({
                    strokeLinecap: 'round',
                    pathTransitionDuration: 0.8,
                    pathColor: `url(#${gradientId})`,
                    trailColor: '#f3f4f6',
                })}
            />

            <div
                className="absolute top-1/2 left-1/2 w-[92%] h-[92%]  
                        bg-slate-800 rounded-full 
                        transform -translate-x-1/2 -translate-y-1/2 
                        flex flex-col justify-center items-center text-center shadow-lg"
            >
                <span className="text-sm font-medium text-gray-300">
                    {title}
                </span>
                <span className="text-3xl font-bold text-white mt-1">
                    {percentage}%
                </span>
            </div>
        </div>
    )
}

export default CustomCircularProgressbar
