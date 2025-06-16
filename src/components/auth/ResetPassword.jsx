import axios from 'axios'
import React, { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import message from '../../message.json'
import PasswordInput from './PasswordInput'
import { useLoader } from '../../LoaderContext'
import PageTitle from '../../PageTitle'
import Footer from '../Footer'

export default function ResetPassword() {
    const navigate = useNavigate()

    const passwordRef = useRef(null)
    const confirmPasswordRef = useRef(null)

    const { setLoading } = useLoader()

    const [forgotPasswordToken, setForgotPasswordToken] = useState(null)
    const [inputData, setInputData] = useState({
        forgotPassword: '',
        confirmPassword: '',
    })

    const [inputError, setInputError] = useState({
        forgotPassword: '',
        confirmPassword: '',
    })

    const [apiResponse, setApiResponse] = useState({
        message: '',
        type: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setInputData((prevValue) => ({
            ...prevValue,
            [name]: value
        }))

        setInputError((prevValue) => ({
            ...prevValue,
            [name]: ''
        }))
        setApiResponse({ message: '', type: '' })
    }

    const handleClose = () => {
        setApiResponse({ message: '', type: '' })
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        if (token) {
            setForgotPasswordToken(token)
        } else {
            alert("Invalid or expired token!");
            navigate('/login');
        }
    }, [navigate]);


    const handleSubmit = (e) => {
        e.preventDefault()

        const errors = {}
        const formData = new FormData()

        formData.append('forgotPasswordToken', forgotPasswordToken)
        formData.append('forgotPassword', inputData.forgotPassword)

        // console.log(forgotPasswordToken);
        // console.log(formData);

        if (!inputData.forgotPassword) {
            errors.forgotPassword = message.empty + 'password'
        }
        if (!inputData.confirmPassword) {
            errors.confirmPassword = message.empty + 'confirm password'
        }
        if (inputData.confirmPassword !== inputData.forgotPassword) {
            errors.confirmPassword = message.mismatch
        }

        setInputError(errors)

        if (Object.keys(errors).length > 0) {
            if (errors.forgotPassword && passwordRef.current) {
                passwordRef.current.focus()
            } else if (errors.confirmPassword && confirmPasswordRef.current) {
                confirmPasswordRef.current.focus()
            }
            return
        }

        setLoading(true)

        axios.post(`${import.meta.env.VITE_BASE_URL}/resetPassword`, formData)
            .then((response) => {
                // console.log("Reset API Response:", response.data)
                if (response.data.status === false) {
                    setApiResponse({
                        message: "Your token has expired!\n Please try again.",
                        type: "error"
                    })
                    setInputData({
                        forgotPassword: '',
                        confirmPassword: ''
                    })
                    navigate('/forgotPassword')
                } else {
                    setApiResponse({
                        message: "Password reset successfully.",
                        type: "success"
                    })
                    setInputData({
                        forgotPassword: '',
                        confirmPassword: '',
                    })
                    navigate('/login')
                }
            })
            .catch((error) => {
                console.log('An error occurred: ', error.response?.data || error.message)
                setApiResponse({
                    message: "Please try again later.",
                    type: "error"
                })
                setInputData({
                    forgotPassword: '',
                    confirmPassword: '',
                })
            }).finally(() => {
                setLoading(false)
            })

    }

    return (
        <>
            <PageTitle title="Reset Password" />
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
                    <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Reset Password</h2>
                    <form onSubmit={handleSubmit}>
                        <PasswordInput
                            value={inputData.forgotPassword}
                            onChange={handleInputChange}
                            ref={passwordRef}
                            error={inputError.forgotPassword}
                            label="New Password"
                            name="forgotPassword"
                        />

                        <PasswordInput
                            value={inputData.confirmPassword}
                            onChange={handleInputChange}
                            ref={confirmPasswordRef}
                            error={inputError.confirmPassword}
                            label="Confirm New Password"
                            name="confirmPassword"
                        />

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#005acd] via-[#0093cb] to-[#6dd7fd] shadow-md z-50 backdrop-blur-md hover:bg-blue-800 text-white py-2 rounded-md font-semibold transition duration-300"
                        >
                            Reset Password
                        </button>

                        <p className="mt-4 text-center text-sm text-gray-600">
                            Back to{' '}
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
