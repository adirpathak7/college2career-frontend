import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BiLogOut, BiMessage } from 'react-icons/bi'
import { ImProfile } from 'react-icons/im'
import { BsCardList } from 'react-icons/bs'
import { MdDashboard } from 'react-icons/md'
import { HiOutlineMenuAlt3 } from "react-icons/hi";


export default function SideBar() {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigate = useNavigate()

    // const getCookie = (name) => {
    //     const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    //     if (match) return match[2];
    //     return null;
    // }

    // const token = getCookie("userToken");
    // console.log("Token from cookie:", token);

    const handelLogout = () => {
        // document.cookie = `userToken=; path=/; max-age=0`
        // sessionStorage.removeItem("userToken")
        navigate("../login")
    }
    return (
        <>
            <>
                {/* Mobile Toggle Button */}
                <div className="sm:hidden fixed top-4 left-4 z-50">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-white bg-gray-800 p-2 rounded-md focus:outline-none"
                    >
                        <HiOutlineMenuAlt3 size={24} />
                    </button>
                </div>

                {/* Sidebar */}
                <div
                    id="mainSideBar"
                    className={`
                    fixed top-0 left-0 h-screen w-64 bg-gray-900 z-40 flex flex-col transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                    sm:translate-x-0 sm:relative sm:flex sm:w-64
                `}
                >
                    {/* Logo Section */}
                    <div className="flex items-center p-6 space-x-3 border-b border-gray-600">
                        <svg width="34" height="34" fill="none" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
                            <path d="..." fill="white" />
                        </svg>
                        <p className="text-2xl font-semibold text-white">College2Career</p>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col px-6 py-4 space-y-2">
                        <SidebarLink to="/admin/dashboard" icon={<MdDashboard />} label="Dashboard" />
                        <SidebarLink to="/admin/dashboard/companies" icon={<BsCardList />} label="Companies" />
                        <SidebarLink to="/admin/dashboard/students" icon={<BsCardList />} label="Students" />
                        <SidebarLink to="/admin/dashboard/" icon={<BiMessage />} label="Messages" />
                        <SidebarLink to="/admin/dashboard/profile" icon={<ImProfile />} label="Profile" />
                        <button
                            onClick={handelLogout}
                            className="flex items-center space-x-4 px-3 py-3 rounded text-gray-400 hover:bg-gray-700 hover:text-white transition"
                        >
                            <BiLogOut />
                            <span className="text-base">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Overlay on Mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-50 z-30 sm:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </>
        </>
    )
}

function SidebarLink({ to, icon, label }) {
    return (
        <Link
            to={to}
            className="flex items-center space-x-4 px-3 py-3 rounded text-gray-400 hover:bg-gray-700 hover:text-white transition"
        >
            {icon}
            <span className="text-base">{label}</span>
        </Link>
    );
}