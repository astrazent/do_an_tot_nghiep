import React from 'react'
import { FiMoreHorizontal } from 'react-icons/fi'

const agents = [
    { name: 'Octavia', sale: 32 },
    { name: 'Elvina', sale: 15 },
    { name: 'Marni', sale: 35 },
    { name: 'Lrvina', sale: 158 },
    { name: 'Jonathan', sale: 85 },
    { name: 'Marwar', sale: 45 },
]

const TopAgent = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Top Agent's</h3>
                <button className="text-gray-400 hover:text-gray-600">
                    <FiMoreHorizontal />
                </button>
            </div>
            <div>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Name</span>
                    <span>Sale</span>
                </div>
                <ul>
                    {agents.map((agent, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between py-2"
                        >
                            <div className="flex items-center">
                                <img
                                    src={`https://i.pravatar.cc/32?u=${agent.name}`}
                                    alt={agent.name}
                                    className="w-8 h-8 rounded-full mr-3"
                                />
                                <span className="text-gray-700">
                                    {agent.name}
                                </span>
                            </div>
                            <span className="font-semibold text-gray-800">
                                {agent.sale}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default TopAgent
