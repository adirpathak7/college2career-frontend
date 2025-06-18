import React, { useState, useEffect } from 'react';
import PageTitle from '../../PageTitle';
import ActionButtons from '../HelperComponents/ActionButtons';
import { useLoader } from '../../LoaderContext';
import axios from 'axios'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


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
    const [studentsPerPage, setStudentsPerPage] = useState(5);
    const [cardErrors, setCardErrors] = useState({});
    const { setLoading } = useLoader();

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
        <>
            <PageTitle title="Companies" />
            <div className="py-8 px-4 md:px-12">
                <h1 className="text-3xl font-bold text-[#005acd] mb-8">Students List</h1>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b mb-6 pb-2">
                    <div className="flex gap-4 overflow-x-auto">
                        {TABS.map((tab) => (
                            <button
                                key={tab.label}
                                onClick={() => setActiveTab(tab.label)}
                                className={`px-4 py-2 border-b-2 font-medium whitespace-nowrap ${activeTab === tab.label ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-center my-4">
                        <div className="relative inline-block text-left">
                            <select
                                id="studentsPerPage"
                                value={studentsPerPage}
                                onChange={(e) => setStudentsPerPage(Number(e.target.value))}
                                className="block w-full text-sm px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-150 bg-white text-gray-700"
                            >
                                <option value={5}>Show 5</option>
                                <option value={10}>Show 10</option>
                                <option value={20}>Show 20</option>
                                <option value={50}>Show 50</option>
                            </select>
                        </div>
                    </div>
                </div>

                {apiError && (
                    <div className="mb-4 px-4 py-2 bg-red-100 border border-red-500 text-red-600 rounded text-center">
                        {apiError}
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto border rounded shadow-md">
                    <div className="card">
                        <DataTable
                            value={paginatedStudents}
                            rows={studentsPerPage}
                            onPage={(e) => {
                                setStudentsPerPage(e.rows);
                                setCurrentPage(Math.floor(e.first / e.rows) + 1);
                            }}
                            first={(currentPage - 1) * studentsPerPage}
                            tableStyle={{ minWidth: '50rem' }}
                            responsiveLayout="scroll"
                            emptyMessage="No students found for this tab."
                        >
                            <Column field="rollNumber" header="Roll Number" />
                            <Column field="studentName" header="Name" />
                            <Column field="email" header="Email" />
                            <Column field="course" header="Course" />
                            <Column field="graduationYear" header="Graduation Year" />

                            <Column
                                header="Resume"
                                body={(rowData) => (
                                    <a
                                        href={rowData.resumeURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        View
                                    </a>
                                )}
                            />

                            <Column
                                field="status"
                                header="Status"
                                body={(rowData) => (
                                    <span className={`font-semibold ${getStatusColor(rowData.status)}`}>
                                        {rowData.status}
                                    </span>
                                )}
                            />

                            {(activeTab.toLowerCase() !== 'pending' && activeTab.toLowerCase() !== 'activated') && (
                                <Column
                                    header="Reason"
                                    body={(rowData) => rowData.statusReason || '-'}
                                />
                            )}

                            <Column
                                header="Action"
                                body={(rowData) => (
                                    <ActionButtons
                                        student={rowData}
                                        showReasonInput={showReasonInput}
                                        setShowReasonInput={setShowReasonInput}
                                        statusReason={statusReason}
                                        setStatusReason={setStatusReason}
                                        cardErrors={cardErrors}
                                        updateStudentStatus={updateStudentStatus}
                                    />
                                )}
                            />
                        </DataTable>
                    </div>
                </div>
                <div className="flex justify-center mt-6 gap-2 flex-wrap mb-10">
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
        </>
    );
};

export default Students;
