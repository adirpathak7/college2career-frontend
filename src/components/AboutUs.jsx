import React from 'react';
import campusImg from '../assets/campusImg.jpeg';
import { FaUserGraduate, FaBuilding, FaChalkboardTeacher, FaUsers, FaBriefcase, FaCheckCircle } from 'react-icons/fa';

const AboutUs = () => {
    return (
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
                <div className="bg-white shadow-md p-6 rounded-lg border border-blue-100">
                    <FaUserGraduate className="text-blue-600 text-3xl mb-2 mx-auto" />
                    <h3 className="text-xl font-bold text-blue-700 mb-2">Student Management</h3>
                    <p className="text-gray-600">Track, verify, and empower student journeys with full transparency.</p>
                </div>

                <div className="bg-white shadow-md p-6 rounded-lg border border-blue-100">
                    <FaBuilding className="text-blue-600 text-3xl mb-2 mx-auto" />
                    <h3 className="text-xl font-bold text-blue-700 mb-2">Company Interface</h3>
                    <p className="text-gray-600">Powerful tools for job posting, shortlisting, and offer generation.</p>
                </div>
                <div className="bg-white shadow-md p-6 rounded-lg border border-blue-100">
                    <FaChalkboardTeacher className="text-blue-600 text-3xl mb-2 mx-auto" />
                    <h3 className="text-xl font-bold text-blue-700 mb-2">College Admin Dashboard</h3>
                    <p className="text-gray-600">Control panel for colleges to view insights, verify data, and maintain trust.</p>
                </div>
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

            {/* Final CTA */}
            <section className="bg-blue-100 py-10 text-center">
                <p className="text-lg text-blue-800 font-medium">Want to know more or partner with us?</p>
                <p className="text-blue-700 mt-2">
                    Contact us at: <a href="mailto:support@college2career.com" className="underline">support@college2career.com</a>
                </p>
            </section>
        </div>
    );
};

export default AboutUs;