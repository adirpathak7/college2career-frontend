// src/components/Footer.jsx

import React from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-[#005acd] via-[#0093cb] to-[#6dd7fd] shadow-md z-50 backdrop-blur-md text-white py-10 px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-sm">

                {/* Company Description */}
                <div>
                    <h2 className="text-lg font-bold mb-3">College2Career</h2>
                    <p>
                        College2Career is an initiative based in Surat, Gujarat focused on bridging the gap between academic education and professional careers. We help students prepare for the real world through resources, mentoring, and networking.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/aboutUs" className="hover:underline">About Us</a></li>
                        <li><a href="/contactUs" className="hover:underline">Contact</a></li>
                        <li><a href="/login" className="hover:underline">Login</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="font-semibold mb-3">Contact</h3>
                    <ul className="space-y-2">
                        <li>Email: support@college2career.com</li>
                        <li>Phone: +91 76003 07488</li>
                        <li>Location: Surat, Gujarat, India</li>
                    </ul>
                </div>

                {/* Social Links */}
                <div>
                    <h3 className="font-semibold mb-3">Follow Us</h3>
                    <div className="flex space-x-4 mt-2">
                        <a href="#" className="hover:text-blue-300"><FaFacebookF /></a>
                        <a href="#" className="hover:text-blue-300"><FaInstagram /></a>
                        <a href="#" className="hover:text-blue-300"><FaLinkedinIn /></a>
                        <a href="mailto:support@college2career.com" className="hover:text-blue-300"><FaEnvelope /></a>
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="mt-10 text-center text-xs text-gray-100 pt-4">
                © {new Date().getFullYear()} College2Career. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
