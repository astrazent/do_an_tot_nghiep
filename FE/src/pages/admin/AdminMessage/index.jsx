import React from 'react'
import Sidebar from '~/components/admin/message/Sidebar'
import ChatWindow from '~/components/admin/message/ChatWindow'
const AdminMessage = () => {
    return (
        <div className="flex h-screen font-sans bg-gray-100">
            <Sidebar />
            <ChatWindow />
        </div>
    )
}

export default AdminMessage
