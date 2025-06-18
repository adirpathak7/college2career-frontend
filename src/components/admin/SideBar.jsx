import React, { useState } from 'react'
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { BiLogOut, BiMessage } from 'react-icons/bi'
import { ImProfile } from 'react-icons/im'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BsCardList } from 'react-icons/bs'
import { MdDashboard } from 'react-icons/md'
import { RiPagesLine } from "react-icons/ri";
import C2CLogo from '../../assets/C2CLogo.png'

export default function SideBar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handelLogout = () => {
        navigate("../login")
    }

    const navLinks = [
        { to: "/admin/dashboard", label: "Dashboard", icon: <MdDashboard /> },
        { to: "/admin/dashboard/companies", label: "Companies", icon: <BsCardList /> },
        { to: "/admin/dashboard/students", label: "Students", icon: <RiPagesLine /> },
        { to: "/admin/dashboard/", label: "Messages", icon: <BiMessage /> },
        { to: "/admin/dashboard/profile", label: "Profile", icon: <ImProfile /> }
    ];

    const isActive = (path) => location.pathname === path;

    const baseClass = "flex justify-start items-center space-x-6 mt-3 mb-2 font-semibold rounded px-3 py-3 w-full md:w-52 transition-all duration-150";
    const activeClass = "bg-[#0093cb] text-[#f5ffff]";
    const inactiveClass = "text-[#f5ffff] hover:bg-[#bef0ff] hover:text-[#005acd]";

    return (
        <div id="mainSideBar" className="xl:rounded-r h-screen w-full sm:w-64 bg-[#005acd] shadow-lg flex flex-col justify-start">
            {/* Logo section */}
            <div className="flex justify-start p-6 items-center space-x-3 border-b border-[#6dd7fd]">
                <img src={C2CLogo}
                    alt="College2Career-Logo"
                    className="h-11 w-11 object-cover rounded-full shadow-md"
                />
                <p className="text-2xl font-bold text-[#f5ffff]">College2Career</p>
            </div>

            {/* Nav Links */}
            <div className="flex flex-col justify-start items-center px-6 border-b border-[#6dd7fd] w-full">
                <div className="flex flex-col w-full pb-1 mt-8">
                    {navLinks.map((link, idx) => (
                        <Link
                            key={idx}
                            to={link.to}
                            className={`${baseClass} ${isActive(link.to) ? activeClass : inactiveClass}`}
                        >
                            {link.icon}
                            <p className="text-base">{link.label}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col justify-between items-center h-full pb-6 px-6 w-full mt-auto">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-2">
                        <img className="rounded-full h-12 mt-2" src="https://res.cloudinary.com/druzdz5zn/image/upload/v1734700064/qoftuli2spstfjt2kosz.jpg" alt="avatar" />
                        <div className="flex flex-col items-start">
                            <p className="text-sm text-[#f5ffff] font-semibold">Aaditya Pathak</p>
                            <p className="text-xs text-[#bef0ff]">adityarpathak7@gmail.com</p>
                        </div>
                    </div>
                    <button onClick={handelLogout}>
                        <BiLogOut className='text-red-300 cursor-pointer w-8 h-6 hover:text-red-500' />
                    </button>
                </div>
            </div>
        </div>
    )
}
