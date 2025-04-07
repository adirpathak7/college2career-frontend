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
                console.log("Forgot API response: ", response.data);
                if (response.data.status === false) {
                    alert("Email does not exist!")
                    setInputData({
                        email: ''
                    })
                } else {
                    alert("Mail sent to your registerd email account.")
                    setInputData({
                        email: ''
                    })
                }
            })

            .catch((error) => {
                console.log('Error occurred:', error.response);
                alert('Please try again later');
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