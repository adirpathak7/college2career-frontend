import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TABS = [
    { label: 'All', api: '/users/companies/getCompanyAllCompanies' },
    { label: 'Pending', api: '/users/companies/getCompanyByPendingStatus' },
    { label: 'Activated', api: '/users/companies/getCompanyByActivatedStatus' },
    { label: 'Rejected', api: '/users/companies/getCompanyByRejectedStatus' },
    { label: 'Deactivated', api: '/users/companies/getCompanyByDeactivatedStatus' },
];

export default function Companies() {
    const [activeTab, setActiveTab] = useState('All');
    const [companies, setCompanies] = useState([]);
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [applications, setApplications] = useState([])

    useEffect(() => {
        const fetchCompanies = async () => {
            setIsLoading(true)
            setApiError('')
            try {
                const tab = TABS.find(t => t.label === activeTab);
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}${tab.api}`);
                if (res.data?.status && Array.isArray(res.data.data)) {
                    setCompanies(res.data.data);
                } else {
                    setCompanies([]);
                    setApiError("No companies found.");
                }
            } catch (err) {
                setCompanies([]);
                setApiError(err.message || "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanies();
    }, [activeTab]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return "text-yellow-500";
            case 'activated': return "text-green-400";
            case 'rejected': return "text-red-400";
            case 'deactivated': return "text-red-400";
            default: return "text-gray-300";
        }
    };

    const handleApprove = async (companyId) => {
        try {
            setIsLoading(true)
            const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/users/companies/updateCompanyStatus/${companyId}`, {
                companyId,
                status: "activated",
            })

            if (response.data.status) {
                alert("Company approved successfully.")
                setApplications(prev => prev.filter(c => c.companyId !== companyId))
            } else {
                alert("Approval failed!")
                console.log(response.data.message)
            }
        } catch (error) {
            console.log("Somthing went wrong! " + error)
        } finally {
            setIsLoading(false)
        }
        // fetchCompanies()
    }

    const handleReject = async (companyId) => {
        const rejectReason = prompt("Please enter the reject reason!")
        if (!rejectReason) return

        try {
            setIsLoading(true)
            const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/users/companies/updateCompanyStatus/${companyId}`, {
                companyId,
                status: "rejected",
                reasonOfStatus: rejectReason
            })

            if (response.data.status) {
                alert("Company rejected successfully.")
                setApplications(prev => prev.filter(c => c.companyId !== companyId))
            } else {
                console.log("Rejection failed! " + response.data.message)
            }
        } catch (error) {
            console.log("Somthing went wrong! " + error)
        } finally {
            setIsLoading(false)
        }

    }

    return (
        <div className="min-h-screen bg-gray-900 text-white py-8 px-4 md:px-12">
            <h1 className="text-3xl font-bold mb-6">Companies</h1>

            <div className="flex gap-4 mb-8 border-b border-gray-700">
                {TABS.map(tab => (
                    <button
                        key={tab.label}
                        onClick={() => setActiveTab(tab.label)}
                        className={`pb-2 text-lg font-medium ${activeTab === tab.label
                            ? 'border-b-2 border-purple-500 text-purple-400'
                            : 'text-gray-400 hover:text-purple-300'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {apiError && (
                <div className="mb-4 px-4 py-2 bg-red-600/20 border border-red-500 text-red-400 rounded">
                    {apiError}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map(company => (
                    <div key={company.companyId} className="bg-gray-800 rounded-xl p-5 shadow-md">
                        <div className="flex items-center space-x-4 mb-3">
                            <img
                                src={company.profilePictureURL || '/default.jpg'}
                                alt="Company"
                                className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                            />
                            <div>
                                <h3 className="text-lg font-bold">{company.companyName}</h3>
                                <p className="text-sm text-purple-400">
                                    {company.city}, {company.state}
                                </p>
                            </div>
                        </div>

                        <div className="text-sm space-y-1">
                            <p><span className="font-semibold text-gray-300">Area:</span> {company.area}</p>
                            <p><span className="font-semibold text-gray-300">Contact:</span> {company.contactNumber}</p>
                            <p><span className="font-semibold text-gray-300">Established:</span> {company.establishedDate}</p>
                            <p><span className="font-semibold text-gray-300">Employees:</span> {company.employeeSize}</p>
                            <p><span className="font-semibold text-gray-300">Status:</span> <span className={getStatusColor(company.status)}>{company.status}</span></p>
                            {company.reasonOfStatus && (
                                <p><span className="text-red-400 font-semibold">Reason:</span> {company.reasonOfStatus}</p>
                            )}
                        </div>

                        {
                            company.status === 'pending' && (
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleApprove(company.companyId)}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-sm rounded"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() => handleReject(company.companyId)}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-sm rounded"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )
                        }{
                            company.status === 'activated' && (
                                <div className="flex gap-2 mt-4">
                                    <button
                                        // onClick={() => handleReject(company.companyId)}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-sm rounded"
                                    >
                                        Deactivate
                                    </button>
                                </div>
                            )
                        }{
                            company.status === 'rejected' && (
                                <div className="flex gap-2 mt-4">
                                    <button
                                        // onClick={() => handleReject(company.companyId)}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-sm rounded"
                                    >
                                        Approve
                                    </button>
                                </div>
                            )
                        }{
                            company.status === 'deactivated' && (
                                <div className="flex gap-2 mt-4">
                                    <button
                                        // onClick={() => handleReject(company.companyId)}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-sm rounded"
                                    >
                                        Active
                                    </button>
                                </div>
                            )
                        }
                    </div>
                ))}
            </div>
        </div>
    );
}
