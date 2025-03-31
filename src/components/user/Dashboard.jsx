import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const navigate = useNavigate()

    const handelLogout = () => {
        sessionStorage.removeItem("userToken")
        navigate("../login")
    }

    return (
        <div className='justify-center text-center mt-32'>
            <h1 className='text-red-500'>User Dashboard</h1>

            <button onClick={handelLogout} className='bg-gray-900 rounded-sm text-white w-52 h-12 mt-16'>Logout</button>
        </div>
    )
}
