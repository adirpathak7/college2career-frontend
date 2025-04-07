import React from 'react'
import { useNavigate } from 'react-router-dom'
import SideBar from '../SideBar'

export default function Dashboard() {
    const navigate = useNavigate()

    const handelLogout = () => {
        sessionStorage.removeItem("userToken")
        navigate("../login")
    }

    return (
        <div className="flex">
            <SideBar />

            <div className="ml-64 p-6 w-full">
                <h1 className="text-3xl font-semibold">Welcome to your Dashboard</h1>
                {/* Your dashboard content goes here */}
                <button onClick={handelLogout} className='bg-gray-900 rounded-sm text-white w-52 h-12 mt-16'>Logout</button>
            </div>
        </div>
    )
}
