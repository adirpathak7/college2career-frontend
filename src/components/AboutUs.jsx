import React from 'react';
import campusImg from '../assets/campusImg.jpeg';
import { FaUserGraduate, FaBuilding, FaChalkboardTeacher, FaUsers, FaBriefcase, FaCheckCircle } from 'react-icons/fa';
import Footer from './Footer';
import PageTitle from '../PageTitle'
import { motion } from 'framer-motion';

const AboutUs = () => {
    return (
        <>
            <PageTitle title="About Us" />
            <div className="bg-white text-gray-800 font-sans mt-14">

                {/* Hero with Image */}
                <section className="relative h-[60vh] w-full">
                    <img
                        src={campusImg}
                        alt="College2Career"
                        className="w-full h-full object-contain md:object-cover brightness-75 object-center"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white">College2Career</h1>
                            <p className="text-lg md:text-xl text-blue-100 mt-2">
                                Bridging the gap between campus and corporate.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Who We Are */}
                <section className="py-12 px-6 max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-blue-800 mb-4">Who We Are</h2>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        College2Career (C2C) is a comprehensive platform designed to revolutionize how colleges, students, and companies connect.
                        We simplify the campus placement process through automation, data-driven tools, and real-time communication.
                    </p>
                </section>

                {/* Mission & Vision */}
                <section className="bg-blue-50 py-12 px-6">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-3xl font-semibold text-blue-800">Our Mission & Vision</h2>
                        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
                            Our mission is to build the most efficient digital ecosystem for placement.
                            We envision a future where every student has access to top-tier opportunities, and every recruiter can hire the best-fit talent, effortlessly.
                        </p>
                    </div>
                </section>

                {/* Platform Highlights */}
                <section className="py-12 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
                    {[
                        {
                            icon: <FaUserGraduate className="text-blue-600 text-3xl mb-2 mx-auto" />,
                            title: 'Student Management',
                            desc: 'Track, verify, and empower student journeys with full transparency.',
                        },
                        {
                            icon: <FaBuilding className="text-blue-600 text-3xl mb-2 mx-auto" />,
                            title: 'Company Interface',
                            desc: 'Powerful tools for job posting, shortlisting, and offer generation.',
                        },
                        {
                            icon: <FaChalkboardTeacher className="text-blue-600 text-3xl mb-2 mx-auto" />,
                            title: 'College Admin Dashboard',
                            desc: 'Control panel for colleges to view insights, verify data, and maintain trust.',
                        },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white shadow-md p-6 rounded-lg border border-blue-100"
                        >
                            {item.icon}
                            <h3 className="text-xl font-bold text-blue-700 mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </motion.div>
                    ))}
                </section>

                {/* Impact Metrics */}
                <section className="py-12 bg-white text-center">
                    <h2 className="text-2xl font-bold text-blue-800 mb-6">Our Impact</h2>
                    <div className="flex flex-wrap justify-center gap-8 text-blue-700 text-lg">
                        <div className="text-center">
                            <FaUsers className="text-3xl text-blue-600 mb-2 mx-auto" />
                            <span className="text-4xl font-bold block">1000+</span>
                            Students Placed
                        </div>
                        <div className="text-center">
                            <FaBriefcase className="text-3xl text-blue-600 mb-2 mx-auto" />
                            <span className="text-4xl font-bold block">50+</span>
                            Hiring Companies
                        </div>
                        <div className="text-center">
                            <FaCheckCircle className="text-3xl text-blue-600 mb-2 mx-auto" />
                            <span className="text-4xl font-bold block">98%</span>
                            Placement Accuracy
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default AboutUs;