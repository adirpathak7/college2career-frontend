import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLoader } from '../../LoaderContext';
import { FcApproval } from 'react-icons/fc';
import { BiBlock } from 'react-icons/bi';
import PageTitle from '../../PageTitle';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const TABS = [
    { label: 'All', api: '/users/companies/getAllCompanies' },
    { label: 'Pending', api: '/users/companies/getCompaniesByPendingStatus' },
    { label: 'Activated', api: '/users/companies/getCompaniesByActivatedStatus' },
    { label: 'Rejected', api: '/users/companies/getCompaniesByRejectedStatus' },
    { label: 'Deactivated', api: '/users/companies/getCompaniesByDeactivatedStatus' },
];

export default function Companies() {
    const [activeTab, setActiveTab] = useState('All');
    const [companies, setCompanies] = useState([]);
    const [apiError, setApiError] = useState('');
    const [cardErrors, setCardErrors] = useState({});
    const { setLoading } = useLoader();
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [dialogError, setDialogError] = useState('');
    const [dialogData, setDialogData] = useState({
        companyId: '',
        companyName: '',
        newStatus: '',
        reason: ''
    });

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

    const openDialog = (companyId, companyName, newStatus) => {
        setDialogData({ companyId, companyName, newStatus, reason: '' });
        setIsDialogVisible(true);
    };

    const handleDialogConfirm = async () => {
        const { companyId, newStatus, reason } = dialogData;

        if ((newStatus === 'rejected' || newStatus === 'deactivated') && !reason.trim()) {
            setDialogError('Reason is required.');
            return;
        }

        try {
            setLoading(true);

            const payload = { companyId, status: newStatus };
            if (newStatus !== 'activated') {
                payload.reasonOfStatus = reason;
            }

            const res = await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/users/companies/updateCompanyStatus/${companyId}`,
                payload
            );

            if (res.data.status) {
                await fetchCompanies();
            } else {
                setApiError("Something went wrong! Please try again.");
            }
        } catch (error) {
            setApiError("Something went wrong! Please try again.");
        } finally {
            setLoading(false);
            setIsDialogVisible(false);
        }
    };

    const handleDialogCancel = () => {
        setIsDialogVisible(false);
    };

    return (
        <>
            <PageTitle title="Companies" />

            {/* Dialog for Reject / Deactivate */}

            <Dialog
                header={`Provide reason to ${dialogData.newStatus}`}
                visible={isDialogVisible}
                onHide={handleDialogCancel}
                footer={
                    <div>
                        <Button label="Cancel" icon="pi pi-times" className="bg-gray-400 px-3 py-1 m-2 rounded text-white" onClick={handleDialogCancel} />
                        <Button label="Confirm" icon="pi pi-check" className='bg-blue-600 px-3 py-1 m-2 rounded text-white' onClick={handleDialogConfirm} />
                    </div>
                }
            >
                <p>Are you sure you want to <b>{dialogData.newStatus}</b> <b>{dialogData.companyName}</b>?</p>
                {(dialogData.newStatus === 'rejected' || dialogData.newStatus === 'deactivated') && (
                    <textarea
                        rows={3}
                        className="w-full mt-3 border rounded p-2"
                        placeholder="Enter reason..."
                        value={dialogData.reason}
                        onChange={(e) => setDialogData(prev => ({ ...prev, reason: e.target.value }))}
                    />
                )}
                {dialogError && (
                    <div className="text-red-500 mt-2 text-sm">{dialogError}</div>
                )}

            </Dialog>

            <div className="py-8 px-4 md:px-12 text-blue-600">
                <h1 className="text-3xl font-bold text-[#005acd] mb-8">Companies List</h1>

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
                    <div className="mb-4 px-4 py-2 bg-red-100 border border-red-400 text-red-600 rounded text-center font-bold">
                        {apiError}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map(company => (
                        <div key={company.companyId} className="bg-white rounded-xl p-5 shadow-md border border-gray-200 min-h-[340px]">
                            {cardErrors[company.companyId] && (
                                <div className="mb-3 px-3 py-1 bg-red-100 border border-red-400 text-red-600 text-sm rounded">
                                    {cardErrors[company.companyId]}
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={company.profilePictureURL || '/default.jpg'}
                                        alt="Company"
                                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-400"
                                    />
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{company.companyName}</h3>
                                        <h4 className="text-sm font-medium text-gray-600">{company.email}</h4>
                                        <p className="text-sm text-blue-500">{company.city}, {company.state}</p>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    {company.status === 'pending' ? (
                                        <BiBlock className="text-red-500 w-6 h-6" title="pending" />
                                    ) : company.status === 'activated' ? (
                                        <FcApproval className="w-6 h-6" title="activated" />
                                    ) : null}
                                </div>
                            </div>

                            <div className="text-sm space-y-1">
                                <p><span className="font-semibold text-gray-600">Address:</span> {company.area}</p>
                                <p><span className="font-semibold text-gray-600">Contact:</span> {company.contactNumber}</p>
                                <p><span className="font-semibold text-gray-600">Established:</span> {company.establishedDate}</p>
                                <p><span className="font-semibold text-gray-600">Employees:</span> {company.employeeSize}</p>
                                <p><span className="font-semibold text-gray-600">Status:</span> <span className={getStatusColor(company.status)}>{company.status}</span></p>
                                {company.reasonOfStatus && (
                                    <p><span className="text-red-500 font-semibold">Reason:</span> {company.reasonOfStatus}</p>
                                )}
                            </div>

                            <div className="flex gap-2 mt-4 flex-wrap">
                                {(company.status === 'pending' || company.status === 'rejected' || company.status === 'deactivated') && (
                                    <button
                                        onClick={() => openDialog(company.companyId, company.companyName, 'activated')}
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
                                    >
                                        Approve
                                    </button>
                                )}
                                {company.status === 'pending' && (
                                    <button
                                        onClick={() => openDialog(company.companyId, company.companyName, 'rejected')}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                                    >
                                        Reject
                                    </button>
                                )}
                                {(company.status === 'activated' || company.status === 'rejected') && (
                                    <button
                                        onClick={() => openDialog(company.companyId, company.companyName, 'deactivated')}
                                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded"
                                    >
                                        Deactivate
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
