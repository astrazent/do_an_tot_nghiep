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
import AdminBlogTypeManagement from '~/pages/admin/AdminBlogTypeManagement'
import AdminCategoryManagement from '~/pages/admin/AdminCategoryManagement'
import PostMarketingAI from '~/pages/admin/PostMarketingAI'
import EmailAI from '~/pages/admin/EmailMarketingAI'
import AdminLayout from '~/layouts/admin/AdminLayout'
import DiscountManagement from '~/pages/admin/DiscountManagement'

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
        element: <AdminLayout />,
        children: [
            {
                element: <SidebarLayout />,
                children: [
                    { index: true, element: <AdminDashboard /> },
                    {
                        path: 'revenue/analysis',
                        element: <AdminRevenueAnalysis />,
                    },
                    {
                        path: 'revenue/sources',
                        element: <AdminRevenueSources />,
                    },
                    {
                        path: 'customers/analysis',
                        element: <AdminCustomersAnalysis />,
                    },
                    {
                        path: 'customers/management',
                        element: <AdminCustomersManagement />,
                    },
                    {
                        path: 'inventory/analysis',
                        element: <AdminProductAnalysis />,
                    },
                    {
                        path: 'inventory/management',
                        element: <AdminProductManagement />,
                    },
                    { path: 'category', element: <AdminCategoryManagement /> },
                    { path: 'orders', element: <AdminOrder /> },
                    { path: 'promotions', element: <AdminPromotion /> },
                    { path: 'banner', element: <AdminBanner /> },
                    {
                        path: 'blog/management',
                        element: <AdminBlogManagement />,
                    },
                    {
                        path: 'blog/create-new',
                        element: <AdminBlogCreateNew />,
                    },
                    { path: 'discount', element: <DiscountManagement /> },
                    { path: 'blog/type', element: <AdminBlogTypeManagement /> },
                    {
                        path: 'ai_marketing/content',
                        element: <PostMarketingAI />,
                    },
                    { path: 'ai_marketing/email', element: <EmailAI /> },
                ],
            },
        ],
    },
]
