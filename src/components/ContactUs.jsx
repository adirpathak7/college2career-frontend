import React from 'react';
import Footer from './Footer';
import PageTitle from '../PageTitle';
import { motion } from 'framer-motion';

const ContactUs = () => {
    return (
        <>
            <PageTitle title="Help & Support" />
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

                {/* Help Content Overlay */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="absolute bottom-16 left-6 z-10 max-w-md w-full bg-white bg-opacity-95 p-6 rounded-lg shadow-lg"
                >
                    <h2 className="text-xl font-bold text-blue-800 mb-2">Need Help?</h2>
                    <p className="text-gray-600 mb-4">We’re here to support you with anything related to College2Career platform.</p>
                    <div className="mb-4 text-sm text-gray-700 space-y-2">
                        <p><span className="font-semibold text-blue-700">FAQs:</span> Visit our <a href="/faq" className="text-blue-600 underline">FAQ page</a> for common queries.</p>
                        <p><span className="font-semibold text-blue-700">Support Email:</span> support@college2career.com</p>
                        <p><span className="font-semibold text-blue-700">Live Chat:</span> Use the chatbot at the bottom right corner for instant help.</p>
                        <p><span className="font-semibold text-blue-700">Office Hours:</span> Mon–Fri, 10 AM – 6 PM</p>
                    </div>
                </motion.div>

                {/* Chatbot iframe */}
                <div className="fixed bottom-6 right-6 z-50 w-80 h-[500px] shadow-xl rounded-lg overflow-hidden border border-gray-300">
                    <iframe
                        src="https://www.chatbase.co/chatbot-iframe/rs95E0QIHQsun3-eowl1J"
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                        frameBorder="0"
                        allow="clipboard-write"
                    />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ContactUs;
