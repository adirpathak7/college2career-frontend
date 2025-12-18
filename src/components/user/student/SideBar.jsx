import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LuLayoutDashboard, LuListChecks, LuFileText, LuMic,
  LuBadgeCheck, LuMessageSquareText, LuUser
} from 'react-icons/lu';
import { BiLogOut } from 'react-icons/bi';
import C2CLogo from '../../../assets/C2CLogo.png'

const baseClass = "flex items-center space-x-4 py-3 px-4 rounded-md font-medium text-sm transition-colors duration-200 w-full";
const menuItems = [
  { label: "Inbox", path: "/user/student/dashboard/inbox", icon: <LuMessageSquareText /> },
  // { label: "Profile", path: "/user/dashboard/profile", icon: <LuUser /> },
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
      {/* Mobile Toggle Button */}
      <div className="text-white p-4 md:hidden flex justify-between items-center bg-gradient-to-r from-[#005acd] to-[#0066cc] shadow-md">
        <div className="flex items-center space-x-2">
          <img src={C2CLogo} alt="Logo" className="h-10 w-10 rounded-full shadow-lg" />
          <span className="text-xl font-bold tracking-wide text-white">College2Career</span>
        </div>
        <button onClick={toggleSidebar} className="text-3xl focus:outline-none text-white">
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed md:static z-50 top-0 left-0 h-full bg-gradient-to-b from-[#005acd] to-[#003b6d] text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out w-72 flex flex-col shadow-xl`}>

        {/* Logo and Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-[#6dd7fd] bg-[#004689] rounded-t-lg">
          <div className="flex items-center space-x-3">
            <img src={C2CLogo} alt="Logo" className="h-12 w-12 rounded-full shadow-xl" />
            <p className="text-2xl font-semibold text-white">College2Career</p>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-3xl text-white hover:text-[#ffcc00] transition-colors">
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 justify-center px-4 space-y-2 mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center px-4 py-2 rounded-lg text-lg font-semibold transition-colors duration-200 ${isActive(item.path)
                ? "bg-[#006b99] text-[#f5ffff] shadow-md"
                : "text-[#f5ffff] hover:bg-[#0093cb] hover:text-[#f5ffff] hover:shadow-xl"
                }`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info + Logout */}
        <div className="p-4 border-t border-[#6dd7fd] flex items-center justify-between bg-[#004689] rounded-b-lg">
          <div className="flex items-center space-x-2 text-xl">
            {/* <img src="https://res.cloudinary.com/druzdz5zn/image/upload/v1734700064/qoftuli2spstfjt2kosz.jpg" alt="avatar" className="h-10 w-10 rounded-full" /> */}
            <div>
              <p className="text-sm font-medium text-[#f5ffff]">Logout</p>
              <p className="text-xs text-[#bef0ff]"></p>
            </div>
          </div>
          <BiLogOut onClick={handleLogout} className="w-7 h-7 cursor-pointer hover:text-[#ffcc00] transition-colors" title='Logout' />
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden transition-opacity duration-300"
        ></div>
      )}
    </>

  );
}
