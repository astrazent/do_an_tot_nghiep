import React from 'react'
import './dashboard.scss'

function dashboard() {
    return (
        <div className="dashboard">
            <h1>Admin Dashboard</h1>
            <p>Welcome to the admin panel!</p>

            <div className="dashboard-cards">
                <div className="card">
                    <h2>Users</h2>
                    <p>120</p>
                </div>
                <div className="card">
                    <h2>Orders</h2>
                    <p>58</p>
                </div>
                <div className="card">
                    <h2>Revenue</h2>
                    <p>$12,340</p>
                </div>
            </div>
        </div>
    )
}

export default dashboard
