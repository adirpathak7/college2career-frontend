import axios from 'axios'
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import message from '../../message.json'
import { useLoader } from '../../LoaderContext'
import PageTitle from '../../PageTitle'
import Footer from '../Footer'

export default function Forgot() {

    const navigate = useNavigate()

    const emailRef = useRef(null)

    const { setLoading } = useLoader()

    const [inputData, setInputData] = useState({
        email: '',
    })

    const [inputError, setInputError] = useState({
        email: '',
    })

    const [apiResponse, setApiResponse] = useState({
        message: '',
        type: ''
    })

    const handelInputChange = (e) => {
        const { name, value } = e.target
        setInputData((prevValue) => ({
            ...prevValue,
            [name]: value
        }))
        setInputError((prevError) => ({
            ...prevError,
            [name]: ''
        }))

        setApiResponse({ message: '', type: '' })
    }

    const handleClose = () => {
        setApiResponse({ message: '', type: '' })
    }

    const handelSubmit = (e) => {
        e.preventDefault()

        const errors = {}

        if (!inputData.email) {
            errors.email = message.empty + 'email'
            emailRef.current.focus()
        }

        if (Object.keys(errors).length > 0) {
            setInputError(errors)

            if (errors.email) {
                emailRef.current.focus()
            }
            return
        }

        setLoading(true)

        axios.post(`${import.meta.env.VITE_BASE_URL}/forgotPassword`, inputData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then((response) => {
                // console.log("Forgot API response: ", response.data);
                if (response.data.status === false) {
                    setApiResponse({
                        message: "Email does not exist!",
                        type: "error"
                    })
                    setInputData({
                        email: ''
                    })
                } else {
                    setApiResponse({
                        message: "Mail sent to your registerd email account.",
                        type: "success"
                    })
                    setInputData({
                        email: ''
                    })
                }
            })

            .catch((error) => {
                console.log('Error occurred:', error.response);
                setApiResponse({
                    message: "Please try again later.",
                    type: "error"
                })
                setInputData({
                    email: '',
                })
            }).finally(() => {
                setLoading(false)
            })

    }

    return (
        <>
            <PageTitle title="Forgot Password" />
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-600 via-sky-500 to-blue-700 text-gray-800 px-4">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-blue-100">
                    {apiResponse.message && (
                        <div
                            className={`px-4 py-3 rounded mb-4 text-sm ${apiResponse.type === 'success'
                                ? 'bg-green-100 border border-green-400 text-green-700'
                                : 'bg-red-100 border border-red-400 text-red-700'
                                }`}
                            role="alert"
                        >
                            <strong className="font-bold">
                                {apiResponse.type === 'success' ? 'Success: ' : 'Error: '}
                            </strong>
                            <span className="block sm:inline">{apiResponse.message}</span>
                            <span
                                className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
                                onClick={handleClose}
                            >
                                <svg
                                    className="fill-current h-6 w-6 text-red-700"
                                    role="button"
                                    width="24"
                                    height="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <title>Close</title>
                                    <path
                                        d="M18 6L6 18"
                                        stroke="black"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M6 6L18 18"
                                        stroke="black"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                        </div>
                    )}
                    <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Forgot Password</h2>
                    <form onSubmit={handelSubmit}>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-blue-700 mb-1">
                                Email <span className="text-red-600">*</span>
                            </label>
                            <input
                                onChange={handelInputChange}
                                value={inputData.email}
                                ref={emailRef}
                                type="text"
                                id="email"
                                name="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            {inputError.email && (
                                <span id="emailError" className="text-red-600 text-sm">
                                    {inputError.email}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#005acd] via-[#0093cb] to-[#6dd7fd] shadow-md z-50 backdrop-blur-md hover:bg-blue-800 text-white py-2 rounded-md font-semibold transition duration-300"
                        >
                            Forgot Password
                        </button>

                        <p className="mt-4 text-center text-sm text-gray-600">
                            Want to login instead?{' '}
                            <Link to="/login" className="text-blue-700 hover:underline font-medium">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}