import React from 'react'
import PageTitle from '../../PageTitle'


export default function Profile() {
    const college = {
        name: 'J.P Dawer Institute (VNSGU)',
        establishedDate: '1967-05-23',
        contactNumber: '+91 9876543210',
        profilePicture: 'https://res.cloudinary.com/druzdz5zn/image/upload/v1744715705/lhi4cgauyc4nqttymcu4.webp',
        address: 'Udhna Magdalla Road',
        city: 'Surat',
        state: 'Gujarat',
        email: 'info@vnsgu.ac.in',
        website: 'https://vnsgu.ac.in/',
        vc: 'Dr. Kishorsinh N. Chavda',
    }
    return (
        <>
            <PageTitle title="Admin Profile" />
            <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
                <div className="bg-white rounded-xl shadow-md w-full max-w-4xl overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Profile Image */}
                        <div className="md:w-1/3 bg-gradient-to-br from-indigo-500 to-purple-600 flex justify-center items-center p-6">
                            <img
                                src={college.profilePicture}
                                alt="College"
                                className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        </div>

                        {/* Profile Info */}
                        <div className="md:w-2/3 p-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{college.name}</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                                <div>
                                    <span className="font-semibold">Established:</span><br />
                                    {new Date(college.establishedDate).toDateString()}
                                </div>
                                <div>
                                    <span className="font-semibold">Vice Chancellor:</span><br />
                                    {college.vc}
                                </div>
                                <div>
                                    <span className="font-semibold">Contact Number:</span><br />
                                    {college.contactNumber}
                                </div>
                                <div>
                                    <span className="font-semibold">Email:</span><br />
                                    {college.email}
                                </div>
                                <div>
                                    <span className="font-semibold">Address:</span><br />
                                    {college.address}
                                </div>
                                <div>
                                    <span className="font-semibold">City:</span><br />
                                    {college.city}
                                </div>
                                <div>
                                    <span className="font-semibold">State:</span><br />
                                    {college.state}
                                </div>
                                <div>
                                    <span className="font-semibold">Website:</span><br />
                                    <a href={college.website} className="text-blue-600 underline" target="_blank" rel="noreferrer">{college.website}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
