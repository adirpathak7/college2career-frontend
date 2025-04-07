import axios from 'axios'
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import message from '../../message.json'
import { useLoader } from '../../LoaderContext'

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
            <div className="flex justify-center items-center min-h-screen bg-black text-white">
                <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
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
                                    <svg className="fill-current h-6 w-6 text-gray-900" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <title>Close</title>
                                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                    </svg>
                                </strong>
                            </span>
                        </div>
                    )}
                    <form onSubmit={handelSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1">Email <span className='text-red-600'>*</span></label>
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


                        <button type="submit" className="w-full bg-white text-black py-2 rounded-lg hover:bg-gray-300 font-bold transition duration-300">
                            Forgot Password
                        </button>

                        <p className="mt-4 text-center text-gray-400">
                            Do you want to login? &nbsp;
                            <Link to='/login' className="text-white underline">
                                Login
                            </Link>
                        </p>

                    </form>
                </div>
            </div>
        </>
    )

}