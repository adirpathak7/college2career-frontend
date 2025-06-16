// src/pages/ContactUs.jsx

import React from 'react';
import Footer from './Footer';
import PageTitle from '../PageTitle'

const ContactUs = () => {
    return (
        <>
            <PageTitle title="Contact Us" />
            <div className="relative h-screen w-full text-gray-800 font-sans overflow-hidden mt-14">

                {/* Fullscreen Google Map in background */}
                <iframe
                    title="C2C Surat Map"
                    className="absolute inset-0 w-full h-full z-0"
                    frameBorder="0"
                    loading="lazy"
                    allowFullScreen
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.853462299278!2d72.78454727478618!3d21.15822918332009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04df184811243%3A0x7d3bbfaeb9dd9862!2sJ.P.Dawar%20Institute%20Of%20Technology%2C%20Sardar%20Vallabhbhai%20Nat&#39;l%20Inst%20of%20Technology%20Rd%2C%20SVNIT%20Campus%2C%20Athwa%2C%20Surat%2C%20Gujarat%20395007!5e0!3m2!1sen!2sin!4v1750041269107!5m2!1sen!2sin"
                ></iframe>
                {/* <iframe  width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
                {/* Contact Form Overlay at bottom-left */}
                <div className="absolute bottom-16 left-6 z-10 max-w-md w-full bg-white bg-opacity-95 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-blue-800 mb-2">Contact Us</h2>
                    <p className="text-gray-600 mb-4">We’re based in Surat, Gujarat. Let’s connect!</p>
                    <div className="mb-4 text-sm text-gray-700 space-y-1">
                        <p><span className="font-semibold text-blue-700">Email:</span> support@college2career.com</p>
                        <p><span className="font-semibold text-blue-700">Phone:</span> +91 76003 07488</p>
                        <p><span className="font-semibold text-blue-700">Location:</span> Surat, Gujarat, India</p>
                    </div>
                    <form className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-blue-700">Name</label>
                            <input
                                required
                                type="text"
                                className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-blue-700">Email</label>
                            <input
                                required
                                type="email"
                                className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-blue-700">Message</label>
                            <textarea
                                required
                                rows="3"
                                className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Write your message..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ContactUs;
