import { Navigate, Outlet } from 'react-router-dom'
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

function ProtectedRoute({ children }) {
    return children
}

//Layout cho user protected routes
function UserProtectedLayout() {
    return (
        <ProtectedRoute>
            <SidebarLayout sidebar={<UserSidebar />}>
                <Outlet />
            </SidebarLayout>
        </ProtectedRoute>
    )
}

//User routes
export const userRoutes = [
    { path: '/', element: <Home /> },

    {
        element: <MainLayout />,
        children: [
            { path: '/cart', element: <Cart /> },
            { path: '/test-alert', element: <TestAlert /> },
        ],
    },

    {
        element: <SidebarLayout />,

        children: [
            { path: '/products/:slug', element: <Product /> },
            { path: '/about', element: <About /> },
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
            />
        ),
        children: [{ path: '/news', element: <News /> }],
    },

    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },

    {
        path: '/user',
        element: <UserProtectedLayout />,
        children: [
            { path: 'profile', element: <Profile /> },
            { path: 'purchase', element: <Purchase /> },
        ],
    },
]
