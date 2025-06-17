import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import PageTitle from '../../PageTitle';
import { useLoader } from '../../LoaderContext';
import { Dialog } from '@headlessui/react';


const TABS = ['All', 'Pending', 'Accepted', 'Rejected'];

export default function Offers() {
    const [offers, setOffers] = useState([]);
    const [filteredOffers, setFilteredOffers] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [apiError, setApiError] = useState('');
    const { setLoading } = useLoader();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);

    const token = Cookies.get('userToken');

    const fetchOffers = async () => {
        setLoading(true);
        setApiError('');
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/users/interviews/getAllInterviewsByCompanyId`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data?.status && Array.isArray(response.data.data)) {
                const completedOffers = response.data.data.filter(o => o.interviewStatus.toLowerCase() === 'completed');
                setOffers(completedOffers);
                setFilteredOffers(completedOffers);
            } else {
                setOffers([]);
                setFilteredOffers([]);
                setApiError('No offers found.');
            }
        } catch (err) {
            setApiError(err.message || 'Failed to load offers.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    useEffect(() => {
        if (activeTab === 'All') {
            setFilteredOffers(offers);
        } else {
            setFilteredOffers(
                offers.filter(o => o.interviewStatus.toLowerCase() === activeTab.toLowerCase())
            );
        }
    }, [activeTab, offers]);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
            <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">🎁 Job Offers</h1>
            <PageTitle title="Offers" />

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 
                            ${activeTab === tab
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-indigo-100'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Error */}
            {apiError && (
                <div className="mb-4 px-4 py-2 rounded bg-red-100 border border-red-400 text-red-700 text-center font-semibold">
                    {apiError}
                </div>
            )}

            {/* Offers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOffers.map(offer => (
                    <div key={offer.interviewId} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl font-semibold text-gray-800">{offer.vacancyTitle}</h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(offer.interviewStatus)}`}>
                                {offer.interviewStatus.toUpperCase()}
                            </span>
                        </div>

                        <p className="text-gray-600"><span className="font-medium">Student:</span> {offer.studentName}</p>
                        <p className="text-gray-600"><span className="font-medium">Email:</span> {offer.email}</p>
                        <p className="text-gray-600"><span className="font-medium">Date:</span> {offer.interviewDate}</p>
                        <p className="text-gray-600"><span className="font-medium">Time:</span> {offer.interviewTime}</p>
                        <p className="text-gray-600"><span className="font-medium">Company:</span> {offer.companyName}</p>
                        <p className="text-gray-600"><span className="font-medium">Package:</span> {offer.annualPackage}</p>

                        {offer.reason && (
                            <p className="mt-2 text-sm text-yellow-700 bg-yellow-100 p-2 rounded">
                                <span className="font-semibold">Reason:</span> {offer.reason}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'pending': return 'bg-yellow-100 text-yellow-700';
        case 'accepted': return 'bg-green-100 text-green-700';
        case 'rejected': return 'bg-red-100 text-red-700';
        case 'completed': return 'bg-blue-100 text-blue-700';
        default: return 'bg-gray-200 text-gray-800';
    }
}
