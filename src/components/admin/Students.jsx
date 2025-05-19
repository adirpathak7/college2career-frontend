import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLoader } from '../../LoaderContext';
import { FcApproval } from 'react-icons/fc';
import { BiBlock } from 'react-icons/bi';
import PageTitle from '../../PageTitle'


const TABS = [
    { label: 'All', api: '/users/students/getAllStudents' },
    { label: 'Pending', api: '/users/students/getStudentsByPendingStatus' },
    { label: 'Activated', api: '/users/students/getStudentsByActivatedStatus' },
    { label: 'Rejected', api: '/users/students/getStudentsByRejectedStatus' },
    { label: 'Deactivated', api: '/users/students/getStudentsByDeactivatedStatus' },
];

export default function Students() {
    const [activeTab, setActiveTab] = useState('All');
    const [students, setStudents] = useState([])
    const [apiError, setApiError] = useState('')
    const [statusReason, setStatusReason] = useState('');
    const [showReasonInput, setShowReasonInput] = useState(null);
    const [cardErrors, setCardErrors] = useState({});
    const { setLoading } = useLoader()

    const fetchStudents = async () => {
        setLoading(true);
        setApiError('');
        try {
            const tab = TABS.find(t => t.label === activeTab);
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}${tab.api}`);
            if (res.data?.status && Array.isArray(res.data.data)) {
                setStudents(res.data.data);
            } else {
                setStudents([]);
                setApiError("No students found.");
            }
        } catch (err) {
            setStudents([]);
            setApiError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStudents()
        setShowReasonInput(null)
    }, [activeTab])

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return "text-yellow-500";
            case 'activated': return "text-green-400";
            case 'rejected': return "text-red-400";
            case 'deactivated': return "text-red-400";
            default: return "text-gray-300";
        }
    }

    const updateStudentStatus = async (studentId, newStatus, reason = '') => {
        if ((newStatus === 'rejected' || newStatus === 'deactivated') && !reason.trim()) {
            setCardErrors(prev => ({
                ...prev,
                [studentId]: "Please enter a reason."
            }));

            setTimeout(() => {
                setCardErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[studentId];
                    return newErrors;
                });
            }, 2000);
            return;
        }

        try {
            setLoading(true);
            const payload = { studentId, status: newStatus };
            if (newStatus !== 'activated') {
                payload.reasonOfStatus = reason;
            }

            const res = await axios.patch(`${import.meta.env.VITE_BASE_URL}/users/students/updateStudentStatus/${studentId}`, payload);

            if (res.data.status) {
                await fetchStudents();
            } else {
                setApiError("Something went wrong! Please try again.");
            }
        } catch (error) {
            setApiError("Something went wrong! Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const ActionButtons = ({ student }) => {
        const status = student.status?.toLowerCase();

        const showReason = student.studentId === showReasonInput;

        const renderReasonInput = (nextStatus) => (
            <div className="mt-2">
                <textarea
                    rows={2}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    placeholder="Enter reason..."
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                />
                {cardErrors[student.studentId] && (
                    <p className="text-red-500 text-xs mt-1">{cardErrors[student.studentId]}</p>
                )}
                <div className="flex gap-2 mt-1">
                    <button
                        className="px-3 py-1 text-white bg-green-600 rounded text-sm"
                        onClick={() => updateStudentStatus(student.studentId, nextStatus, statusReason)}
                    >
                        Confirm
                    </button>
                    <button
                        className="px-3 py-1 text-white bg-gray-500 rounded text-sm"
                        onClick={() => {
                            setShowReasonInput(null);
                            setStatusReason('');
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );

        switch (status) {
            case 'pending':
                return (
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => updateStudentStatus(student.studentId, 'activated')}
                            className="bg-green-600 text-white px-3 py-1 text-sm rounded"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => setShowReasonInput(student.studentId)}
                            className="bg-red-600 text-white px-3 py-1 text-sm rounded"
                        >
                            Reject
                        </button>
                        {showReason && renderReasonInput('rejected')}
                    </div>
                );

            case 'activated':
                return (
                    <div>
                        <button
                            onClick={() => setShowReasonInput(student.studentId)}
                            className="bg-red-600 text-white px-3 py-1 text-sm rounded"
                        >
                            Deactivate
                        </button>
                        {showReason && renderReasonInput('deactivated')}
                    </div>
                );

            case 'rejected':
                return (
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => updateStudentStatus(student.studentId, 'activated')}
                            className="bg-green-600 text-white px-3 py-1 text-sm rounded"
                        >
                            Activate
                        </button>
                        <button
                            onClick={() => setShowReasonInput(student.studentId)}
                            className="bg-red-600 text-white px-3 py-1 text-sm rounded"
                        >
                            Deactivate
                        </button>
                        {showReason && renderReasonInput('deactivated')}
                    </div>
                );

            case 'deactivated':
                return (
                    <button
                        onClick={() => updateStudentStatus(student.studentId, 'activated')}
                        className="bg-green-600 text-white px-3 py-1 text-sm rounded"
                    >
                        Activate
                    </button>
                );

            default:
                return null;
        }
    }

    return (
        <>
            <PageTitle title="Students" />
            <div className="p-4">
                <h1 className="text-3xl font-bold mb-6 text-center">Students List</h1>
                <div className="flex gap-4 border-b mb-4">
                    {TABS.map((tab) => (
                        <button
                            key={tab.label}
                            onClick={() => setActiveTab(tab.label)}
                            className={`px-4 py-2 border-b-2 ${activeTab === tab.label ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {apiError ? (
                    <div className="mb-4 px-4 py-2 bg-red-600/20 border border-red-500 text-red-400 rounded text-center font-bold">
                        {apiError}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border">
                            <thead className="bg-gray-100 text-left">
                                <tr>
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Email</th>
                                    <th className="p-2">Roll No</th>
                                    <th className="p-2">Course</th>
                                    <th className="p-2">Graduation Year</th>
                                    <th className="p-2">Resume</th>
                                    <th className="p-2">Status</th>
                                    {activeTab.toLowerCase() !== 'pending' && <th className="p-2">Reason</th>}
                                    <th className="p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.studentId} className="border-t">
                                        <td className="p-2">{student.studentName}</td>
                                        <td className="p-2">{student.email}</td>
                                        <td className="p-2">{student.rollNumber}</td>
                                        <td className="p-2">{student.course}</td>
                                        <td className="p-2">{student.graduationYear}</td>
                                        <td className="p-2">
                                            <a
                                                href={student.resumeURL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                View
                                            </a>
                                        </td>
                                        <td className={`p-2 font-semibold ${getStatusColor(student.status)}`}>
                                            {student.status}
                                        </td>
                                        {activeTab.toLowerCase() !== 'pending' && (
                                            <td className="p-2">
                                                {student.statusReason || '-'}
                                            </td>
                                        )}
                                        <td className="p-2">
                                            <ActionButtons student={student} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    )
}
