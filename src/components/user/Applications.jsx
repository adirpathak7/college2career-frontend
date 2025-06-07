import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLoader } from '../../LoaderContext';


export default function Applications() {
    const [applications, setApplications] = useState([]);
    const { setLoading } = useLoader()

    useEffect(() => {
        setLoading(true)
        fetchApplications();
    }, []);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) return parts.pop().split(';').shift()
        return null
    }
    const fetchApplications = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/applications/getAllAppliedApplicationsByCompanyId`, {
                headers: {
                    "Authorization": "Bearer " + getCookie("userToken")
                },
            });
            setApplications(response.data.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false)
        }
    };

    const getBadgeColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-400';
            case 'Accepted':
                return 'bg-green-100 text-green-800 border-green-400';
            case 'Rejected':
                return 'bg-red-100 text-red-800 border-red-400';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-400';
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">Student Applications</h2>

            {applications.length === 0 ? (
                <p className="text-center text-gray-500">No applications found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {applications.map((app, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-md transition duration-300 hover:shadow-[0_0_15px_rgba(147,51,234,0.6)]"
                        >


                            <div className="rounded-2xl bg-white p-6 flex flex-col justify-between h-full">
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <h3 className="text-xl font-semibold text-gray-800">{app.studentName}</h3>
                                    <span
                                        className={`text-sm font-medium px-3 py-1 border rounded-full whitespace-nowrap ${getBadgeColor(
                                            app.applicationStatus
                                        )}`}
                                    >
                                        {app.applicationStatus}
                                    </span>
                                </div>

                                {/* Student Info */}
                                <div className="text-sm text-gray-700 mt-4 space-y-1">
                                    <p><strong>Email:</strong> {app.studentEmail}</p>
                                    <p><strong>Roll Number:</strong> {app.studentRollNumber}</p>
                                    <p><strong>Course:</strong> {app.course}</p>
                                    <p><strong>Graduation Year:</strong> {app.graduationYear}</p>
                                    <p><strong>Applied At:</strong> {new Date(app.applicationsAppliedAt).toLocaleString()}</p>
                                </div>

                                {/* Vacancy Info */}
                                <div className="mt-4">
                                    <h4 className="text-lg font-semibold text-indigo-600 mb-2">Vacancy Details</h4>
                                    <div className="text-sm text-gray-700 space-y-1">
                                        <p><strong>Title:</strong> {app.title}</p>
                                        <p><strong>Description:</strong> {app.description}</p>
                                        <p><strong>Eligibility:</strong> {app.eligibility_criteria}</p>
                                        <p><strong>Total Vacancy:</strong> {app.totalVacancy}</p>
                                        <p><strong>Location Type:</strong> {app.locationType}</p>
                                        <p><strong>Vacancy Status:</strong> {app.vacancyStatus}</p>
                                    </div>
                                </div>

                                {/* Resume Button */}
                                <div className="pt-4 text-right">
                                    <a
                                        href={app.resumeURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition"
                                    >
                                        📄 Download Resume
                                    </a>
                                </div>
                            </div>
                        </div>

                    ))}
                </div>
            )}
        </div>
    )
}