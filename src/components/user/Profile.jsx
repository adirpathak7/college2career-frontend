import React, { useEffect, useState } from 'react'
import { BiEdit } from 'react-icons/bi'
import CreateProfileModel from './CreateProfileModel'
import axios from 'axios'
import PageTitle from '../../PageTitle'


export default function Profile() {
    const [isEditing, setIsEditing] = useState(false)
    const [profile, setProfile] = useState(null)
    const [apiError, setApiError] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    const defaultProfile = {
        companyName: "N/A",
        establishedDate: "N/A",
        contactNumber: "0264-1234567",
        profilePictureURL: null,
        industry: "N/A",
        area: "N/A",
        city: "N/A",
        state: "N/A",
        employeeSize: "N/A",
        reasonOfStatus: null,
        status: "N/A",
    }

    const getCookie = (name) => {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) return parts.pop().split(';').shift()
    }

    const userProfilePictureURL = sessionStorage.getItem("userProfilePictureURL")

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = getCookie("userToken")

                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/users/companies/getCompanyProfileByUsersId`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                )

                if (response.data?.status && Array.isArray(response.data.data) && response.data.data.length > 0) {
                    setProfile(response.data.data[0])
                } else {
                    throw new Error("No company profile found")
                }

            } catch (error) {
                setApiError(error.message || "Something went wrong")
                setTimeout(() => setApiError(''), 3000)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [])


    const handleEditClick = () => {
        setIsEditing(true)
    }

    const data = profile || defaultProfile
    const isEmpty = !profile

    return (
        <>
            <PageTitle title="Profile" />
            <div className="w-full min-h-screen bg-gray-900 text-white py-10 px-4 md:px-10">
                {apiError && (
                    <div className="mb-6 bg-red-600/20 text-red-400 border border-red-500 px-4 py-3 rounded-lg text-sm font-medium">
                        ⚠️ {apiError}
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center text-purple-300">Loading profile...</div>
                ) : !isEditing ? (
                    <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-lg px-6 py-10">
                        {data.reasonOfStatus && (
                            <div className="mb-6 px-4 py-3 bg-red-600/20 text-red-400 border border-red-500 rounded-lg text-sm font-medium animate-pulse">
                                🚫 {data.reasonOfStatus}
                            </div>
                        )}

                        <div className="sm:items-center">
                            <div className="relative w-full h-48 sm:h-48 rounded-t-2xl overflow-hidden mb-6">
                                <img
                                    src={data.profilePictureURL}
                                    alt="Cover"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 bg-black/50 w-full px-6 py-3">
                                    <h1 className="text-xl sm:text-2xl font-bold text-white">{data.companyName}</h1>
                                </div>
                            </div>


                            <div className="flex-1 text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold">{data.companyName}</h1>
                                        <p className="text-purple-400 text-sm mt-1">
                                            {data.industry} • Est. {data.establishedDate}
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleEditClick}
                                        className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium"
                                    >
                                        <BiEdit className="text-lg mr-1" />
                                        {isEmpty ? 'Create Profile' : 'Edit'}
                                    </button>
                                </div>

                                <p className="mt-4 text-gray-300 text-sm">
                                    Based in {data.area}, {data.city}, {data.state}.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-gray-700 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-lg font-semibold text-white mb-2">📞 Contact Info</h2>
                                <p className="text-purple-300 text-sm">Phone: {data.contactNumber}</p>
                                <p className="text-purple-300 text-sm">Status: {data.status}</p>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-white mb-2">🏢 Company Details</h2>
                                <p className="text-purple-300 text-sm">Employee Size: {data.employeeSize}</p>
                                <p className="text-purple-300 text-sm">Industry: {data.industry}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <CreateProfileModel />
                )}
            </div>
        </>
    )
}
