import React from 'react'
import { motion } from 'framer-motion';
import PlacementImg from '../assets/pacementIcon.png'

export default function Home() {
    return (
        <>
            <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 mt-14">
                <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
                    {/* Left content */}
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2 space-y-6"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Welcome to <span className="text-blue-500">College2Career</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300">
                            Bridging the gap between students and top companies with smart placement management.
                        </p>
                        <button className="bg-blue-600 hover:bg-blue-700 transition-all px-6 py-3 text-lg rounded-2xl shadow-lg">
                            Get Started
                        </button>
                    </motion.div>

                    {/* Right image */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2"
                    >
                        <img
                            src={PlacementImg}
                            alt="Placement Illustration"
                            className="w-full h-auto object-contain"
                        />
                    </motion.div>
                </div>

                {/* Extra section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-semibold mb-4">What We Offer</h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        A powerful platform where colleges manage placement, companies find talent, and students get their dream jobs.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        {[
                            {
                                title: "For Students",
                                desc: "View job postings, apply, attend interviews, and track your placement journey.",
                                icon: "🎓",
                            },
                            {
                                title: "For Companies",
                                desc: "Post vacancies, review applications, and hire the best students.",
                                icon: "🏢",
                            },
                            {
                                title: "For Admin",
                                desc: "Manage students and companies, verify data, and maintain placement records.",
                                icon: "🛠️",
                            },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                className="bg-gray-800 p-6 rounded-2xl shadow-md"
                            >
                                <div className="text-5xl mb-4">{item.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </>
    )
}
