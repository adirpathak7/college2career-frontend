import axios from 'axios'
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import message from '../../message.json'
import PasswordInput from './PasswordInput'
import { useLoader } from '../../LoaderContext'


export default function Login() {

    const navigate = useNavigate()

    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    const { setLoading } = useLoader()

    const [inputData, setInputData] = useState({
        email: '',
        password: ''
    })

    const [inputError, setInputError] = useState({
        email: '',
        password: ''
    })

    const handleInputChange = (e) => {
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

        setLoading(true)

        axios.post(`${import.meta.env.VITE_BASE_URL}/login`, inputData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then((response) => {
                console.log("api response: ", response.data)
                if (response.data.status === false) {
                    alert("Invalid email or password!")
                    inputData.password = ''

                } else {
                    alert('Login successfully.')
                    sessionStorage.setItem("userToken", response.data.data)
                    setInputData({
                        email: '',
                        password: ''
                    })
                    navigate('/user/dashboard');
                }
            })

            .catch((error) => {
                console.log('Error occurred:', error.response);
                alert('Please try again later');
                setInputData({
                    email: '',
                    password: ''
                })
            }).finally(() => {
                setLoading(false)
            })

    }

    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-black text-white">
                <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
                    <form onSubmit={handelSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1">Email <span className='text-red-600'>*</span></label>
                            <input
                                onChange={handleInputChange}
                                value={inputData.email}
                                ref={emailRef}
                                type="text"
                                id='email'
                                name='email'
                                className="w-full p-2 border border-gray-700 bg-gray-800 rounded focus:outline-none focus:border-white"
                            />
                            {inputError.email && <span id='emailError' className='text-red-600'>{inputError.email}</span>}
                        </div>

                        <PasswordInput
                            value={inputData.password}
                            onChange={handleInputChange}
                            ref={passwordRef}
                            error={inputError.password}
                            label="Password"
                            name="password"
                        />

                        <button type="submit" className="w-full bg-white text-black py-2 rounded-lg hover:bg-gray-300 font-bold transition duration-300">
                            Login
                        </button>

                        <p className="mt-4 text-center text-gray-400">
                            Forgot your password? &nbsp;
                            <Link to='/forgotPassword' className="text-white underline">
                                Forgot Password
                            </Link>
                        </p>

                        <p className="mt-4 text-center text-gray-400">
                            Don't have an account? &nbsp;
                            <Link to='/register' className="text-white underline">
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )

}