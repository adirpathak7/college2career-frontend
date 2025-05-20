import React, { useState, useEffect } from 'react';
import PageTitle from '../../PageTitle';
import ActionButtons from '../HelperComponents/ActionButtons';
import { useLoader } from '../../LoaderContext';
import axios from 'axios'


const TABS = [
    { label: 'All', api: '/users/students/getAllStudents' },
    { label: 'Pending', api: '/users/students/getStudentsByPendingStatus' },
    { label: 'Activated', api: '/users/students/getStudentsByActivatedStatus' },
    { label: 'Rejected', api: '/users/students/getStudentsByRejectedStatus' },
    { label: 'Deactivated', api: '/users/students/getStudentsByDeactivatedStatus' },
];

const Students = () => {
    const [students, setStudents] = useState([]);
    const [apiError, setApiError] = useState(null);
    const [showReasonInput, setShowReasonInput] = useState(null);
    const [statusReason, setStatusReason] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [cardErrors, setCardErrors] = useState({});
    const { setLoading } = useLoader();
    const studentsPerPage = 10;

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

    const filteredStudents =
        activeTab === 'All'
            ? students
            : students.filter(student => student.status.toLowerCase() === activeTab.toLowerCase());

    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
    const paginatedStudents = filteredStudents.slice(
        (currentPage - 1) * studentsPerPage,
        currentPage * studentsPerPage
    );

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'activated': return 'text-green-600';
            case 'pending': return 'text-yellow-500';
            case 'rejected': return 'text-red-500';
            case 'deactivated': return 'text-gray-500';
            default: return 'text-black';
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchStudents();
    }, [activeTab]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="py-8 px-4 md:px-12">
            <PageTitle title="Students" />
            <h1 className="text-3xl font-bold mb-6 text-center">Students List</h1>

            <div className="flex gap-4 border-b mb-4 overflow-x-auto">
                {TABS.map((tab) => (
                    <button
                        key={tab.label}
                        onClick={() => setActiveTab(tab.label)}
                        className={`px-4 py-2 border-b-2 whitespace-nowrap ${activeTab === tab.label ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {apiError && (
                <div className="mb-4 px-4 py-2 bg-red-100 border border-red-500 text-red-600 rounded text-center">
                    {apiError}
                </div>
            )}

            <div className="overflow-x-auto border rounded shadow-sm">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">Name</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Roll No</th>
                            <th className="p-2">Course</th>
                            <th className="p-2">Graduation Year</th>
                            <th className="p-2">Resume</th>
                            <th className="p-2">Status</th>
                            {activeTab.toLowerCase() !== 'pending' && activeTab.toLowerCase() !== 'activated' && <th className="p-2">Reason</th>}
                            <th className="p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedStudents.length > 0 ? paginatedStudents.map((student) => (
                            <tr key={student.studentId} className="border-t hover:bg-gray-50">
                                <td className="p-2">{student.studentName}</td>
                                <td className="p-2">{student.email}</td>
                                <td className="p-2">{student.rollNumber}</td>
                                <td className="p-2">{student.course}</td>
                                <td className="p-2">{student.graduationYear}</td>
                                <td className="p-2">
                                    <a href={student.resumeURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>
                                </td>
                                <td className={`p-2 font-semibold ${getStatusColor(student.status)}`}>
                                    {student.status}
                                </td>
                                {activeTab.toLowerCase() !== 'pending' && activeTab.toLowerCase() !== 'activated' && (
                                    <td className="p-2">{student.statusReason || '-'}</td>
                                )}
                                <td className="p-2">
                                    <ActionButtons
                                        student={student}
                                        showReasonInput={showReasonInput}
                                        setShowReasonInput={setShowReasonInput}
                                        statusReason={statusReason}
                                        setStatusReason={setStatusReason}
                                        cardErrors={cardErrors}
                                        updateStudentStatus={updateStudentStatus}
                                    />

                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={activeTab.toLowerCase() === 'pending' ? 8 : 9} className="p-4 text-center text-gray-500">
                                    No students found for this tab.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-6 gap-2 flex-wrap">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Students;
