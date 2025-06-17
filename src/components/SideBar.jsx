import React from 'react'
import { BiLogOut, BiMessage } from 'react-icons/bi'
import { ImProfile } from 'react-icons/im'
import { Link, useNavigate } from 'react-router-dom'
import Profile from './user/Profile'
import { BsCardList } from 'react-icons/bs'
import { MdDashboard, MdMarkUnreadChatAlt } from 'react-icons/md'
import { RiPagesLine } from "react-icons/ri";
import C2CLogo from '../assets/C2CLogo.png'
import { GiTalk } from 'react-icons/gi'

export default function SideBar() {

    const navigate = useNavigate()

    const getCookie = (name) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
        return null;
    }

    const token = getCookie("userToken");

    const handelLogout = () => {
        document.cookie = `userToken=; path=/; max-age=0`
        navigate("../login")
    }
    return (
        <>
            <div id="mainSideBar" className="xl:rounded-r transform  xl:translate-x-0  ease-in-out transition duration-500 flex justify-start items-start h-screen  w-full sm:w-64 bg-gray-900 flex-col">

                <div className="flex justify-start p-6 items-center space-x-3 border-gray-600 border-b">
                    <img src={C2CLogo}
                        alt="College2Career-Logo"
                        className="h-11 w-11 object-cover rounded-full shadow-md"
                    />
                    <p className="text-2xl leading-6 text-white">College2Career</p>
                </div>

                <div className="flex flex-col justify-start items-center px-6 border-b border-gray-600 w-full ">
                    <div id="companySideBar" className="flex justify-start  flex-col w-full md:w-auto items-start pb-1 mt-16 ">
                        <Link to="/user/dashboard" className="flex justify-start items-center space-x-6 mt-3 mb-2 font-semibold hover:text-white focus:bg-gray-700 focus:text-white hover:bg-gray-700 text-gray-400 rounded px-3 py-3  w-full md:w-52">
                            <MdDashboard />
                            <p className="text-base leading-4 ">Dashboard</p>
                        </Link>
                        <Link to="/user/dashboard/vacancies" className="flex justify-start items-center space-x-6 mt-3 mb-2 font-semibold hover:text-white focus:bg-gray-700 focus:text-white hover:bg-gray-700 text-gray-400 rounded px-3 py-3  w-full md:w-52">
                            <BsCardList />
                            <p className="text-base leading-4 ">Vacancy</p>
                        </Link>
                        <Link to="/user/dashboard/applications" className="flex justify-start items-center space-x-6 mt-3 mb-2 font-semibold hover:text-white focus:bg-gray-700 focus:text-white hover:bg-gray-700 text-gray-400 rounded px-3 py-3  w-full md:w-52">
                            <RiPagesLine />
                            <p className="text-base leading-4 ">Applications</p>
                        </Link>
                        <Link to="/user/dashboard/interviews" className="flex justify-start items-center space-x-6 mt-3 mb-2 font-semibold hover:text-white focus:bg-gray-700 focus:text-white hover:bg-gray-700 text-gray-400 rounded px-3 py-3  w-full md:w-52">
                            <GiTalk />
                            <p className="text-base leading-4 ">Interviews</p>
                        </Link>
                        <Link to="/user/dashboard/" className="flex justify-start items-center space-x-6 mt-3 mb-2 font-semibold hover:text-white focus:bg-gray-700 focus:text-white hover:bg-gray-700 text-gray-400 rounded px-3 py-3  w-full md:w-52">
                            <MdMarkUnreadChatAlt />
                            <p className="text-base leading-4">Messages</p>
                        </Link>
                        <Link to="/user/dashboard/profile" className="flex justify-start items-center space-x-6 mt-3 mb-2 font-semibold hover:text-white focus:bg-gray-700 focus:text-white hover:bg-gray-700 text-gray-400 rounded px-3 py-3  w-full md:w-52">
                            <ImProfile />
                            <p className="text-base leading-4">Profile</p>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col justify-between items-center mt-[77%]">
                    <div className=" flex justify-between items-center w-full">
                        <div className="flex justify-center items-center  space-x-2">
                            <div className=''>
                                <img className="rounded-full h-12 mt-2" src="https://res.cloudinary.com/druzdz5zn/image/upload/v1734700064/qoftuli2spstfjt2kosz.jpg" alt="avatar" />
                            </div>
                            <div className="flex justify-start flex-col items-start">
                                <p className="cursor-pointer text-sm leading-5 text-white">Aaditya Pathak</p>
                                <p className="cursor-pointer text-xs leading-3 text-gray-300">adityarpathak7@gmail.com</p>
                            </div>
                        </div>
                        <div>
                            <button title='Logout' onClick={handelLogout} className=''>
                                <BiLogOut className='text-white cursor-pointer w-8 h-6 ml-8 mt-2' />
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
