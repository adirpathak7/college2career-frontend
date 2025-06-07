import { useRef, useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import message from '../../message.json'
import { useLoader } from '../../LoaderContext';
import PageTitle from '../../PageTitle';
import { BiEdit } from 'react-icons/bi';
const Vacancies = () => {
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const eligibility_criteriaRef = useRef(null);
    const totalVacancyRef = useRef(null);
    const timingRef = useRef(null);
    const packageRef = useRef(null);
    const typeRef = useRef(null);
    const locationTypeRef = useRef(null);
    const { setLoading } = useLoader();
    const [isOpen, setIsOpen] = useState(false);
    const [vacancies, setVacancies] = useState([]);
    const [apiError, setApiError] = useState('');
    const [apiMessageType, setApiMessageType] = useState('');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingVacancy, setEditingVacancy] = useState(null)
    const [inputData, setInputData] = useState({
        title: '',
        description: '',
        eligibility_criteria: '',
        totalVacancy: '',
        timing: '',
        package: '',
        type: '',
        locationType: '',
    });
    const [inputError, setInputError] = useState({
        title: '',
        description: '',
        eligibility_criteria: '',
        totalVacancy: '',
        timing: '',
        package: '',
        type: '',
        locationType: '',
    });
    const fetchVacancies = async () => {
        setLoading(true);
        setApiError('');

        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };

        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/users/companies/getVacanciesByCompanyId`,
                {
                    headers: {
                        "Authorization": "Bearer " + getCookie("userToken")
                    }
                }
            );

            if (res.data?.status && Array.isArray(res.data.data)) {
                setVacancies(res.data.data);
            } else {
                setVacancies([]);
                setApiError("No vacancies found.");
            }
        } catch (err) {
            setVacancies([]);
            setApiError(err.message || "Something went wrong");
            setApiMessageType('error');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchVacancies()
    }, [])
    useEffect(() => {
        if (apiError) {
            const timer = setTimeout(() => {
                setApiError('');
                setApiMessageType('');
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [apiError]);
    const handleChange = (e) => {
        const { name, value } = e.target

        setInputData((preValue) => ({
            ...preValue,
            [name]: value
        }))

        setInputError((preError) => ({
            ...preError,
            [name]: ''
        }))
    }
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;

        setEditingVacancy((prev) => ({
            ...prev,
            [name]: value,
        }));

        setInputError((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };
    const handleCloseModal = () => {
        setIsOpen(false);
        setInputData({
            title: '',
            description: '',
            eligibility_criteria: '',
            totalVacancy: '',
            timing: '',
            package: '',
            type: '',
            locationType: '',
        });
        setInputError({});
        setApiError('');
        setApiMessageType('');
    };
    const handleEditCloseModal = () => {
        setIsEditDialogOpen(false);
        setInputError({});
        setApiError('');
        setApiMessageType('');
        setEditingVacancy(null);
    };
    const getCookie = (name) => {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) return parts.pop().split(';').shift()
        return null
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {}
        const formData = new FormData()
        formData.append('title', inputData.title)
        formData.append('totalVacancy', inputData.totalVacancy)
        formData.append('timing', inputData.timing)
        formData.append('package', inputData.package)
        formData.append('type', inputData.type)
        formData.append('locationType', inputData.locationType)
        formData.append('eligibility_criteria', inputData.eligibility_criteria)
        formData.append('description', inputData.description)
        if (!inputData.title) {
            errors.title = message.empty + 'title!'
        }
        if (!inputData.totalVacancy) {
            errors.totalVacancy = message.empty + 'total vacancy!'
        }
        if (!inputData.package) {
            errors.package = message.empty + 'annual package!'
        }
        if (!inputData.type) {
            errors.type = message.defaultOption + 'job type!'
        }
        if (!inputData.locationType) {
            errors.locationType = message.defaultOption + 'location type!'
        }
        if (!inputData.eligibility_criteria) {
            errors.eligibility_criteria = message.empty + 'eligibility criteria!'
        }
        if (!inputData.description) {
            errors.description = message.empty + 'description!'
        }
        setInputError(errors)
        if (Object.keys(errors).length > 0) {
            setApiError('');
            setApiMessageType('');
            if (errors.title && titleRef.current) {
                titleRef.current.focus()
            } else if (errors.totalVacancy && totalVacancyRef.current) {
                totalVacancyRef.current.focus()
            } else if (errors.timing && timingRef.current) {
                timingRef.current.focus()
            } else if (errors.package && packageRef.current) {
                packageRef.current.focus()
            } else if (errors.type && typeRef.current) {
                typeRef.current.focus()
            } else if (errors.locationType && locationTypeRef.current) {
                locationTypeRef.current.focus()
            } else if (errors.eligibility_criteria && eligibility_criteriaRef.current) {
                eligibility_criteriaRef.current.focus()
            } else if (errors.description && descriptionRef.current) {
                descriptionRef.current.focus()
            }
            return
        }
        setLoading(true)
        try {
            setLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/users/companies/createVacancies`,
                formData, {
                headers: {
                    "Authorization": "Bearer " + getCookie("userToken")
                },
            }).then((response) => {

                if (response.data.status === false) {
                    setApiError(response.data.message)
                    setInputData({
                        title: '',
                        description: '',
                        eligibility_criteria: '',
                        totalVacancy: '',
                        timing: '',
                        package: '',
                        type: '',
                        locationType: '',
                    });
                    setApiMessageType('error');
                    setIsOpen(false);
                } else {
                    setApiError(response.data.message)
                    setInputData({
                        title: '',
                        description: '',
                        eligibility_criteria: '',
                        totalVacancy: '',
                        timing: '',
                        package: '',
                        type: '',
                        locationType: '',
                    });
                    setApiMessageType('success');
                    setIsOpen(false);
                }
            })
        } catch (err) {
            console.error("Vacancy create failed:", err);
            setApiMessageType('error');
            setApiError("Something went wrong!")
            setIsOpen(false);
        } finally {
            setLoading(false);
        }
    };
    const handleEditClick = (v) => {
        setEditingVacancy({
            ...v,
            vacancyId: v.vacancyId
        });
        setIsEditDialogOpen(true);
    };
    const handleEditVacancy = async (e) => {
        e.preventDefault()
        const errors = {}
        if (!editingVacancy.title) {
            errors.title = message.empty + 'title!'
        }
        if (!editingVacancy.totalVacancy) {
            errors.totalVacancy = message.empty + 'total vacancy!'
        }
        if (!editingVacancy.package) {
            errors.package = message.empty + 'annual package!'
        }
        if (!editingVacancy.type) {
            errors.type = message.defaultOption + 'job type!'
        }
        if (!editingVacancy.locationType) {
            errors.locationType = message.defaultOption + 'location type!'
        }
        if (!editingVacancy.eligibility_criteria) {
            errors.eligibility_criteria = message.empty + 'eligibility criteria!'
        }
        if (!editingVacancy.description) {
            errors.description = message.empty + 'description!'
        }
        setInputError(errors)
        if (Object.keys(errors).length > 0) {
            setApiError('');
            setApiMessageType('');
            if (errors.title && titleRef.current) {
                titleRef.current.focus()
            } else if (errors.totalVacancy && totalVacancyRef.current) {
                totalVacancyRef.current.focus()
            } else if (errors.timing && timingRef.current) {
                timingRef.current.focus()
            } else if (errors.package && packageRef.current) {
                packageRef.current.focus()
            } else if (errors.type && typeRef.current) {
                typeRef.current.focus()
            } else if (errors.locationType && locationTypeRef.current) {
                locationTypeRef.current.focus()
            } else if (errors.eligibility_criteria && eligibility_criteriaRef.current) {
                eligibility_criteriaRef.current.focus()
            } else if (errors.description && descriptionRef.current) {
                descriptionRef.current.focus()
            }
            return
        }

        setLoading(true)
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/users/companies/updateCompanyVacanciesByVacancyId/${editingVacancy.vacancyId}`,
                editingVacancy, {
                headers: {
                    "Authorization": "Bearer " + getCookie("userToken")
                },
            }).then((response) => {
                if (response.data.status === false) {
                    setApiError(response.data.message)
                    setApiMessageType('error');
                    setIsEditDialogOpen(false);
                } else {
                    setApiError(response.data.message)
                    setApiMessageType('success');
                    setIsEditDialogOpen(false);
                }
            })
        } catch (error) {
            console.error('Error updating vacancy:', error)
            setApiMessageType('error');
            setApiError("Something went wrong!")
            setIsEditDialogOpen(false)
        } finally {
            setLoading(false);
            fetchVacancies()
        }
    }
    return (
        <>
            <PageTitle title="Companies" />
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
            <div className="min-h-screen bg-gray-100 py-6 px-4 md:px-10 text-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Posted Vacancies</h2>
                    <button
                        title='Add New Vacancy'
                        onClick={() => setIsOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        + Add New Vacancy
                    </button>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {vacancies.length === 0 ? (
                        <p className="text-gray-500">No vacancies posted yet.</p>
                    ) : (
                        vacancies.map((v, idx) => (
                            < div
                                key={idx}
                                className="bg-white border rounded-lg p-6 shadow hover:shadow-md transition-shadow duration-300"
                            >
                                <div className='flex justify-end text-blue-700'>
                                    <BiEdit title='Edit Vacancy' className='w-8 h-6 cursor-pointer' onClick={() => handleEditClick(v)} />
                                </div>
                                <h3 className="text-xl font-semibold text-blue-800">{v.title}</h3>
                                <p className="text-sm text-gray-700 mt-2">{v.description}</p>
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-1">Eligibility Criteria:</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        {v.eligibility_criteria?.split('\n').map((item, i) => (
                                            <li key={i}>{item.trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-4 space-y-1 text-sm text-gray-700">
                                    <p><strong>Type:</strong> {v.type}</p>
                                    <p><strong>Location:</strong> {v.locationType}</p>
                                    <p><strong>Annual Package:</strong> {v.package}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <Dialog open={isOpen} onClose={handleCloseModal} className="relative z-50">
                    <div className="fixed inset-0 bg-black/75" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
                        <Dialog.Panel className="relative w-full max-w-2xl bg-white rounded-xl p-6 shadow-lg my-10">
                            <Dialog.Title className="text-xl font-bold mb-4 text-center">Add New Vacancy</Dialog.Title>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Job Title */}
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            ref={titleRef}
                                            value={inputData.title}
                                            onChange={handleChange}
                                            placeholder="e.g. Software Engineer"
                                            className="input-field"
                                        />
                                        {inputError.title && <p className="text-sm text-red-600 mt-1">{inputError.title}</p>}
                                    </div>

                                    {/* Total Vacancies */}
                                    <div>
                                        <label htmlFor="totalVacancy" className="block text-sm font-medium text-gray-700 mb-1">Total Vacancies</label>
                                        <input
                                            type="number"
                                            name="totalVacancy"
                                            id="totalVacancy"
                                            ref={totalVacancyRef}
                                            value={inputData.totalVacancy}
                                            onChange={handleChange}
                                            placeholder="e.g. 5"
                                            className="input-field"
                                        />
                                        {inputError.totalVacancy && <p className="text-sm text-red-600 mt-1">{inputError.totalVacancy}</p>}
                                    </div>

                                    {/* Package */}
                                    <div>
                                        <label htmlFor="package" className="block text-sm font-medium text-gray-700 mb-1">Annual Package</label>
                                        <input
                                            type="text"
                                            name="package"
                                            id="package"
                                            ref={packageRef}
                                            value={inputData.package}
                                            onChange={handleChange}
                                            placeholder="e.g. 7 LPA"
                                            className="input-field"
                                        />
                                        {inputError.package && <p className="text-sm text-red-600 mt-1">{inputError.package}</p>}
                                    </div>

                                    {/* Job Type */}
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                                        <select
                                            name="type"
                                            id="type"
                                            ref={typeRef}
                                            value={inputData.type}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="">Select Job Type</option>
                                            <option value="fulltime">Full-Time</option>
                                            <option value="parttime">Part-Time</option>
                                            <option value="internship">Internship</option>
                                        </select>
                                        {inputError.type && <p className="text-sm text-red-600 mt-1">{inputError.type}</p>}
                                    </div>

                                    {/* Location Type */}
                                    <div>
                                        <label htmlFor="locationType" className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
                                        <select
                                            name="locationType"
                                            id="locationType"
                                            ref={locationTypeRef}
                                            value={inputData.locationType}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="">Select Location Type</option>
                                            <option value="onsite">Onsite</option>
                                            <option value="remote">Remote</option>
                                            <option value="hybrid">Hybrid</option>
                                        </select>
                                        {inputError.locationType && <p className="text-sm text-red-600 mt-1">{inputError.locationType}</p>}
                                    </div>
                                </div>

                                {/* Eligibility Criteria */}
                                <div>
                                    <label htmlFor="eligibility_criteria" className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
                                    <textarea
                                        name="eligibility_criteria"
                                        id="eligibility_criteria"
                                        ref={eligibility_criteriaRef}
                                        value={inputData.eligibility_criteria}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="e.g. B.Tech in CS, Minimum 2 years experience, Good communication skills"
                                        className="input-field w-full"
                                    />
                                    {inputError.eligibility_criteria && <p className="text-sm text-red-600 mt-1">{inputError.eligibility_criteria}</p>}
                                </div>

                                {/* Job Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                                    <textarea
                                        name="description"
                                        id="description"
                                        ref={descriptionRef}
                                        value={inputData.description}
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="e.g. Responsible for frontend development using React, collaborating with backend team, writing clean code."
                                        className="input-field w-full"
                                    />
                                    {inputError.description && <p className="text-sm text-red-600 mt-1">{inputError.description}</p>}
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Add Vacancy
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </div>
                </Dialog>
                {editingVacancy &&
                    (
                        <Dialog open={isEditDialogOpen} onClose={handleEditCloseModal} className="relative z-50 ">
                            <div className="fixed inset-0 bg-black/75 " aria-hidden="true" />
                            <div className="fixed inset-0 top-10 w-full h-[100vh] hide-scrollbar  flex items-center justify-center p-4 overflow-y-auto">
                                <Dialog.Panel className="relative w-full max-w-2xl bg-white rounded-xl p-6 shadow-lg my-10">
                                    <Dialog.Title className="text-xl font-bold mb-4 text-center">Edit Vacancy</Dialog.Title>
                                    <form onSubmit={handleEditVacancy} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Job Title */}
                                            <div>
                                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={editingVacancy.title}
                                                    onChange={handleEditInputChange}
                                                    ref={timingRef}
                                                    className="input-field"
                                                />
                                                {inputError.title && <p className="text-sm text-red-600 mt-1">{inputError.title}</p>}
                                            </div>
                                            {/* Total Vacancies */}
                                            <div>
                                                <label htmlFor="totalVacancy" className="block text-sm font-medium text-gray-700 mb-1">Total Vacancies</label>
                                                <input
                                                    type="number"
                                                    name="totalVacancy"
                                                    value={editingVacancy.totalVacancy}
                                                    onChange={handleEditInputChange}
                                                    ref={totalVacancyRef}
                                                    className="input-field"
                                                />
                                                {inputError.totalVacancy && <p className="text-sm text-red-600 mt-1">{inputError.totalVacancy}</p>}
                                            </div>
                                            {/* Package */}
                                            <div>
                                                <label htmlFor="package" className="block text-sm font-medium text-gray-700 mb-1">Annual Package</label>
                                                <input
                                                    type="text"
                                                    name="package"
                                                    value={editingVacancy.package}
                                                    onChange={handleEditInputChange}
                                                    ref={packageRef}
                                                    className="input-field"
                                                />
                                                {inputError.package && <p className="text-sm text-red-600 mt-1">{inputError.package}</p>}
                                            </div>
                                            {/* Job Type */}
                                            <div>
                                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                                                <select
                                                    name="type"
                                                    value={editingVacancy.type}
                                                    onChange={handleEditInputChange}
                                                    ref={typeRef}
                                                    className="input-field"
                                                >
                                                    <option value="">Select Job Type</option>
                                                    <option value="fulltime">Full-Time</option>
                                                    <option value="parttime">Part-Time</option>
                                                    <option value="internship">Internship</option>
                                                </select>
                                                {inputError.type && <p className="text-sm text-red-600 mt-1">{inputError.type}</p>}
                                            </div>
                                            {/* Location Type */}
                                            <div>
                                                <label htmlFor="locationType" className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
                                                <select
                                                    name="locationType"
                                                    value={editingVacancy.locationType}
                                                    onChange={handleEditInputChange}
                                                    ref={locationTypeRef}
                                                    className="input-field"
                                                >
                                                    <option value="">Select Location Type</option>
                                                    <option value="onsite">Onsite</option>
                                                    <option value="remote">Remote</option>
                                                    <option value="hybrid">Hybrid</option>
                                                </select>
                                                {inputError.locationType && <p className="text-sm text-red-600 mt-1">{inputError.locationType}</p>}
                                            </div>
                                        </div>
                                        {/* Eligibility Criteria */}
                                        <div>
                                            <label htmlFor="eligibility_criteria" className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
                                            <textarea
                                                name="eligibility_criteria"
                                                value={editingVacancy.eligibility_criteria}
                                                onChange={handleEditInputChange}
                                                ref={eligibility_criteriaRef}
                                                rows={4}
                                                className="input-field w-full"
                                            />
                                            {inputError.eligibility_criteria && <p className="text-sm text-red-600 mt-1">{inputError.eligibility_criteria}</p>}
                                        </div>
                                        {/* Job Description */}
                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                                            <textarea
                                                name="description"
                                                value={editingVacancy.description}
                                                onChange={handleEditInputChange}
                                                ref={descriptionRef}
                                                rows={5}
                                                className="input-field w-full"
                                            />
                                            {inputError.description && <p className="text-sm text-red-600 mt-1">{inputError.description}</p>}
                                        </div>
                                        {/* Status */}
                                        <div>
                                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                            <select
                                                name="status"
                                                value={editingVacancy.status}
                                                onChange={handleEditInputChange}
                                                className="input-field"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="hiring">Hiring</option>
                                                <option value="hired">Hired</option>
                                            </select>
                                        </div>
                                        {/* Buttons */}
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditDialogOpen(false)}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Add Vacancy
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </div>
                        </Dialog>
                    )}
            </div >
        </>
    );
};
export default Vacancies;