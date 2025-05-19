import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import message from '../../message.json'
import { useLoader } from '../../LoaderContext'
import axios from 'axios'


export default function CreateProfileModel() {

    const navigate = useNavigate()

    const companyNameRef = useRef(null)
    const establishedDateRef = useRef(null)
    const contactNumberRef = useRef(null)
    const profilePictureRef = useRef(null)
    const industryRef = useRef(null)
    const areaRef = useRef(null)
    const cityRef = useRef(null)
    const stateRef = useRef(null)
    const employeeSizeRef = useRef(null)

    const { setLoading } = useLoader()

    const [inputData, setInputData] = useState({
        companyName: '',
        establishedDate: '',
        contactNumber: '',
        profilePicture: null,
        industry: '',
        area: '',
        city: '',
        state: '',
        employeeSize: '',
    })

    const [inputError, setInputError] = useState({
        companyName: '',
        establishedDate: '',
        contactNumber: '',
        profilePicture: null,
        industry: '',
        area: '',
        city: '',
        state: '',
        employeeSize: ''
    })

    const [apiResponse, setApiResponse] = useState({
        message: '',
        type: ''
    })

    const handleInputChange = (e) => {
        const { name, value, files } = e.target

        if (name === 'profilePicture') {
            setInputData((prev) => ({
                ...prev,
                profilePicture: files[0] || null,
            }))
        } else {
            setInputData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }

        setInputError((prev) => ({
            ...prev,
            [name]: '',
        }))

        setApiResponse({ message: '', type: '' })
    }


    const handleClose = () => {
        setApiResponse({ message: '', type: '' })
    }

    useEffect(() => {
        if (apiResponse.message) {
            const timer = setTimeout(() => {
                setApiResponse({ message: '', type: '' })
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [apiResponse])

    const handleBack = () => {
        navigate('/user/dashboard/profile')
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const errors = {}
        const formData = new FormData()
        const fileInput = document.getElementById("profilePicture")

        // we can do via loop
        formData.append('companyName', inputData.companyName)
        formData.append('establishedDate', inputData.establishedDate)
        formData.append('contactNumber', inputData.contactNumber)
        formData.append("profilePicture", fileInput.files[0])
        formData.append('industry', inputData.industry)
        formData.append('area', inputData.area)
        formData.append('city', inputData.city)
        formData.append('state', inputData.state)
        formData.append('employeeSize', inputData.employeeSize)

        if (!inputData.companyName) {
            errors.companyName = message.empty + 'company name'
        }
        if (!inputData.establishedDate) {
            errors.establishedDate = message.empty + 'established date'
        }
        if (!inputData.contactNumber) {
            errors.contactNumber = message.empty + 'contact number'
        }
        if (inputData.contactNumber.length !== 10) {
            errors.contactNumber = message.invalidContactNumber
        }
        if (!inputData.profilePicture) {
            errors.profilePicture = message.empty + 'profile picture'
        }
        if (!inputData.industry || inputData.industry === "default") {
            errors.industry = message.empty + 'industry'
        }
        if (!inputData.area) {
            errors.area = message.empty + 'area'
        }
        if (!inputData.city) {
            errors.city = message.empty + 'city'
        }
        if (!inputData.state) {
            errors.state = message.empty + 'state'
        }
        if (!inputData.employeeSize) {
            errors.employeeSize = message.empty + 'employeeSize'
        }

        setInputError(errors)

        if (Object.keys(errors).length > 0) {
            if (errors.companyName && companyNameRef.current) {
                companyNameRef.current.focus()
            } else if (errors.establishedDate && establishedDateRef.current) {
                establishedDateRef.current.focus()
            } else if (errors.contactNumber && contactNumberRef.current) {
                contactNumberRef.current.focus()
            } else if (errors.profilePicture && profilePictureRef.current) {
                profilePictureRef.current.focus()
            } else if (errors.industry && industryRef.current) {
                industryRef.current.focus()
            } else if (errors.area && areaRef.current) {
                areaRef.current.focus()
            } else if (errors.city && cityRef.current) {
                cityRef.current.focus()
            } else if (errors.state && stateRef.current) {
                stateRef.current.focus()
            } else if (errors.employeeSize && employeeSizeRef.current) {
                employeeSizeRef.current.focus()
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

        axios.post(`${import.meta.env.VITE_BASE_URL}/users/companies/createCompanyProfile`, formData, {
            headers: {
                "Authorization": "Bearer " + getCookie("userToken")
            },
        })
            .then((response) => {
                console.log("api response:", response.data)
                if (response.data.status === false) {
                    setApiResponse({
                        message: response.data.message,
                        type: 'error',
                    })
                    setInputData({
                        companyName: '',
                        establishedDate: '',
                        contactNumber: '',
                        profilePicture: null,
                        industry: '',
                        area: '',
                        city: '',
                        state: '',
                        employeeSize: '',
                    })
                } else {
                    setApiResponse({
                        message: response.data.message,
                        type: 'success',
                    })
                    setInputData({
                        companyName: '',
                        establishedDate: '',
                        contactNumber: '',
                        profilePicture: null,
                        industry: '',
                        area: '',
                        city: '',
                        state: '',
                        employeeSize: '',
                    })
                }
            })
            .catch((error) => {
                console.log("Error occurred: ", error)
                setApiResponse({
                    message: "Something went wrong.",
                    type: 'error',
                })
                setInputData({
                    companyName: '',
                    establishedDate: '',
                    contactNumber: '',
                    profilePicture: null,
                    industry: '',
                    area: '',
                    city: '',
                    state: '',
                    employeeSize: '',
                })
            }).finally(() => {
                setTimeout(() => {
                    setLoading(false)
                }, 1500)
            })
    }
    return (
        <>
            <div className="w-full h-full bg-gray-900 text-white py-10 px-4 md:px-10">
                <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8">
                    {apiResponse.message && (
                        <div
                            className={`${apiResponse.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'
                                } px-4 py-3 rounded relative mb-4`}
                            role="alert"
                        >
                            <strong className="font-bold">{apiResponse.type === 'success' ? 'Success: ' : 'Error: '}</strong>
                            <span className="block sm:inline">{apiResponse.message}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={handleClose}>
                                <strong>
                                    <svg className="fill-current h-6 w-6 text-red-700" role="button" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                                        <title>Close</title>
                                        <path d="M18 6L6 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6 6L18 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </strong>
                            </span>
                        </div>
                    )}

                    <h2 className="text-3xl font-bold mb-6 text-center">Edit Profile</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-1">Company Name</label>
                                <input
                                    value={inputData.companyName}
                                    onChange={handleInputChange}
                                    ref={companyNameRef}
                                    placeholder='Enter the company name'
                                    type="text"
                                    id='companyName'
                                    name="companyName"
                                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                {inputError.companyName && <span className="text-red-600">{inputError.companyName}</span>}
                            </div>

                            <div>
                                <label className="block mb-1">Established Date</label>
                                <input
                                    value={inputData.establishedDate}
                                    onChange={handleInputChange}
                                    ref={establishedDateRef}
                                    max={new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0]}
                                    type="date"
                                    id='establishedDate'
                                    name="establishedDate"
                                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                {inputError.establishedDate && <span className="text-red-600">{inputError.establishedDate}</span>}
                            </div>

                            <div>
                                <label className="block mb-1">Contact Number</label>
                                <input
                                    value={inputData.contactNumber}
                                    onChange={handleInputChange}
                                    ref={contactNumberRef}
                                    type="number"
                                    id='contactNumber'
                                    name="contactNumber"
                                    placeholder='0264-1234567'
                                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                {inputError.contactNumber && <span className="text-red-600">{inputError.contactNumber}</span>}
                            </div>

                            <div>
                                <label className="block mb-1">Profile Picture URL</label>
                                <input
                                    onChange={handleInputChange}
                                    ref={profilePictureRef}
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    id='profilePicture'
                                    name="profilePicture"
                                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                {inputError.profilePicture && <span className="text-red-600">{inputError.profilePicture}</span>}
                            </div>

                            <div>
                                <label className="block mb-1">Industry</label>
                                <select
                                    name="industry"
                                    id="industry"
                                    value={inputData.industry}
                                    onChange={handleInputChange}
                                    ref={industryRef}
                                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="default">Select the Industry</option>
                                    <option value="Information Technology (IT)">Information Technology (IT)</option>
                                    <option value="Cybersecurity">Cybersecurity</option>
                                    <option value="Cloud Computing">Cloud Computing</option>
                                    <option value="Software Development">Software Development</option>
                                    <option value="Artificial Intelligence / Machine Learning">Artificial Intelligence / Machine Learning</option>
                                    <option value="IT Services & Consulting">IT Services & Consulting</option>
                                    <option value="Web & App Development">Web & App Development</option>
                                    <option value="Investment & Asset Management">Investment & Asset Management</option>
                                    <option value="Data Science / Analytics">Data Science / Analytics</option>
                                </select>
                                {/* <input

                                    type="text"
                                    id='industry'
                                    name="industry"
                                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" /> */}
                                {inputError.industry && <span className="text-red-600">{inputError.industry}</span>}
                            </div>

                            <div>
                                <label className="block mb-1">Address</label>
                                <textarea
                                    name="area"
                                    id="area"
                                    placeholder='Enter the address'
                                    value={inputData.area}
                                    onChange={handleInputChange}
                                    ref={areaRef}
                                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                </textarea>
                                {/* <input
                                    value={inputData.area}
                                    onChange={handleInputChange}
                                    ref={areaRef}
                                    type="text"
                                    id='area'
                                    name="area"
                                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" /> */}
                                {inputError.area && <span className="text-red-600">{inputError.area}</span>}
                            </div>

                            <div>
                                <label className="block mb-1">City</label>
                                <input
                                    value={inputData.city}
                                    onChange={handleInputChange}
                                    ref={cityRef}
                                    placeholder='Enter the city'
                                    type="text"
                                    id='city'
                                    name="city"
                                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                {inputError.city && <span className="text-red-600">{inputError.city}</span>}
                            </div>

                            <div>
                                <label className="block mb-1">State</label>
                                <input
                                    value={inputData.state}
                                    onChange={handleInputChange}
                                    ref={stateRef}
                                    placeholder='Enter the state'
                                    type="text"
                                    id='state'
                                    name="state"
                                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                {inputError.state && <span className="text-red-600">{inputError.state}</span>}
                            </div>

                            <div>
                                <label className="block mb-1">No. of Employee's</label>
                                <input
                                    value={inputData.employeeSize}
                                    onChange={handleInputChange}
                                    ref={employeeSizeRef}
                                    placeholder="Enter number of employee's"
                                    type="number"
                                    id='employeeSize'
                                    name="employeeSize"
                                    className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                {inputError.employeeSize && <span className="text-red-600">{inputError.employeeSize}</span>}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium"
                        >
                            Save Changes
                        </button>
                        <button
                            type='button'
                            onClick={handleBack}
                            className="inline-flex items-center px-4 py-2 m-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium"
                        >
                            Back
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
