import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import PageTitle from '../../PageTitle';
import { useLoader } from '../../LoaderContext';
import { Dialog } from '@headlessui/react';
import { jsPDF } from 'jspdf';

const TABS = ['All', 'Pending', 'Accepted', 'Rejected'];

export default function Offers() {
    const [offers, setOffers] = useState([]);
    const [filteredOffers, setFilteredOffers] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [apiError, setApiError] = useState('');
    const [apiMessageType, setApiMessageType] = useState('');
    const { setLoading } = useLoader();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [offerForm, setOfferForm] = useState({
        annualPackage: '',
        joiningDate: '',
        timing: '',
        description: '',
    });

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
                const completedOffers = response.data.data.filter(
                    (o) => o.interviewStatus.toLowerCase() === 'completed'
                );
                setOffers(completedOffers);
                setFilteredOffers(completedOffers);
            } else {
                setOffers([]);
                setFilteredOffers([]);
                setApiError('No offers found.');
                setApiMessageType('error')
            }
        } catch (err) {
            setApiError(err.message || 'Failed to load offers.');
            ('error')
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
                offers.filter((o) => o.interviewStatus.toLowerCase() === activeTab.toLowerCase())
            );
        }
    }, [activeTab, offers]);

    const handleSendOffer = async () => {
        if (!selectedOffer) return;

        const doc = new jsPDF();
        const marginLeft = 20;
        let currentY = 20;

        doc.setFontSize(16);
        doc.text('📄 Offer Letter', marginLeft, currentY);
        currentY += 12;

        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, marginLeft, currentY);
        currentY += 10;

        doc.text(`To: ${selectedOffer.studentName}`, marginLeft, currentY);
        currentY += 8;

        doc.text(`Email: ${selectedOffer.email}`, marginLeft, currentY);
        currentY += 10;

        doc.text(`Subject: Job Offer for ${selectedOffer.vacancyTitle}`, marginLeft, currentY);
        currentY += 12;

        doc.text(`Dear ${selectedOffer.studentName},`, marginLeft, currentY);
        currentY += 10;

        doc.text(
            `We are pleased to offer you the position of ${selectedOffer.vacancyTitle} at ${selectedOffer.companyName}.`,
            marginLeft,
            currentY
        );
        currentY += 10;

        doc.text(`Your annual compensation package will be ${offerForm.annualPackage}.`, marginLeft, currentY);
        currentY += 10;

        doc.text(`Joining Date: ${offerForm.joiningDate || 'TBD'}`, marginLeft, currentY);
        currentY += 8;

        doc.text(`Timing: ${offerForm.timing || '10 AM to 7 PM'}`, marginLeft, currentY);
        currentY += 10;

        doc.text(`Joining Instructions:`, marginLeft, currentY);
        currentY += 8;
        const joiningLines = doc.splitTextToSize(
            offerForm.joiningInstructions ||
            'Please bring all original documents and join as per the mentioned date and time.',
            170
        );
        doc.text(joiningLines, marginLeft, currentY);
        currentY += joiningLines.length * 8;

        if (offerForm.description) {
            currentY += 8;
            doc.text('Additional Notes:', marginLeft, currentY);
            currentY += 8;
            const descLines = doc.splitTextToSize(offerForm.description, 170);
            doc.text(descLines, marginLeft, currentY);
            currentY += descLines.length * 8;
        }

        currentY += 12;
        doc.text('We look forward to working with you.', marginLeft, currentY);
        currentY += 10;

        doc.text('Sincerely,', marginLeft, currentY);
        currentY += 8;
        doc.text(`${selectedOffer.companyName} HR Team`, marginLeft, currentY);

        // Create PDF and send
        const pdfBlob = doc.output('blob');
        const pdfFile = new File([pdfBlob], 'OfferLetter.pdf', { type: 'application/pdf' });

        const formData = new FormData();
        formData.append('annualPackage', offerForm.annualPackage);
        formData.append('position', selectedOffer.vacancyTitle);
        formData.append('joiningDate', offerForm.joiningDate);
        formData.append('timing', offerForm.timing);
        formData.append('description', offerForm.description || '');
        formData.append('offerLetter', pdfFile);
        formData.append('status', 'pending');
        formData.append('applicationId', selectedOffer.applicationId);
        formData.append('companyName', selectedOffer.companyName);
        formData.append('studentName', selectedOffer.studentName);

        try {
            setLoading(true);
            await axios.post(`${import.meta.env.VITE_BASE_URL}/users/offers/newOffers`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            await axios.post(`${import.meta.env.VITE_BASE_URL}/users/interviews/offeredInterview/${selectedOffer.interviewId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setApiError("Offer Letter is sent to the student")
            setOpenDialog(false);
            fetchOffers();
        } catch (err) {
            console.error('Send failed', err);
            setApiError('Something went wrong! ' + err);
            setApiMessageType('error')
        } finally {
            setLoading(false);
        }
    };

    const openOfferDialog = (offer) => {
        setSelectedOffer(offer);
        setOfferForm({
            annualPackage: offer.annualPackage || '',
            joiningDate: offer.joiningDate || '',
            timing: offer.timing || '',
            description: offer.description || '',
            joiningInstructions: offer.joiningInstructions || 'You are expected to join by 1st July, 10:00 AM',
        });
        setIsEditing(false);
        setOpenDialog(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
            <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">🎁 Job Offers</h1>
            <PageTitle title="Offers" />

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === tab
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-indigo-100'
                            }`}
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
                {filteredOffers.map((offer) => (
                    <div
                        key={offer.interviewId}
                        className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl font-semibold text-gray-800">{offer.vacancyTitle}</h2>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                    offer.interviewStatus
                                )}`}
                            >
                                {offer.interviewStatus.toUpperCase()}
                            </span>
                        </div>

                        <p className="text-gray-600">
                            <span className="font-medium">Student:</span> {offer.studentName}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Email:</span> {offer.email}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Date:</span> {offer.interviewDate}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Time:</span> {offer.interviewTime}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Company:</span> {offer.companyName}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Package:</span> {offer.annualPackage}
                        </p>

                        {offer.reason && (
                            <p className="mt-2 text-sm text-yellow-700 bg-yellow-100 p-2 rounded">
                                <span className="font-semibold">Reason:</span> {offer.reason}
                            </p>
                        )}
                        <button
                            onClick={() => openOfferDialog(offer)}
                            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition-all"
                        >
                            Send Offer
                        </button>
                    </div>
                ))}
            </div>

            {/* Offer Letter Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Overlay */}
                    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" aria-hidden="true" />

                    {/* Modal Panel */}
                    <Dialog.Panel className="relative z-50 bg-white max-w-3xl w-full p-6 rounded-xl shadow-xl overflow-y-auto max-h-[90vh]">
                        <Dialog.Title className="text-2xl font-bold text-indigo-700 mb-4 text-center">Offer Letter</Dialog.Title>

                        {selectedOffer && (
                            <div className="text-sm text-gray-800 leading-relaxed space-y-4 border border-dashed p-6 rounded-lg bg-gray-50">
                                <p>
                                    Date: <strong>{new Date().toLocaleDateString()}</strong>
                                </p>

                                <p>
                                    To,
                                    <br />
                                    <strong>{selectedOffer.studentName}</strong>
                                    <br />
                                    Email: {selectedOffer.email}
                                </p>

                                <p>
                                    We are pleased to offer you the position of{' '}
                                    <strong>{selectedOffer.vacancyTitle}</strong> at <strong>{selectedOffer.companyName}</strong>.
                                </p>

                                <div>
                                    <label className="font-medium">Annual Package:</label>
                                    <br />
                                    {isEditing ? (
                                        <input
                                            className="w-full border px-3 py-1 rounded mt-1"
                                            value={offerForm.annualPackage}
                                            onChange={(e) => setOfferForm({ ...offerForm, annualPackage: e.target.value })}
                                        />
                                    ) : (
                                        <p>
                                            <strong>{offerForm.annualPackage || selectedOffer.annualPackage}</strong>
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="font-medium">Joining Date:</label>
                                    <br />
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            className="w-full border px-3 py-1 rounded mt-1"
                                            value={offerForm.joiningDate}
                                            onChange={(e) => setOfferForm({ ...offerForm, joiningDate: e.target.value })}
                                        />
                                    ) : (
                                        <p>{offerForm.joiningDate || 'You are expected to join by 1st July, 10:00 AM'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="font-medium">Timing:</label>
                                    <br />
                                    {isEditing ? (
                                        <input
                                            className="w-full border px-3 py-1 rounded mt-1"
                                            value={offerForm.timing}
                                            onChange={(e) => setOfferForm({ ...offerForm, timing: e.target.value })}
                                        />
                                    ) : (
                                        <p>{offerForm.timing || '10 AM to 7 PM'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="font-medium">Additional Notes:</label>
                                    <br />
                                    {isEditing ? (
                                        <textarea
                                            className="w-full border px-3 py-2 mt-1 rounded"
                                            rows="3"
                                            value={offerForm.description}
                                            onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                                        />
                                    ) : (
                                        <p>{offerForm.description || '—'}</p>
                                    )}
                                </div>

                                <p>
                                    Regards,
                                    <br />
                                    <strong>{selectedOffer.companyName}</strong> HR Team
                                </p>
                            </div>
                        )}

                        <div className="mt-6 flex justify-between gap-4">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="text-indigo-600 hover:underline"
                                    >
                                        Preview
                                    </button>
                                    <div className="ml-auto flex gap-3">
                                        <button
                                            onClick={() => setOpenDialog(false)}
                                            className="text-gray-600 hover:text-gray-800"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSendOffer}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-indigo-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <div className="ml-auto flex gap-3">
                                        <button
                                            onClick={() => setOpenDialog(false)}
                                            className="text-gray-600 hover:text-gray-800"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSendOffer}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}

function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-700';
        case 'accepted':
            return 'bg-green-100 text-green-700';
        case 'rejected':
            return 'bg-red-100 text-red-700';
        case 'completed':
            return 'bg-blue-100 text-blue-700';
        default:
            return 'bg-gray-200 text-gray-800';
    }
}
