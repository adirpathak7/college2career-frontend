import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <>
            <nav className="bg-black text-white fixed top-0 left-0 w-full shadow-md z-50">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold">College2Career</Link>

                    <div className="hidden md:flex space-x-6">
                        <Link to="/" className="hover:text-gray-300">Home</Link>
                        <Link to="/about" className="hover:text-gray-300">About</Link>
                        <Link to="/login" className="hover:text-gray-300">Login</Link>
                    </div>

                    <button className="md:hidden text-white focus:outline-none" id="menu-button">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>

                <div className="md:hidden hidden flex flex-col space-y-4 px-4 pb-4" id="mobile-menu">
                    <Link to="/" className="block hover:text-gray-300">Home</Link>
                    <Link to="/about" className="block hover:text-gray-300">About</Link>
                    <Link to="/login" className="block hover:text-gray-300">Login</Link>
                </div>
            </nav>
        </>
    )
}

export default Navbar
