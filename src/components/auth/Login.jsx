import axios from 'axios'
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import message from '../../message.json'
import PasswordInput from './PasswordInput'
import { useLoader } from '../../LoaderContext'
import PageTitle from '../../PageTitle'
import Footer from '../Footer'

export default function Login() {

    const navigate = useNavigate()

    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    const { setLoading } = useLoader()

    const [inputData, setInputData] = useState({ email: '', password: '' })
    const [inputError, setInputError] = useState({ email: '', password: '' })
    const [apiResponse, setApiResponse] = useState({ message: '', type: '' })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setInputData(prev => ({ ...prev, [name]: value }))
        setInputError(prev => ({ ...prev, [name]: '' }))
        setApiResponse({ message: '', type: '' })
    }

    const handleClose = () => {
        setApiResponse({ message: '', type: '' })
    }

    const handelSubmit = (e) => {
        e.preventDefault()

        const errors = {}

        // Static Data for Login Check
        const staticEmail = "adi@gmail.com"
        const staticPassword = "2147"

        if (!inputData.email) {
            errors.email = message.empty + 'email'
            emailRef.current.focus()
        }
        if (!inputData.password) {
            errors.password = message.empty + 'password'
            passwordRef.current.focus()
        }

        if (Object.keys(errors).length > 0) {
            setInputError(errors)
            if (errors.email) emailRef.current.focus()
            else passwordRef.current.focus()
            return
        }

        // Static Data Check (Before API call)
        if (inputData.email === staticEmail && inputData.password === staticPassword) {
            alert('Login successful (Static Data)');
            setInputData({ email: '', password: '' })
            setTimeout(() => navigate('/user/dashboard'), 200)
            return
        }

        // If static data does not match, make API call
        setLoading(true)

        axios.post(`${import.meta.env.VITE_BASE_URL}/login`, inputData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then((response) => {
                if (response.data.status === false) {
                    setApiResponse({ message: response.data.message, type: 'error' })
                    inputData.password = ''
                } else {
                    document.cookie = `userToken=${response.data.data}; path=/; max-age=${60 * 60 * 24}`
                    sessionStorage.setItem("userProfilePicture", "https://res.cloudinary.com/druzdz5zn/image/upload/v1744715705/lhi4cgauyc4nqttymcu4.webp")
                    setInputData({ email: '', password: '' })

                    setTimeout(() => navigate('/user/dashboard'), 200)
                }
            })
            .catch(() => {
                setApiResponse({ message: "Something went wrong.", type: 'error' })
                setInputData({ email: '', password: '' })
            })
            .finally(() => setLoading(false))
    }


    return (
        <>
            <PageTitle title="Login" />
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-600 via-sky-500 to-blue-700 text-gray-800 px-4">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
                    {apiResponse.message && (
                        <div className={`border px-4 py-3 rounded relative mb-4 ${apiResponse.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`}>
                            <strong className="font-bold">{apiResponse.type === 'success' ? 'Success: ' : 'Error: '}</strong>
                            <span className="block sm:inline">{apiResponse.message}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={handleClose}>
                                <svg className="fill-current h-6 w-6 text-red-700" role="button" xmlns="http://www.w3.org/2000/svg">
                                    <title>Close</title>
                                    <path d="M18 6L6 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6 6L18 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                    )}

                    <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Login to Your Account</h2>

                    <form onSubmit={handelSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-blue-700 mb-1">Email <span className='text-red-600'>*</span></label>
                            <input
                                onChange={handleInputChange}
                                value={inputData.email}
                                ref={emailRef}
                                type="text"
                                name="email"
                                className="w-full px-4 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                            {inputError.email && <span className='text-red-600 text-sm'>{inputError.email}</span>}
                        </div>

                        <PasswordInput
                            value={inputData.password}
                            onChange={handleInputChange}
                            ref={passwordRef}
                            error={inputError.password}
                            label="Password"
                            name="password"
                        />

                        <button type="submit" className="w-full bg-gradient-to-r from-[#005acd] via-[#0093cb] to-[#6dd7fd] shadow-md z-50 backdrop-blur-md hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition duration-300">
                            Login
                        </button>

                        <p className="mt-4 text-center text-sm text-gray-600">
                            Forgot your password? &nbsp;
                            <Link to="/forgotPassword" className="text-blue-700 underline">Forgot Password</Link>
                        </p>

                        <p className="mt-2 text-center text-sm text-gray-600">
                            Don't have an account? &nbsp;
                            <Link to="/register" className="text-blue-700 underline">Register</Link>
                        </p>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}
