import { useRef, useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import message from '../../message.json'
import { useLoader } from '../../LoaderContext';
import PageTitle from '../../PageTitle';

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
            setApiError(err.response?.data?.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // setLoading(true)
        fetchVacancies()
    }, [])

    useEffect(() => {
        // setLoading(true)
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
        if (!inputData.timing) {
            errors.timing = message.empty + 'timing!'
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

        const getCookie = (name) => {
            const value = `; ${document.cookie}`
            const parts = value.split(`; ${name}=`)
            if (parts.length === 2) return parts.pop().split(';').shift()
            return null
        }

        try {
            setLoading(true);

            const response = await axios.post(
                'http://localhost:7072/api/college2career/users/companies/createVacancies',
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
                        onClick={() => setIsOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        + Add New Vacancy
                    </button>
                </div>


                <div className="grid gap-4 md:grid-cols-2">
                    {vacancies.length === 0 ? (
                        <p className="text-gray-500">No vacancies posted yet.</p>
                    ) : (
                        vacancies.map((v, idx) => (
                            <div
                                key={idx}
                                className="bg-white border rounded-lg p-4 shadow-sm"
                            >
                                <h3 className="text-lg font-semibold text-blue-700">{v.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{v.description}</p>
                                <p className="mt-2 text-sm"><strong>Type:</strong> {v.type}</p>
                                <p className="text-sm"><strong>Location:</strong> {v.locationType}</p>
                                <p className="text-sm"><strong>Annual Package:</strong> {v.package}</p>
                                {/* <p className="text-sm"><strong>Timing:</strong> {v.timing}</p> */}
                            </div>
                        ))
                    )}
                </div>


                <Dialog open={isOpen} onClose={handleCloseModal} className="relative z-50">
                    <div className="fixed inset-0 bg-black/90" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="mx-auto w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
                            <Dialog.Title className="text-xl font-bold mb-4">Add New Vacancy</Dialog.Title>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            name="title"
                                            ref={titleRef}
                                            value={inputData.title}
                                            onChange={handleChange}
                                            placeholder="Job Title"
                                            className={`input-field`}
                                        />
                                        {inputError.title && <p className="text-sm text-red-600 mt-1">{inputError.title}</p>}
                                    </div>

                                    <div>
                                        <input
                                            type="number"
                                            name="totalVacancy"
                                            ref={totalVacancyRef}
                                            value={inputData.totalVacancy}
                                            onChange={handleChange}
                                            placeholder="Total Vacancies"
                                            className={`input-field`}
                                        />
                                        {inputError.totalVacancy && <p className="text-sm text-red-600 mt-1">{inputError.totalVacancy}</p>}
                                    </div>

                                    {/* <div>
                                        <input
                                            type="text"
                                            name="timing"
                                            ref={timingRef}
                                            value={inputData.timing}
                                            onChange={handleChange}
                                            placeholder="Timing"
                                            className={`input-field`}
                                        />
                                        {inputError.timing && <p className="text-sm text-red-600 mt-1">{inputError.timing}</p>}
                                    </div> */}

                                    <div>
                                        <input
                                            type="text"
                                            name="package"
                                            ref={packageRef}
                                            value={inputData.package}
                                            onChange={handleChange}
                                            placeholder="Annual Package"
                                            className={`input-field`}
                                        />
                                        {inputError.package && <p className="text-sm text-red-600 mt-1">{inputError.package}</p>}
                                    </div>

                                    <div>
                                        <select
                                            name="type"
                                            ref={typeRef}
                                            value={inputData.type}
                                            onChange={handleChange}
                                            className={`input-field`}
                                        >
                                            <option value="">Select Job Type</option>
                                            <option value="fulltime">Full-Time</option>
                                            <option value="parttime">Part-Time</option>
                                            <option value="internship">Internship</option>
                                        </select>
                                        {inputError.type && <p className="text-sm text-red-600 mt-1">{inputError.type}</p>}
                                    </div>

                                    <div>
                                        <select
                                            name="locationType"
                                            ref={locationTypeRef}
                                            value={inputData.locationType}
                                            onChange={handleChange}
                                            className={`input-field`}
                                        >
                                            <option value="">Select Location Type</option>
                                            <option value="onsite">Onsite</option>
                                            <option value="remote">Remote</option>
                                            <option value="hybrid">Hybrid</option>
                                        </select>
                                        {inputError.locationType && <p className="text-sm text-red-600 mt-1">{inputError.locationType}</p>}
                                    </div>
                                </div>

                                <div>
                                    <textarea
                                        name="eligibility_criteria"
                                        ref={eligibility_criteriaRef}
                                        value={inputData.eligibility_criteria}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Eligibility Criteria"
                                        className={`input-field w-full`}
                                    />
                                    {inputError.eligibility_criteria && <p className="text-sm text-red-600 mt-1">{inputError.eligibility_criteria}</p>}
                                </div>

                                <div>
                                    <textarea
                                        name="description"
                                        ref={descriptionRef}
                                        value={inputData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Job Description"
                                        className={`input-field w-full`}
                                    />
                                    {inputError.description && <p className="text-sm text-red-600 mt-1">{inputError.description}</p>}
                                </div>

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
            </div>
        </>
    );
};

export default Vacancies;
