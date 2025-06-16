// src/pages/ContactUs.jsx

import React from 'react';

const ContactUs = () => {
    return (
        <div className="relative h-screen w-full text-gray-800 font-sans">

            {/* Fullscreen Google Map in background */}
            <iframe
                title="C2C Surat Map"
                className="absolute inset-0 w-full h-full z-0"
                frameBorder="0"
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.9582066193484!2d72.83106077504588!3d21.195294980479047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04fdd8eb2e6c3%3A0x3e9dc4a0c66c72ec!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1718600000000!5m2!1sen!2sin"
            ></iframe>

            {/* Content Overlay */}
            <div className="relative z-10 flex items-center justify-center h-full px-4 backdrop-blur-sm bg-white/70">
                <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-4xl w-full grid md:grid-cols-2 gap-8">

                    {/* Left Info */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-blue-800">Contact Us</h2>
                        <p className="text-gray-600">We’re based in Surat, Gujarat. Let’s connect!</p>
                        <div>
                            <p><span className="font-semibold text-blue-700">Email:</span> support@college2career.com</p>
                            <p><span className="font-semibold text-blue-700">Phone:</span> +91 98765 43210</p>
                            <p><span className="font-semibold text-blue-700">Location:</span> Surat, Gujarat, India</p>
                        </div>
                    </div>

                    {/* Right Form */}
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-blue-700">Name</label>
                            <input
                                type="text"
                                className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-blue-700">Email</label>
                            <input
                                type="email"
                                className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-blue-700">Message</label>
                            <textarea
                                rows="4"
                                className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Write your message..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded transition duration-200"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;