import React from 'react'
import SideBar from '../SideBar'
import { Outlet } from 'react-router-dom'
import PageTitle from '../../PageTitle'

export default function Dashboard() {
    return (
        <div className="max-h-screen flex" style={{ height: '100vh' }}>
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white">
                <SideBar />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col bg-gray-50" style={{ height: '100vh' }}>
                {/* Header */}
                <div className="shadow-sm bg-white">
                    <PageTitle title="Dashboard" />
                </div>

                {/* Scrollable outlet content with hidden scrollbar */}
                <div className="flex-1 overflow-y-scroll h-screen hide-scrollbar">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
