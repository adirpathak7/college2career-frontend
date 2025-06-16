import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import message from '../../message.json'
import PasswordInput from './PasswordInput'
import { useLoader } from '../../LoaderContext'
import PageTitle from '../../PageTitle'
import Footer from '../Footer'

export default function Register() {
    const navigate = useNavigate()

    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const confirmPasswordRef = useRef(null)
    const roleRef = useRef(null)

    const { setLoading } = useLoader()

    const [inputData, setInputData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 2
    })

    const [inputError, setInputError] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    })

    const [apiResponse, setApiResponse] = useState({
        message: '',
        type: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setInputData((prevValue) => ({
            ...prevValue,
            [name]: name === 'role' ? Number(value) : value
        }))

        setInputError((prevValue) => ({
            ...prevValue,
            [name]: ''
        }))

        setApiResponse({ message: '', type: '' })
    }

    // const handleClose = () => {
    //     setApiResponse({ message: '', type: '' })
    // }

    const handleSubmit = (e) => {
        e.preventDefault()

        const errors = {}
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const formData = new FormData()

        formData.append('email', inputData.email)
        formData.append('password', inputData.password)
        formData.append('roleId', inputData.role)

        if (!inputData.email) {
            errors.email = message.empty + 'email'
        } else if (!inputData.email.match(emailRegex)) {
            errors.email = message.invalidEmail
        }
        if (!inputData.password) {
            errors.password = message.empty + 'password'
        }
        if (!inputData.confirmPassword) {
            errors.confirmPassword = message.empty + 'confirm password'
        }
        if (inputData.confirmPassword !== inputData.password) {
            errors.confirmPassword = message.mismatch
        }

        setInputError(errors)

        if (Object.keys(errors).length > 0) {
            if (errors.email && emailRef.current) {
                emailRef.current.focus()
            } else if (errors.password && passwordRef.current) {
                passwordRef.current.focus()
            } else if (errors.confirmPassword && confirmPasswordRef.current) {
                confirmPasswordRef.current.focus()
            }
            return
        }

        setLoading(true)

        axios.post(`${import.meta.env.VITE_BASE_URL}/register`, formData)
            .then((response) => {
                console.log("api response:", response.data)
                if (response.data.status === false) {
                    setApiResponse({
                        message: response.data.message,
                        type: 'error',
                    })
                } else {
                    navigate('/login')
                }
            })
            .catch((error) => {
                console.log("Error occurred: ", error)
                setApiResponse({
                    message: "Something went wrong.",
                    type: 'error',
                })
                setInputData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: 2
                })
            }).finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        if (apiResponse.message) {
            const timer =
                setTimeout(() => {
                    setApiResponse({ message: '', type: '' })
                }, 3000)
            return () => clearTimeout(timer)
        }
    }, [apiResponse.message])

    return (
        <>
            <PageTitle title="Register" />
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-600 via-sky-500 to-blue-700 text-gray-800 px-4">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-blue-100">
                    {apiResponse.message && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                            <strong className="font-semibold">Error:</strong> {apiResponse.message}
                        </div>
                    )}
                    <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-blue-700 mb-1">
                                Email <span className="text-red-600">*</span>
                            </label>
                            <input
                                value={inputData.email}
                                onChange={handleInputChange}
                                ref={emailRef}
                                type="text"
                                id="email"
                                name="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            {inputError.email && (
                                <span className="text-red-600 text-sm">{inputError.email}</span>
                            )}
                        </div>

                        <PasswordInput
                            value={inputData.password}
                            onChange={handleInputChange}
                            ref={passwordRef}
                            error={inputError.password}
                            label="Password"
                            name="password"
                        />

                        <PasswordInput
                            value={inputData.confirmPassword}
                            onChange={handleInputChange}
                            ref={confirmPasswordRef}
                            error={inputError.confirmPassword}
                            label="Confirm Password"
                            name="confirmPassword"
                        />

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-blue-700 mb-2">
                                Join As
                            </label>
                            <div className="flex items-center space-x-6 text-sm">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="role"
                                        value={2}
                                        checked={inputData.role === 2}
                                        onChange={handleInputChange}
                                        ref={roleRef}
                                        className="mr-2 accent-blue-600"
                                    />
                                    Company
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="role"
                                        value={1}
                                        checked={inputData.role === 1}
                                        onChange={handleInputChange}
                                        className="mr-2 accent-blue-600"
                                    />
                                    Student
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#005acd] via-[#0093cb] to-[#6dd7fd] shadow-md z-50 backdrop-blur-md hover:bg-blue-800 text-white py-2 rounded-md font-semibold transition duration-300"
                        >
                            Register
                        </button>

                        <p className="mt-4 text-center text-sm text-gray-600">
                            Already have an account?{' '}
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
