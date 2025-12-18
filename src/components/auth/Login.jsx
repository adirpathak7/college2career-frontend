import axios from 'axios'
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import message from '../../message.json'
import PasswordInput from './PasswordInput'
import { useLoader } from '../../LoaderContext'
import PageTitle from '../../PageTitle'
import Footer from '../Footer'
import { loginUser } from '../../api/authApi.js'
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion'

export default function Login() {

    const navigate = useNavigate()
    const { setLoading } = useLoader()

    const emailRef = useRef(null)
    const passwordRef = useRef(null)

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

    const handelSubmit = async (e) => {
        e.preventDefault()

        const errors = {}
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

        try {
            setLoading(true)
            const response = await loginUser(inputData)

            if (response.data.status === false) {
                setApiResponse({ message: response.data.message, type: "error" })
            } else {
                setApiResponse({ message: response.data.message, type: "success" })
                document.cookie = `userToken=${response.data.data}; path=/; max-age=${60 * 60 * 24 * 7}; Secure; SameSite=Strict`;
                const token = Cookies.get("userToken");
                // if (!token) return null;

                const decoded = jwtDecode(token);
                const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                if (role === "company") {
                    setTimeout(() => navigate('/user/dashboard'), 150)
                } else if (role === "college") {
                    setTimeout(() => navigate('/admin/dashboard'), 150)
                } else if (role === "student") {
                    setTimeout(() => navigate('/user/student/dashboard/inbox'), 150)
                }
                else {
                    document.cookie = `userToken=; path=/; max-age=0`;
                    setApiResponse({ message: "Invalid user!", type: "error" })
                }
            }
        } catch (err) {
            console.log("Error occurred: ", err)
            setApiResponse({ message: "Something went wrong.", type: 'error', })
            setInputData({
                email: '',
                password: '',
                confirmPassword: '',
                roleId: 2
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <PageTitle title="Login" />
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-600 via-sky-500 to-blue-700 text-gray-800 px-4 mt-10"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1470&q=80')"
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div> {/* dark overlay */}

                {/* Glassmorphism Card */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-full max-w-md bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/30 z-10"
                >
                    {/* Alert */}
                    {apiResponse.message && (
                        <div className={`border px-4 py-3 rounded relative mb-6 ${apiResponse.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`}>
                            <strong className="font-bold">{apiResponse.type === 'success' ? 'Success: ' : 'Error: '}</strong>
                            <span className="block sm:inline">{apiResponse.message}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={handleClose}>
                                <svg className="fill-current h-6 w-6 text-gray-700" role="button" xmlns="http://www.w3.org/2000/svg">
                                    <title>Close</title>
                                    <path d="M18 6L6 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6 6L18 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                    )}

                    <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Welcome Back</h2>

                    <form onSubmit={handelSubmit} className="space-y-6">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-blue-800 mb-1">Email <span className='text-red-600'>*</span></label>
                            <input
                                type="email"
                                name="email"
                                ref={emailRef}
                                value={inputData.email}
                                onChange={handleInputChange}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
                            />
                            {inputError.email && <span className="text-red-600 text-sm">{inputError.email}</span>}
                        </div>

                        {/* Password */}
                        <PasswordInput
                            value={inputData.password}
                            onChange={handleInputChange}
                            ref={passwordRef}
                            error={inputError.password}
                            label="Password"
                            name="password"
                        />

                        {/* Login Button */}
                        <button type="submit" className="w-full bg-gradient-to-r from-[#005acd] via-[#0093cb] to-[#6dd7fd] text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
                            Login
                        </button>

                        {/* Links */}
                        <div className="text-center space-y-2 text-sm">
                            <p className="text-slate-600">
                                Forgot your password?{" "}
                                <Link
                                    to="/forgotPassword"
                                    className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition"
                                >
                                    Forgot
                                </Link>
                            </p>

                            <p className="text-slate-600">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition"
                                >
                                    Register
                                </Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
            <Footer />
        </>
    )
}
