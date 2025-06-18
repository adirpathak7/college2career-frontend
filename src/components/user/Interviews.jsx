import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import PageTitle from '../../PageTitle';
import { useLoader } from '../../LoaderContext';
import { Dialog } from '@headlessui/react';


const TABS = ['All', 'Scheduled', 'Rescheduled', 'Completed', 'Cancelled'];

export default function Interviews() {
    const [interviews, setInterviews] = useState([]);
    const [filteredInterviews, setFilteredInterviews] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [apiError, setApiError] = useState('');
    const [apiMessageType, setApiMessageType] = useState('');
    const { setLoading } = useLoader();

    const [openDialog, setOpenDialog] = useState(null);
    const [dialogType, setDialogType] = useState('');

    const [formData, setFormData] = useState({
        interviewDate: '',
        interviewTime: '',
        reason: '',
    });

    const [formErrors, setFormErrors] = useState({
        interviewDate: '',
        interviewTime: '',
        reason: '',
    });

    const token = Cookies.get('userToken');

    const fetchInterviews = async () => {
        setLoading(true);
        setApiError('');
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/interviews/getAllInterviewsByCompanyId`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data?.status && Array.isArray(response.data.data)) {
                setInterviews(response.data.data);
                setFilteredInterviews(response.data.data);
            } else {
                setInterviews([]);
                setFilteredInterviews([]);
                setApiError('No interviews found.');
            }
        } catch (err) {
            setInterviews([]);
            setFilteredInterviews([]);
            setApiError(err.message || 'Failed to load interviews.');
            setApiMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterviews();
    }, []);

    useEffect(() => {
        if (activeTab === 'All') {
            setFilteredInterviews(interviews);
        } else {
            setFilteredInterviews(
                interviews.filter(i => i.interviewStatus.toLowerCase() === activeTab.toLowerCase())
            );
        }
    }, [activeTab, interviews]);

    const handleSubmit = async () => {
        const id = openDialog;
        let url = '';
        let body = new FormData();
        const errors = {};

        // Validation logic
        if (dialogType === 'reschedule') {
            if (!formData.interviewDate) errors.interviewDate = 'Interview date is required';
            if (!formData.interviewTime) errors.interviewTime = 'Interview time is required';
            if (!formData.reason.trim()) errors.reason = 'Reason is required';
        } else if (dialogType === 'cancel') {
            if (!formData.reason.trim()) errors.reason = 'Reason is required';
        }

        // If errors exist, stop submission
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // URL & body setup
        if (dialogType === 'reschedule') {
            url = `${import.meta.env.VITE_BASE_URL}/users/interviews/rescheduledInterview/${id}`;
            body.append('interviewDate', formData.interviewDate);
            body.append('interviewTime', formData.interviewTime);
            body.append('reason', formData.reason);
            body.append('interviewStatus', 'rescheduled');
        } else if (dialogType === 'cancel') {
            url = `${import.meta.env.VITE_BASE_URL}/users/interviews/cancelledInterview/${id}`;
            body.append('reason', formData.reason);
            body.append('interviewStatus', 'cancelled');
        }

        try {
            setLoading(true);
            await axios.put(url, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchInterviews();
            closeDialog();
        } catch (err) {
            alert('Failed to submit: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDirectComplete = async (id) => {
        const formData = new FormData();
        formData.append('interviewStatus', 'completed');

        try {
            setLoading(true);
            await axios.put(`${import.meta.env.VITE_BASE_URL}/users/interviews/completedInterview/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchInterviews();
        } catch (err) {
            console.error('Failed to mark as completed:', err);
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const openActionDialog = (id, type) => {
        setOpenDialog(id);
        setDialogType(type);
        setFormData({ interviewDate: '', interviewTime: '', reason: '' });
        setFormErrors({ interviewDate: '', interviewTime: '', reason: '' });
    };

    const closeDialog = () => {
        setOpenDialog(null);
        setDialogType('');
        setFormData({ interviewDate: '', interviewTime: '', reason: '' });
        setFormErrors({ interviewDate: '', interviewTime: '', reason: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
            <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">📋 Scheduled Interviews</h1>

            <PageTitle title="Interviews" />

            <div className="flex flex-wrap justify-center gap-3 mb-6">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 
                            ${activeTab === tab
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-blue-100'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {apiError && (
                <div className={`mb-4 px-4 py-2 rounded text-center font-semibold ${apiMessageType === 'error'
                    ? 'bg-red-100 border border-red-400 text-red-700'
                    : 'bg-green-100 border border-green-400 text-green-700'}`}>
                    {apiError}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInterviews.map((interview) => (
                    <div key={interview.interviewId} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl font-semibold text-gray-800">{interview.vacancyTitle}</h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(interview.interviewStatus)}`}>
                                {interview.interviewStatus.toUpperCase()}
                            </span>
                        </div>

                        <p className="text-gray-600"><span className="font-medium">Student:</span> {interview.studentName}</p>
                        <p className="text-gray-600"><span className="font-medium">Email:</span> {interview.email}</p>
                        <p className="text-gray-600"><span className="font-medium">Date:</span> {interview.interviewDate}</p>
                        <p className="text-gray-600"><span className="font-medium">Time:</span> {interview.interviewTime}</p>
                        <p className="text-gray-600"><span className="font-medium">Company:</span> {interview.companyName}</p>
                        <p className="text-gray-600"><span className="font-medium">Package:</span> {interview.annualPackage}</p>

                        {interview.reason && (
                            <p className="mt-2 text-sm text-yellow-700 bg-yellow-100 p-2 rounded">
                                <span className="font-semibold">Reason:</span> {interview.reason}
                            </p>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-4 flex gap-2 flex-wrap">
                            {interview.interviewStatus === 'scheduled' && (
                                <>
                                    <ActionBtn text="Reschedule" color="yellow" onClick={() => openActionDialog(interview.interviewId, 'reschedule')} />
                                    <ActionBtn text="Cancel" color="red" onClick={() => openActionDialog(interview.interviewId, 'cancel')} />
                                    <ActionBtn text="Completed" color="green" onClick={() => handleDirectComplete(interview.interviewId)} />
                                </>
                            )}
                            {interview.interviewStatus === 'rescheduled' && (
                                <>
                                    <ActionBtn text="Cancel" color="red" onClick={() => openActionDialog(interview.interviewId, 'cancel')} />
                                    <ActionBtn text="Completed" color="green" onClick={() => handleDirectComplete(interview.interviewId)} />
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Dialog */}
            <Dialog open={!!openDialog} onClose={closeDialog} className="relative z-50">
                <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
                        <Dialog.Title className="text-xl font-semibold capitalize text-gray-800">
                            {dialogType} Interview
                        </Dialog.Title>

                        {dialogType === 'reschedule' && (
                            <>
                                <div>
                                    <label className="text-sm text-gray-700 block mb-1">Interview Date</label>
                                    <input
                                        type="date"
                                        className="w-full border px-3 py-2 rounded"
                                        value={formData.interviewDate}
                                        onChange={(e) => {
                                            setFormData({ ...formData, interviewDate: e.target.value });
                                            setFormErrors({ ...formErrors, interviewDate: '' });
                                        }}
                                    />
                                    {formErrors.interviewDate && <span className="text-red-500 text-sm">{formErrors.interviewDate}</span>}
                                </div>

                                <div>
                                    <label className="text-sm text-gray-700 block mb-1">Interview Time</label>
                                    <input
                                        type="time"
                                        className="w-full border px-3 py-2 rounded"
                                        value={formData.interviewTime}
                                        onChange={(e) => {
                                            setFormData({ ...formData, interviewTime: e.target.value });
                                            setFormErrors({ ...formErrors, interviewTime: '' });
                                        }}
                                    />
                                    {formErrors.interviewTime && <span className="text-red-500 text-sm">{formErrors.interviewTime}</span>}
                                </div>

                            </>
                        )}

                        {(dialogType === 'reschedule' || dialogType === 'cancel') && (
                            <div>
                                <label className="text-sm text-gray-700 block mb-1">Reason</label>
                                <textarea
                                    className="w-full border px-3 py-2 rounded"
                                    rows={3}
                                    value={formData.reason}
                                    onChange={(e) => {
                                        setFormData({ ...formData, reason: e.target.value });
                                        setFormErrors({ ...formErrors, reason: '' });
                                    }}
                                ></textarea>
                                {formErrors.reason && <span className="text-red-500 text-sm">{formErrors.reason}</span>}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={closeDialog}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Submit
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}

// Helper: Action Button component
const ActionBtn = ({ text, color, onClick }) => {
    const colorClasses = {
        red: 'bg-red-600 hover:bg-red-700',
        green: 'bg-green-600 hover:bg-green-700',
        yellow: 'bg-yellow-500 hover:bg-yellow-600',
    };

    return (
        <button
            onClick={onClick}
            className={`text-white px-4 py-1 rounded-full text-sm transition ${colorClasses[color] || 'bg-gray-600'}`}
        >
            {text}
        </button>
    );
};

// Helper: Get status badge color
const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'scheduled':
            return 'bg-blue-100 text-blue-800';
        case 'rescheduled':
            return 'bg-yellow-100 text-yellow-800';
        case 'completed':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
