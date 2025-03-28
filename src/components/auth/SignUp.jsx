import axios from 'axios'
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import message from '../../message.json'

export default function SignUp() {
    const navigate = useNavigate()

    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const confirmPasswordRef = useRef(null)
    const roleRef = useRef(null)

    const [inputData, setInputData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    })

    const [inputError, setInputError] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
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
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const errors = {}
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

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
        if (!inputData.role) {
            errors.role = message.empty + 'role'
        }

        setInputError(errors)

        if (Object.keys(errors).length > 0) {
            if (errors.email) {
                emailRef.current.focus()
            } else if (errors.password) {
                passwordRef.current.focus()
            } else if (errors.confirmPassword) {
                confirmPasswordRef.current.focus()
            } else if (errors.role) {
                roleRef.current.focus()
            }
            return
        }

        axios.post(`${import.meta.env.VITE_BASE_URL}/signUp`, inputData)
            .then((response) => {
                alert('Registration successful')
                setInputData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: ''
                })
                navigate('/signIn')
            })
            .catch((error) => {
                console.log('An error occurred: ' + error)
                alert('Please try again later.')
            })
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-black text-white">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1">Email <span className='text-red-600'>*</span></label>
                        <input
                            value={inputData.email}
                            onChange={handleInputChange}
                            ref={emailRef}
                            type="text"
                            id="email"
                            name="email"
                            className="w-full p-2 border border-gray-700 bg-gray-800 rounded focus:outline-none focus:border-white"
                        />
                        {inputError.email && <span className="text-red-600">{inputError.email}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Password <span className='text-red-600'>*</span></label>
                        <input
                            value={inputData.password}
                            onChange={handleInputChange}
                            ref={passwordRef}
                            type="password"
                            id="password"
                            name="password"
                            className="w-full p-2 border border-gray-700 bg-gray-800 rounded focus:outline-none focus:border-white"
                        />
                        {inputError.password && <span className="text-red-600">{inputError.password}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Confirm Password <span className='text-red-600'>*</span></label>
                        <input
                            value={inputData.confirmPassword}
                            onChange={handleInputChange}
                            ref={confirmPasswordRef}
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="w-full p-2 border border-gray-700 bg-gray-800 rounded focus:outline-none focus:border-white"
                        />
                        {inputError.confirmPassword && <span className="text-red-600">{inputError.confirmPassword}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Join As<span className='text-red-600'>*</span></label>
                        <div className="flex items-center">
                            <div className="mr-4">
                                <input
                                    type="radio"
                                    id="roleCompany"
                                    name="role"
                                    value="company"
                                    checked={inputData.role === 'company'}
                                    onChange={handleInputChange}
                                    ref={roleRef}
                                    className="mr-2"
                                />
                                <label htmlFor="roleCompany" className="text-white">Company</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    id="roleStudent"
                                    name="role"
                                    value="student"
                                    checked={inputData.role === 'student'}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                <label htmlFor="roleStudent" className="text-white">Student</label>
                            </div>
                        </div>
                        {inputError.role && <span className="text-red-600">{inputError.role}</span>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-white text-black py-2 rounded-lg hover:bg-gray-300 font-bold transition duration-300"
                    >
                        SignUp
                    </button>

                    <p className="mt-4 text-center text-gray-400">
                        Already have an account?&nbsp;
                        <Link to="/signIn" className="text-white underline">
                            SignIn
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
