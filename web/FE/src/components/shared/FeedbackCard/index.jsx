import React from 'react'

const FeedbackCard = ({ avatar, name, location, feedback }) => {
    return (
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md h-full">
            <div className="w-24 h-24 mb-4">
                <img
                    src={avatar}
                    alt={`Avatar của ${name}`}
                    className="w-full h-full rounded-full object-cover border-4 border-green-200"
                />
            </div>

            <h3 className="text-xl font-bold text-gray-800">{name}</h3>
            <p className="text-sm text-gray-500 mb-4">{location}</p>

            <p className="text-gray-600 italic leading-relaxed">
                &quot;{feedback}&quot;
            </p>
        </div>
    )
}

export default FeedbackCard
