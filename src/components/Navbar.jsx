import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import C2CLogo from '../assets/C2CLogo.png'
const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#005acd] via-[#0093cb] to-[#6dd7fd] text-white shadow-md z-50 backdrop-blur-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <img
                        src={C2CLogo}
                        alt="C2C Logo"
                        className="h-12 w-12 object-cover rounded-full shadow-md"
                    />
                    {/* Optional: Text next to logo */}
                    <span className="text-xl font-bold tracking-wide">College2Career</span>
                </Link>
                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6 font-medium">
                    <Link to="/" className="hover:bg-[#bef0ff] hover:text-[#005acd] px-3 py-1 rounded transition duration-300">
                        Home
                    </Link>
                    <Link to="/aboutUs" className="hover:bg-[#bef0ff] hover:text-[#005acd] px-3 py-1 rounded transition duration-300">
                        About
                    </Link>
                    <Link to="/contactUs" className="hover:bg-[#bef0ff] hover:text-[#005acd] px-3 py-1 rounded transition duration-300">
                        Contact Us
                    </Link>
                    <Link to="/login" className="hover:bg-white hover:text-[#005acd] px-4 py-1 border border-white rounded transition duration-300">
                        Login
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle Menu"
                >
                    {menuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="md:hidden flex flex-col items-start space-y-4 px-6 pb-4 bg-[#0093cb] text-white font-medium">
                    <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-[#bef0ff]">
                        Home
                    </Link>
                    <Link to="/aboutUs" onClick={() => setMenuOpen(false)} className="hover:text-[#bef0ff]">
                        About
                    </Link>
                    <Link to="/contactUs" onClick={() => setMenuOpen(false)} className="hover:text-[#bef0ff]">
                        Contact Us
                    </Link>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-[#bef0ff]">
                        Login
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
