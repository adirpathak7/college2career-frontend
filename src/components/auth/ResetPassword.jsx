import axios from 'axios'
import React, { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import message from '../../message.json'
import PasswordInput from './PasswordInput'
import { useLoader } from '../../LoaderContext'

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

        console.log(forgotPasswordToken);
        console.log(formData);

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
                <form onSubmit={handleSubmit}>

                    <PasswordInput
                        value={inputData.forgotPassword}
                        onChange={handleInputChange}
                        ref={passwordRef}
                        error={inputError.forgotPassword}
                        label="Password"
                        name="forgotPassword"
                    />

                    <PasswordInput
                        value={inputData.confirmPassword}
                        onChange={handleInputChange}
                        ref={confirmPasswordRef}
                        error={inputError.confirmPassword}
                        label="Confirm Password"
                        name="confirmPassword"
                    />
                    <button
                        type="submit"
                        className="w-full bg-white text-black py-2 rounded-lg hover:bg-gray-300 font-bold transition duration-300"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    )
}
