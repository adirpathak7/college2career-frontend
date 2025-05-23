import React from 'react'
import SideBar from '../admin/SideBar'
import { Outlet } from 'react-router-dom'
import PageTitle from '../../PageTitle'

export default function AdminDashboard() {
    return (
        <>
            <PageTitle title="Admin Dashboard" />
            <div className="flex">
                <SideBar />
                <div className="p-4 h-full">
                    <Outlet />
                </div>
            </div>
        </>
    )
}
