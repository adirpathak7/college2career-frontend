import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLoader } from '../../LoaderContext';
import { Dialog } from '@headlessui/react';
import ApplicationTabs from './ApplicationsTabs';

export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [showDialog, setShowDialog] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);
    const { setLoading } = useLoader();
    const [apiError, setApiError] = useState('');
    const [apiMessageType, setApiMessageType] = useState('');
    const [rejectError, setRejectError] = useState('');
    const [showScheduleDialog, setShowScheduleDialog] = useState(false);
    const [interviewDateError, setInterviewDateError] = useState('');
    const [interviewTimeError, setInterviewTimeError] = useState('');
    const [interviewDetails, setInterviewDetails] = useState({
        interviewDate: '',
        interviewTime: ''
    })

    const openScheduleDialog = (applicationId) => {
        setSelectedApplicationId(applicationId);
        setInterviewDetails({
            interviewDate: '',
            interviewTime: ''
        });
        setShowScheduleDialog(true);
    };

    useEffect(() => {
        setLoading(true);
        fetchApplications();
    }, []);

    useEffect(() => {
        if (apiError) {
            const timer = setTimeout(() => {
                setApiError('');
                setApiMessageType('');
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [apiError]);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/applications/getAllAppliedApplicationsByCompanyId`, {
                headers: {
                    "Authorization": "Bearer " + getCookie("userToken")
                },
            });
            setApplications(response.data.data);
        } catch (error) {
            setApiError("Error fetching applications: ", error)
            setApiMessageType('error')
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateApplicationStatus = async (applicationId, status, reason = '') => {
        setLoading(true);
        try {
            await axios.put(`${import.meta.env.VITE_BASE_URL}/users/applications/updateApplicationsStatusByCompany/${applicationId}`, {
                status,
                reason
            }, {
                headers: {
                    "Authorization": "Bearer " + getCookie("userToken")
                }
            });
            setApiError('Status updated successfully.')
            await fetchApplications();
        } catch (error) {
            setApiMessageType('error')
            setApiError("Error fetching applications: ", error)
            console.error("Error updating status", error);
        } finally {
            setLoading(false);
        }
    };

    const openRejectDialog = (applicationId) => {
        setSelectedApplicationId(applicationId);
        setRejectReason('');
        setShowDialog(true);
    };

    const handleReject = () => {
        if (!rejectReason.trim()) {
            setRejectError("Please enter a reason for rejection.");
            return;
        }
        setRejectError('');
        updateApplicationStatus(selectedApplicationId, 'rejected', rejectReason);
        setShowDialog(false);
    };

    const getBadgeColor = (status) => {
        switch (status) {
            case 'applied':
                return 'bg-yellow-100 text-yellow-800 border-yellow-400 capitalize';
            case 'shortlisted':
                return 'bg-blue-100 text-blue-800 border-blue-400 capitalize';
            case 'interviewScheduled':
                return 'bg-indigo-100 text-indigo-800 border-indigo-400 capitalize';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-400 capitalize';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-400 capitalize';
        }
    };

    const formatTimeTo12Hour = (time24) => {
        const [hours, minutes] = time24.split(":");
        const hour = parseInt(hours, 10);
        const suffix = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        return `${hour12}:${minutes} ${suffix}`;
    };

    const formattedTime = formatTimeTo12Hour(interviewDetails.interviewTime);

    const handleSchedule = async () => {
        let hasError = false;

        if (!interviewDetails.interviewDate) {
            setInterviewDateError("Please select interview date.");
            hasError = true;
        } else {
            setInterviewDateError('');
        }

        if (!interviewDetails.interviewTime) {
            setInterviewTimeError("Please select interview time.");
            hasError = true;
        } else {
            setInterviewTimeError('');
        }

        if (hasError) return;

        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/interviews/interviewSchedule`, {
                applicationId: selectedApplicationId,
                interviewDate: interviewDetails.interviewDate,
                interviewTime: formattedTime
            }, {
                headers: {
                    "Authorization": "Bearer " + getCookie("userToken")
                }
            });

            if (response.data.status === true) {

                await updateApplicationStatus(selectedApplicationId, 'interviewScheduled');

                setApiError("Interview scheduled successfully.");
                setApiMessageType("success");
                setShowScheduleDialog(false);
            } else {
                setApiError(response.data.message)
                setApiMessageType('error')
                setShowScheduleDialog(false)
            }
        } catch (error) {
            setApiError("Failed to schedule interview.");
            setApiMessageType("error");
            console.error("Interview scheduling error:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredApplications = Array.isArray(applications)
        ? (selectedStatus === "All"
            ? applications
            : applications.filter(
                (app) =>
                    app.applicationStatus?.toLowerCase() === selectedStatus.toLowerCase()
            ))
        : [];

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">

            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">Student Applications</h2>
            {/* Tabs */}
            <ApplicationTabs
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
            />

            {apiError && (
                <div
                    className={`mb-4 px-4 py-2 rounded text-center font-semibold ${apiMessageType === 'error'
                        ? 'bg-red-100 border border-red-400 text-red-700'
                        : 'bg-green-100 border border-green-400 text-green-700'
                        }`}
                >
                    {apiError}
                </div>
            )}

            {filteredApplications.length === 0 ? (
                <p className="text-center text-gray-500">No applications found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredApplications.map((app, index) => (
                        <div
                            key={index}
                            className="bg-white overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl hover:bg-gray-300 p-[4] transition-shadow duration-300"
                        >
                            <div className="rounded-2xl bg-white p-6 flex flex-col justify-between h-full">
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <h3 className="text-xl font-semibold text-gray-800">{app.studentName}</h3>
                                    <span className={`text-sm font-medium px-3 py-1 border rounded-full ${getBadgeColor(app.applicationStatus)}`}>
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

                                {/* Resume & Action Buttons */}
                                <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 mt-auto">
                                    <a
                                        href={app.resumeURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition"
                                    >
                                        📄 Resume
                                    </a>

                                    {/* Conditional Action Buttons */}
                                    {app.applicationStatus === 'applied' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateApplicationStatus(app.applicationId, 'shortlisted')}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                                            >
                                                Shortlist
                                            </button>
                                            <button
                                                onClick={() => openRejectDialog(app.applicationId)}
                                                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                    {app.applicationStatus === 'shortlisted' && (
                                        <button
                                            onClick={() => openScheduleDialog(app.applicationId)}
                                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                                        >
                                            Schedule Interview
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={showDialog} onClose={() => setShowDialog(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/75" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
                        <Dialog.Title className="text-xl font-semibold text-gray-800">Reject Application</Dialog.Title>

                        <textarea
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            rows="4"
                            placeholder="Enter reason for rejection..."
                            value={rejectReason}
                            onChange={(e) => {
                                setRejectReason(e.target.value);
                                if (rejectError) setRejectError('');
                            }}
                        />
                        {rejectError && (
                            <p className="text-sm text-red-600">{rejectError}</p>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDialog(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-black"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                            >
                                Submit
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            <Dialog open={showScheduleDialog} onClose={() => setShowScheduleDialog(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
                        <Dialog.Title className="text-xl font-semibold text-gray-800">Schedule Interview</Dialog.Title>

                        <div>
                            <label className="block text-sm text-gray-600">Interview Date</label>
                            <input
                                type="date"
                                className="w-full border rounded px-3 py-2"
                                value={interviewDetails.interviewDate}
                                min={new Date().toISOString().split("T")[0]}
                                max={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                                onChange={(e) => {
                                    setInterviewDetails(prev => ({ ...prev, interviewDate: e.target.value }));
                                    setInterviewDateError('');
                                }}
                            />
                            {interviewDateError && <p className="text-sm text-red-600">{interviewDateError}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mt-4">Interview Time</label>
                            <input
                                type="time"
                                className="w-full border rounded px-3 py-2"
                                value={interviewDetails.interviewTime}
                                onChange={(e) => {
                                    setInterviewDetails(prev => ({ ...prev, interviewTime: e.target.value }));
                                    setInterviewTimeError('');
                                }}
                            />
                            {interviewTimeError && <p className="text-sm text-red-600">{interviewTimeError}</p>}

                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={() => setShowScheduleDialog(false)} className="text-gray-600">Cancel</button>
                            <button onClick={handleSchedule} className="bg-indigo-600 text-white px-4 py-2 rounded">Schedule</button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}
