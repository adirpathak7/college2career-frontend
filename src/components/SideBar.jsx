import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LuLayoutDashboard, LuListChecks, LuFileText, LuMic,
    LuBadgeCheck, LuMessageSquareText, LuUser
} from 'react-icons/lu';
import { BiLogOut } from 'react-icons/bi';
import C2CLogo from '../assets/C2CLogo.png';

const baseClass = "flex items-center space-x-4 py-3 px-4 rounded-md font-medium text-sm transition-colors duration-200 w-full";
const menuItems = [
    { label: "Dashboard", path: "/user/dashboard", icon: <LuLayoutDashboard /> },
    { label: "Vacancy", path: "/user/dashboard/vacancies", icon: <LuListChecks /> },
    { label: "Applications", path: "/user/dashboard/applications", icon: <LuFileText /> },
    { label: "Interviews", path: "/user/dashboard/interviews", icon: <LuMic /> },
    { label: "Offers", path: "/user/dashboard/offers", icon: <LuBadgeCheck /> },
    // { label: "Messages", path: "/user/dashboard/messages", icon: <LuMessageSquareText /> },
    { label: "Profile", path: "/user/dashboard/profile", icon: <LuUser /> },
];

export default function SideBar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        document.cookie = `userToken=; path=/; max-age=0`;
        navigate("/login");
    };

    useEffect(() => {
        if (location.pathname === "/user/dashboard/") {
            navigate("/user/dashboard");
        }
    }, [location.pathname, navigate]);

    return (
        <>
            {/* Mobile toggle button */}
            <div className="text-white p-4 md:hidden flex justify-between items-center bg-[#005acd]">
                <div className="flex items-center space-x-2">
                    <img src={C2CLogo} alt="Logo" className="h-10 w-10 rounded-full" />
                    <span className="text-lg font-semibold text-white">College2Career</span>
                </div>
                <button onClick={toggleSidebar} className="text-xl focus:outline-none text-white">
                    ☰
                </button>
            </div>

            {/* Sidebar */}
            <div className={`fixed md:static z-50 top-0 left-0 h-full bg-[#005acd] text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out w-64 flex flex-col`}>
                {/* Logo and close button */}
                <div className="flex items-center justify-between p-6 border-b border-[#6dd7fd]">
                    <div className="flex items-center space-x-3">
                        <img src={C2CLogo} alt="Logo" className="h-11 w-11 rounded-full" />
                        <p className="text-2xl font-semibold text-white">College2Career</p>
                    </div>
                    <button onClick={toggleSidebar} className="md:hidden text-xl text-white">
                        ✕
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 justify-center px-4 space-y-2 mt-8">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`${baseClass} ${isActive(item.path)
                                ? "bg-[#0093cb] text-[#f5ffff]"
                                : "text-[#f5ffff] hover:bg-[#bef0ff] hover:text-[#005acd]"
                                }`}
                            onClick={() => setIsOpen(false)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Info + Logout */}
                <div className="p-4 border-t border-[#6dd7fd] flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xl">
                        {/* <img
                            src="https://res.cloudinary.com/druzdz5zn/image/upload/v1734700064/qoftuli2spstfjt2kosz.jpg"
                            alt="avatar"
                            className="h-10 w-10 rounded-full"
                        /> */}
                        <div>
                            <p className="text-sm font-medium text-[#f5ffff]">Logout</p>
                            <p className="text-xs text-[#bef0ff]"></p>
                        </div>
                    </div>
                    <BiLogOut onClick={handleLogout} className="w-6 h-6 cursor-pointer text-red-300 hover:text-red-500" />
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                ></div>
            )}
        </>
    );
}
