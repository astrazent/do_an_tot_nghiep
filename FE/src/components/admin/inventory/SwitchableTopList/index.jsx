import React, { useState, useRef, useEffect } from 'react'
import { FiUser, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const SwitchableTopList = ({ listsData }) => {
    const [activeListIndex, setActiveListIndex] = useState(0)

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const dropdownRef = useRef(null)

    const activeList = listsData[activeListIndex]

    const handleListChange = index => {
        setActiveListIndex(index)
        setIsDropdownOpen(false)
    }

    useEffect(() => {
        const handleClickOutside = event => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div
            className="bg-white rounded-lg shadow-lg p-6 w-full h-full mx-auto font-sans"
            ref={dropdownRef}
        >
            <div className="relative border-b border-gray-200 pb-4 mb-4">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex justify-between items-center text-left focus:outline-none"
                >
                    <h2 className="text-lg font-bold text-gray-800">
                        {activeList.title}
                    </h2>
                    {isDropdownOpen ? (
                        <FiChevronUp className="text-gray-500" />
                    ) : (
                        <FiChevronDown className="text-gray-500" />
                    )}
                </button>

                {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-md shadow-xl z-10 border border-gray-100">
                        {listsData.map((list, index) => (
                            <button
                                key={index}
                                onClick={() => handleListChange(index)}
                                className={`block w-full text-left px-4 py-2 text-sm ${activeListIndex === index ? 'font-semibold text-indigo-600' : 'text-gray-700'} hover:bg-gray-100`}
                            >
                                {list.title}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <ul className="space-y-4">
                <li className="flex items-center justify-between text-xs text-gray-400 uppercase font-semibold px-2">
                    <span>{activeList.columnHeaders.left}</span>
                    <span>{activeList.columnHeaders.right}</span>
                </li>

                {activeList.items.map(item => (
                    <li
                        key={item.id}
                        className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md"
                    >
                        <div className="flex items-center">
                            <span className="text-gray-400 mr-4">
                                {item.icon ? item.icon : <FiUser size={20} />}
                            </span>
                            <span className="text-gray-800">{item.name}</span>
                        </div>
                        <span className="font-bold text-gray-900">
                            {item.value}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SwitchableTopList
