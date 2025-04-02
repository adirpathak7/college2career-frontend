import axios from 'axios'
import React, { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import message from '../../message.json'
import PasswordInput from './PasswordInput'

export default function ResetPassword() {
    const navigate = useNavigate()

    const passwordRef = useRef(null)
    const confirmPasswordRef = useRef(null)

    const [forgotPasswordToken, setForgotPasswordToken] = useState(null)
    const [inputData, setInputData] = useState({
        forgotPassword: '',
        confirmPassword: '',
    })

    const [inputError, setInputError] = useState({
        forgotPassword: '',
        confirmPassword: '',
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

        axios.post(`${import.meta.env.VITE_BASE_URL}/resetPassword`, formData)
            .then((response) => {
                console.log("Reset API Response:", response.data)
                if (response.data.status === false) {
                    alert("Your token has expired! Please try again")
                    setInputData({
                        forgotPassword: '',
                        confirmPassword: ''
                    })
                    navigate('/forgotPassword')
                } else {
                    alert('Password reset successfully.')
                    setInputData({
                        forgotPassword: '',
                        confirmPassword: '',
                    })
                    navigate('/login')
                }
            })
            .catch((error) => {
                console.log('An error occurred: ', error.response?.data || error.message)
                alert('Please try again later.')
                setInputData({
                    forgotPassword: '',
                    confirmPassword: '',
                })
            })

    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-black text-white">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
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
