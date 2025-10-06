import React from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Admin from '../pages/admin/Layout'
import AdminDashboard from '../pages/admin/Dashboard'

//ProtectedRoute cho admin
function ProtectedAdmin({ children }) {
    const tokenAdmin = Cookies.get('token')
    if (!tokenAdmin) return <Navigate to="/admin/login" />
    return children
}

export const adminRoutes = [
    {
        path: '/admin/*',
        element: (
            <ProtectedAdmin>
                <Admin />
            </ProtectedAdmin>
        ),
        children: [{ index: true, element: <AdminDashboard /> }],
    },
]
