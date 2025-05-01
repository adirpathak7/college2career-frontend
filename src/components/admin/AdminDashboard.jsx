import React from 'react'
import SideBar from '../admin/SideBar'

import { Outlet } from 'react-router-dom'

export default function AdminDashboard() {
    return (
        <>
            <div className="flex">
                <SideBar />
                <div className="flex-1 p-6">
                    <Outlet />
                </div>
            </div>
        </>
    )
}
