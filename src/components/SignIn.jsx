import axios from 'axios'
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import message from '../message.json'

export default function SignIn() {

    const navigate = useNavigate()

    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    const [inputData, setInputData] = useState({
        email: '',
        password: ''
    })

    const [inputError, setInputError] = useState({
        email: '',
        password: ''
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
    }

    const handelSubmit = (e) => {
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

            if (errors.email) {
                emailRef.current.focus()
            } else {
                passwordRef.current.focus()
            }
            return
        }

        axios.post(`${import.meta.env.VITE_BASE_URL}/signIn`, JSON.stringify(inputData), {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
            .then((response) => {
                console.log("API Response:", response.data);
                alert('Login successful.');
                setInputData({
                    email: '',
                    password: ''
                });
                navigate('/signUp');
            })

            .catch((error) => {
                console.log('Error occurred:', error.response);
                alert('Please try again later');
            });

    }

    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-black text-white">
                <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
                    <form onSubmit={handelSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1">Email</label>
                            <input
                                onChange={handelInputChange}
                                value={inputData.email}
                                ref={emailRef}
                                type="text"
                                id='email'
                                name='email'
                                className="w-full p-2 border border-gray-700 bg-gray-800 rounded focus:outline-none focus:border-white"
                            />
                            {inputError.email && <span id='emailError' className='text-red-600'>{inputError.email}</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1">Password</label>
                            <input
                                onChange={handelInputChange}
                                value={inputData.password}
                                ref={passwordRef}
                                type="password"
                                id='password'
                                name='password'
                                className="w-full p-2 border border-gray-700 bg-gray-800 rounded focus:outline-none focus:border-white"
                            />
                            {inputError.password && <span id='passwordError' className='text-red-600'>{inputError.password}</span>}
                        </div>

                        <button type="submit" className="w-full bg-white text-black py-2 rounded-lg hover:bg-gray-300 font-bold transition duration-300">
                            SignIn
                        </button>

                        <p className="mt-4 text-center text-gray-400">
                            Forgot your password??&nbsp;
                            <Link to='/' className="text-white underline">
                                Forgot Password
                            </Link>
                        </p>

                        <p className="mt-4 text-center text-gray-400">
                            Don't have an account?&nbsp;
                            <Link to='/signUp' className="text-white underline">
                                SignUp
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}
