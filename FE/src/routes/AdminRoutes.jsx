import React from 'react'

import AdminDashboard from '../pages/admin/Dashboard'
import AdminLogin from '../pages/admin/Login'
import AdminProduct from '../pages/admin/Product'
import SidebarLayout from '~/layouts/admin/SidebarLayout'

// ProtectedRoute cho admin
function ProtectedAdmin({ children }) {
    // const tokenAdmin = Cookies.get('token_admin')
    // if (!tokenAdmin) return <Navigate to="/admin/login" replace />
    return children
}

export const adminRoutes = [
    {
        path: '/admin/login',
        element: <AdminLogin />,
    },
    {
        path: '/admin/',
        element: (
            <ProtectedAdmin>
                <SidebarLayout />
            </ProtectedAdmin>
        ),
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: 'product', element: <AdminProduct /> },
        ],
    },
]
