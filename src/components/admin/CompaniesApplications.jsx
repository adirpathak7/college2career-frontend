import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLoader } from '../../LoaderContext'

export default function CompaniesApplications() {
    const [applications, setApplications] = useState([])
    const [apiError, setApiError] = useState('')

    const { setLoading } = useLoader()

    useEffect(() => {
        setLoading(true)
        const fetchApplications = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/users/companies/getCompanyByPendingStatus`
                )

                if (response.data?.status && Array.isArray(response.data.data)) {
                    setApplications(response.data.data)
                } else {
                    throw new Error("No applications found!")
                }
            } catch (error) {
                setApiError(error.message || "Something went wrong")
                setTimeout(() => setApiError(''), 3000)
            } finally {
                setLoading(false)
            }
        }
        fetchApplications()

        const callInInterval = setInterval(() => {
            fetchApplications()
        }, 600000)

        return () => clearInterval(callInInterval)
    }, [])

    const handleApprove = async (companyId) => {
        try {
            setLoading(true)
            const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/users/companies/updateCompanyStatus/${companyId}`, {
                companyId,
                status: "activated",
            })

            if (response.data.status) {
                alert("Company approved successfully.")
                setApplications(prev => prev.filter(c => c.companyId !== companyId))
            } else {
                alert("Approval failed!")
                console.log(response.data.message)
            }
        } catch (error) {
            console.log("Somthing went wrong! " + error)
        } finally {
            setLoading(false)
        }
    }

    const handleReject = async (companyId) => {
        const rejectReason = prompt("Please enter the reject reason!")
        if (!rejectReason) return

        try {
            setLoading(true)
            const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/users/companies/updateCompanyStatus/${companyId}`, {
                companyId,
                status: "rejected",
                reasonOfStatus: rejectReason
            })

            if (response.data.status) {
                alert("Company rejected successfully.")
                setApplications(prev => prev.filter(c => c.companyId !== companyId))
            } else {
                console.log("Rejection failed! " + response.data.message)
            }
        } catch (error) {
            console.log("Somthing went wrong! " + error)
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="w-full min-h-screen bg-gray-900 text-white py-10 px-4 md:px-10">
            <h1 className="text-3xl font-bold mb-6">Pending Applications</h1>

            {apiError && (
                <div className="mb-4 px-4 py-2 bg-red-600/20 border border-red-500 text-red-400 rounded">
                    {apiError}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map(data => (
                    <div key={data.companyId} className="bg-gray-800 rounded-xl p-6 shadow-lg space-y-3">
                        <div>
                            <h2 className="text-xl font-semibold">{data.companyName}</h2>
                            <p className="text-purple-300 text-sm mt-1">
                                Est. {data.establishedDate}
                            </p>
                            <p className="text-purple-300 text-sm">
                                {data.industry} • {data.city}, {data.state}
                            </p>
                            <p className="text-sm text-gray-400">Employees: {data.employeeSize}</p>
                            {/* <p className="text-sm text-gray-400">Status: {data.status}</p> */}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleApprove(data.companyId)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-sm rounded"
                            >
                                Approve
                            </button>

                            <button
                                onClick={() => handleReject(data.companyId)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-sm rounded"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
