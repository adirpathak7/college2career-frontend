import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLoader } from '../../LoaderContext';
import { FcApproval } from 'react-icons/fc';
import { BiBlock } from 'react-icons/bi';
import PageTitle from '../../PageTitle'


const TABS = [
    { label: 'All', api: '/users/companies/getAllCompanies' },
    { label: 'Pending', api: '/users/companies/getCompanyByPendingStatus' },
    { label: 'Activated', api: '/users/companies/getCompanyByActivatedStatus' },
    { label: 'Rejected', api: '/users/companies/getCompanyByRejectedStatus' },
    { label: 'Deactivated', api: '/users/companies/getCompanyByDeactivatedStatus' },
];

export default function Companies() {
    const [activeTab, setActiveTab] = useState('All');
    const [companies, setCompanies] = useState([]);
    const [apiError, setApiError] = useState('');
    const [statusReason, setStatusReason] = useState('');
    const [showReasonInput, setShowReasonInput] = useState(null);
    const [cardErrors, setCardErrors] = useState({});
    const { setLoading } = useLoader();

    const fetchCompanies = async () => {
        setLoading(true);
        setApiError('');
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
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
        setShowReasonInput(null);
    }, [activeTab]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return "text-yellow-500";
            case 'activated': return "text-green-400";
            case 'rejected': return "text-red-400";
            case 'deactivated': return "text-red-400";
            default: return "text-gray-300";
        }
    }

    const updateCompanyStatus = async (companyId, newStatus, reason = '') => {
        if ((newStatus === 'rejected' || newStatus === 'deactivated') && !reason.trim()) {
            setCardErrors(prev => ({
                ...prev,
                [companyId]: "Please enter a reason."
            }));

            setTimeout(() => {
                setCardErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[companyId];
                    return newErrors;
                });
            }, 2000);
            return;
        }

        try {
            setLoading(true);
            const payload = { companyId, status: newStatus };
            if (newStatus !== 'activated') {
                payload.reasonOfStatus = reason;
            }

            const res = await axios.patch(`${import.meta.env.VITE_BASE_URL}/users/companies/updateCompanyStatus/${companyId}`, payload);

            if (res.data.status) {
                await fetchCompanies();
            } else {
                setApiError("Something went wrong! Please try again.");
            }
        } catch (error) {
            setApiError("Something went wrong! Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <PageTitle title="Companies" />
            <div className="min-h-screen bg-gray-900 text-white py-8 px-4 md:px-12">
                <h1 className="text-3xl font-bold mb-6 text-center">Companies List</h1>

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
                    <div className="mb-4 px-4 py-2 bg-red-600/20 border border-red-500 text-red-400 rounded text-center font-bold">
                        {apiError}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map(company => (
                        <div
                            key={company.companyId}
                            className={`bg-gray-800 rounded-xl p-5 shadow-md transition-all duration-300 ${showReasonInput === company.companyId ? 'min-h-[420px]' : 'min-h-[340px]'}`}
                        >
                            {cardErrors[company.companyId] && (
                                <div className="mb-3 px-3 py-1 bg-red-600/20 border border-red-500 text-red-400 text-sm rounded">
                                    {cardErrors[company.companyId]}
                                </div>
                            )}

                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={company.profilePictureURL || '/default.jpg'}
                                        alt="Company"
                                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                                    />
                                    <div>
                                        <h3 className="text-lg font-bold">{company.companyName}</h3>
                                        <h4 className="text-lg font-bold">{company.email}</h4>
                                        <p className="text-sm text-purple-400">
                                            {company.city}, {company.state}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {company.status === 'pending' ? (
                                        <div className="bg-gray-700 rounded-full p-1.5 shadow-md">
                                            <BiBlock className="text-red-500 w-6 h-6 hover:scale-110 transition" title="pending" />
                                        </div>
                                    ) : company.status === 'activated' ? (
                                        <div className="bg-gray-700 rounded-full p-2 shadow-md">
                                            <FcApproval className="w-6 h-6 hover:scale-110 transition" title="activated" />
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            <div className="text-sm space-y-1">
                                <p><span className="font-semibold text-gray-300">Address:</span> {company.area}</p>
                                <p><span className="font-semibold text-gray-300">Contact:</span> {company.contactNumber}</p>
                                <p><span className="font-semibold text-gray-300">Established:</span> {company.establishedDate}</p>
                                <p><span className="font-semibold text-gray-300">Employees:</span> {company.employeeSize}</p>
                                <p><span className="font-semibold text-gray-300">Status:</span> <span className={getStatusColor(company.status)}>{company.status}</span></p>
                                {company.reasonOfStatus && (
                                    <p><span className="text-red-400 font-semibold">Reason:</span> {company.reasonOfStatus}</p>
                                )}
                            </div>

                            <div className="flex gap-2 mt-4 flex-wrap">
                                {(company.status === 'pending' || company.status === 'rejected' || company.status === 'deactivated') && (
                                    <button
                                        onClick={() => updateCompanyStatus(company.companyId, 'activated')}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-sm rounded"
                                    >
                                        Approve
                                    </button>
                                )}
                                {company.status === 'pending' && (
                                    <button
                                        onClick={() => {
                                            setShowReasonInput(company.companyId);
                                            setStatusReason('');
                                        }}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-sm rounded"
                                    >
                                        Reject
                                    </button>
                                )}
                                {(company.status === 'activated' || company.status === 'rejected') && (
                                    <button
                                        onClick={() => {
                                            setShowReasonInput(company.companyId);
                                            setStatusReason('');
                                        }}
                                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-sm rounded"
                                    >
                                        Deactivate
                                    </button>
                                )}
                            </div>

                            {showReasonInput === company.companyId && (
                                <div className="mt-3 space-y-2">
                                    <textarea
                                        placeholder="Enter reason..."
                                        className="w-full bg-gray-700 border border-gray-600 text-white rounded p-2 resize-none"
                                        rows={3}
                                        value={statusReason}
                                        onChange={(e) => setStatusReason(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const current = company.status;
                                                const newStatus = current === 'pending' ? 'rejected' : 'deactivated';
                                                updateCompanyStatus(company.companyId, newStatus, statusReason);
                                                setShowReasonInput(null);
                                            }}
                                            className="px-4 py-2 bg-red-700 hover:bg-red-800 rounded text-sm"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowReasonInput(null);
                                                setStatusReason('');
                                            }}
                                            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
