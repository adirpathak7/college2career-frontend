import React from 'react'
import SideBar from '../admin/SideBar'
import { Outlet } from 'react-router-dom'
import PageTitle from '../../PageTitle'

export default function AdminDashboard() {
    return (
        <>
            <PageTitle title="Admin Dashboard" />
            <div className="max-h-screen flex" style={{ height: '100vh' }}>
                {/* Sidebar */}
                <div className="w-64 bg-gray-800 text-white">
                    <SideBar />
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col bg-gray-50" style={{ height: '100vh' }}>
                    {/* Header */}
                    <div className="shadow-sm bg-white">
                    </div>

                    {/* Scrollable outlet content with hidden scrollbar */}
                    <div className="flex-1 overflow-y-scroll h-screen hide-scrollbar">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}
