import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import './layout.scss'

function layout() {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h2>Admin Panel</h2>
                <nav>
                    <ul>
                        <li>
                            <NavLink to="/admin" end>
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/users">Users</NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/orders">Orders</NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/settings">Settings</NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>

            <div className="admin-content">
                <header className="admin-header">
                    <h1>Welcome, Admin</h1>
                </header>

                <main>
                    <Outlet />{' '}
                </main>
            </div>
        </div>
    )
}

export default layout
