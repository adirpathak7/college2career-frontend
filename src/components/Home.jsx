// src/pages/Home.jsx

import React from 'react'
import { motion } from 'framer-motion'
import { FaUserCheck, FaBuilding, FaClipboardCheck } from 'react-icons/fa'
import PageTitle from '../PageTitle'
import homeImg from '../assets/homePage.jpg'
import { Link } from 'react-router-dom'
import Footer from './Footer'
import C2CLogo from '../assets/C2CLogo.png'

export default function Home() {
    return (
        <>
            <PageTitle title="Home" />
            <div className="bg-[#f5ffff] min-h-screen w-full font-sans overflow-hidden">

                {/* Hero Section */}
                <section className="relative flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-20 bg-gradient-to-br from-[#005acd] via-[#0093cb] to-[#6dd7fd] text-white overflow-hidden">
                    <div className="absolute w-72 h-72 bg-[#bef0ff] rounded-full opacity-20 blur-3xl top-[-50px] left-[-50px] z-0"></div>
                    <div className="absolute w-96 h-96 bg-white rounded-full opacity-10 blur-3xl bottom-[-80px] right-[-60px] z-0"></div>

                    <div className="md:w-1/2 text-center md:text-left z-10">
                        <motion.h1
                            initial={{ opacity: 0, y: -40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl md:text-5xl font-bold leading-tight"
                        >
                            Welcome to <span className="text-[#bef0ff]">College2Career</span>
                        </motion.h1>
                        <p className="mt-4 text-lg">
                            Connecting talented students with top companies — streamlining the campus placement process for everyone.
                        </p>
                        <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                            <Link to="/login" className="bg-white text-[#005acd] hover:bg-[#bef0ff] font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300">
                                Get Started
                            </Link>
                            <button className="border border-white text-white hover:bg-[#0093cb] px-6 py-3 rounded-full transition duration-300">
                                Learn More
                            </button>
                        </div>
                    </div>

                    {/* Illustration */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="md:w-1/2 mt-10 md:mt-0 z-10"
                    >
                        <img
                            src={homeImg}
                            alt="3D placement"
                            className="w-full max-w-md mx-auto mr-0"
                        />
                    </motion.div>
                </section>

                {/* 🔥 Motivational Quote Section */}
                <section className="bg-white py-12 px-6 md:px-20 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-[#005acd] mb-4"
                    >
                        Let's Get Placed!
                    </motion.h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Unlock your career journey with College2Career — where ambition meets opportunity.
                    </p>
                </section>

                {/* Features Section */}
                <section className="py-20 px-6 md:px-20 bg-white text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#005acd] mb-12">
                        What Makes Us Special?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[{
                            title: "Verified Students",
                            desc: "Every student is verified by the college before applying.",
                            icon: <FaUserCheck className="text-4xl text-[#0093cb] mx-auto mb-4" />
                        },
                        {
                            title: "Company Approval Flow",
                            desc: "Admin validates and approves companies before they can post jobs.",
                            icon: <FaBuilding className="text-4xl text-[#0093cb] mx-auto mb-4" />
                        },
                        {
                            title: "Smooth Application Process",
                            desc: "Students apply to verified jobs, get alerts, and track offers easily.",
                            icon: <FaClipboardCheck className="text-4xl text-[#0093cb] mx-auto mb-4" />
                        }].map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="bg-[#f9fcff] p-8 rounded-2xl shadow-lg border border-[#bef0ff]"
                            >
                                {item.icon}
                                <h3 className="text-xl font-semibold text-[#005acd] mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <Footer />
        </>
    )
}
