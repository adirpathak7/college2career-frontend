import axios from 'axios'
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import message from '../../message.json'
import PasswordInput from './PasswordInput'

export default function Register() {
    const navigate = useNavigate()

    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const confirmPasswordRef = useRef(null)
    const roleRef = useRef(null)

    const [inputData, setInputData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'company'
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
        const formData = new FormData()

        formData.append('email', inputData.email)
        formData.append('password', inputData.password)
        formData.append('role', inputData.role)

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

        axios.post(`${import.meta.env.VITE_BASE_URL}/register`, formData)
            .then((response) => {
                console.log("Register API Response:", response.data)
                if (response.data.status === false) {
                    alert("Email already exists!")
                    setInputData({
                        email: '',
                        role: 'company'
                    })
                } else {
                    alert('Registration successful')
                    setInputData({
                        email: '',
                        password: '',
                        confirmPassword: '',
                    })
                    navigate('/login')
                }
            })
            .catch((error) => {
                console.log('An error occurred: ', error.response?.data || error.message)
                alert('Please try again later.')
                setInputData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: 'company'
                })
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
                    {/* <div className="mb-4 relative"> */}
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
                    <div className="mb-4">
                        <label className="block mb-1">Join As</label>
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
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-white text-black py-2 rounded-lg hover:bg-gray-300 font-bold transition duration-300"
                    >
                        Register
                    </button>

                    <p className="mt-4 text-center text-gray-400">
                        Already have an account? &nbsp;
                        <Link to="/login" className="text-white underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
