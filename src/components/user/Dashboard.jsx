import React from 'react'
import SideBar from '../SideBar'
import { Outlet } from 'react-router-dom'
import PageTitle from '../../PageTitle'


export default function Dashboard() {

    return (
        <>
            <PageTitle title="Dashboard" />
            <div className="flex">
                <SideBar />
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </>
    )
}
