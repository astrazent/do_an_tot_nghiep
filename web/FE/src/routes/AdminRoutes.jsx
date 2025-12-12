import React from 'react'
import AdminDashboard from '../pages/admin/Dashboard'
import AdminLogin from '../pages/admin/Login'
import AdminProductAnalysis from '../pages/admin/ProductAnalysis'
import AdminProductManagement from '~/pages/admin/ProductManagement'
import SidebarLayout from '~/layouts/admin/SidebarLayout'
import AdminRevenueAnalysis from '~/pages/admin/RevenueAnalysis'
import AdminRevenueSources from '~/pages/admin/RevenueSource'
import AdminCustomersAnalysis from '~/pages/admin/AdminCustomersAnalysis'
import AdminCustomersManagement from '~/pages/admin/AdminCustomersManagement'
import AdminOrder from '~/pages/admin/AdminOrder'
import AdminPromotion from '~/pages/admin/AdminPromotion'
import AdminBanner from '~/pages/admin/AdminBanner'
import AdminBlogManagement from '~/pages/admin/AdminBlogManagement'
import AdminBlogCreateNew from '~/pages/admin/AdminBlogCreateNew'
import AdminMessage from '~/pages/admin/AdminMessage'

function ProtectedAdmin({ children }) {
    return children
}

export const adminRoutes = [
    {
        path: '/admin/login',
        element: <AdminLogin />,
    },
    {
        path: '/admin',
        element: (
            <ProtectedAdmin>
                <SidebarLayout />
            </ProtectedAdmin>
        ),
        children: [
            { index: true, element: <AdminDashboard /> },

            { path: 'revenue/analysis', element: <AdminRevenueAnalysis /> },
            { path: 'revenue/sources', element: <AdminRevenueSources /> },
            { path: 'customers/analysis', element: <AdminCustomersAnalysis /> },
            {
                path: 'customers/management',
                element: <AdminCustomersManagement />,
            },
            { path: 'inventory/analysis', element: <AdminProductAnalysis /> },
            {
                path: 'inventory/management',
                element: <AdminProductManagement />,
            },
            { path: 'orders', element: <AdminOrder /> },
            { path: 'promotions', element: <AdminPromotion /> },
            { path: 'banner', element: <AdminBanner /> },
            { path: 'blog/management', element: <AdminBlogManagement /> },
            { path: 'blog/create-new', element: <AdminBlogCreateNew /> },
            { path: 'messages', element: <AdminMessage /> },
        ],
    },
]
