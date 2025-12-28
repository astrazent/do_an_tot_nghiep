import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Home from '~/pages/user/Home'
import About from '~/pages/user/About'
import Login from '~/pages/user/Login'
import Register from '~/pages/user/Register'
import Profile from '~/pages/user/Profile'
import Cart from '~/pages/user/Cart'
import Product from '~/pages/user/Product'
import Purchase from '~/pages/user/Purchase'
import MainLayout from '~/layouts/user/MainLayout'
import SidebarLayout from '~/layouts/user/SidebarLayout'
import UserSidebar from '~/components/user/profile/UserSidebar'
import News from '~/pages/user/News'
import RightSidebar from '~/components/user/news/RightSidebar'
import TestAlert from '~/pages/user/TestAlert'
import NewsDetail from '~/pages/user/NewsDetail'
import Category from '~/pages/user/Category'
import Promotion from '~/pages/user/Promotion'
import SearchPage from '~/pages/user/SearchPage'
import { useCurrentUser } from '~/hooks/user/useUser'
import ReturnPageVNPay from '~/components/user/payment/ReturnPageVNPay'
import UserLayout from '~/layouts/user/UserLayout'
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useCurrentUser()
    const location = useLocation()

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

function UserProtectedLayout() {
    return (
        <ProtectedRoute>
            <SidebarLayout sidebar={<UserSidebar />}>
                <Outlet />
            </SidebarLayout>
        </ProtectedRoute>
    )
}

export const userRoutes = [
    {
        element: <UserLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },

            {
                element: <MainLayout />,
                children: [
                    { path: '/cart', element: <Cart /> },
                    { path: '/test-alert', element: <TestAlert /> },
                    { path: '/vnpay/return', element: <ReturnPageVNPay /> },
                ],
            },

            {
                element: (
                    <SidebarLayout
                        leftHidePriority={['hot', 'featured', 'categories', 'search']}
                    />
                ),
                children: [
                    { path: '/sale', element: <Promotion /> },
                    { path: '/category/:slug', element: <Category /> },
                    { path: '/about', element: <About /> },
                    { path: '/search', element: <SearchPage /> },
                    { path: '/product/:slug', element: <Product /> },
                ],
            },

            {
                element: (
                    <SidebarLayout
                        sidebarRight={<RightSidebar />}
                        initialSectionsStateLeft={{
                            search: false,
                            categories: true,
                            featured: true,
                            hot: true,
                        }}
                        initialSectionsStateRight={{
                            featuredPosts: true,
                            consumerTips: true,
                        }}
                        paddingX={50}
                    />
                ),
                children: [
                    { path: '/news', element: <News /> },
                    { path: '/news-detail/:slug', element: <NewsDetail /> },
                ],
            },

            {
                path: '/user',
                element: <UserProtectedLayout />,
                children: [
                    { path: 'profile', element: <Profile /> },
                    { path: 'purchase', element: <Purchase /> },
                ],
            },
        ],
    },
]