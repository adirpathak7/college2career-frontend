import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Briefcase,
    Users,
    FileText,
    CalendarCheck,
    FileSignature,
    UserCheck,
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import Cookies from 'js-cookie';

const pieColors = ["#fbbf24", "#34d399", "#f87171", "#6366f1"];

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalVacancies: 0,
        activeVacancies: 0,
        totalApplications: 0,
        interviewsScheduled: 0,
        offersIssued: 0,
        studentsHired: 0,
    });

    const [pieData, setPieData] = useState([]);
    const [barData, setBarData] = useState([]);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const token = Cookies.get("userToken");
                const response = await axios.get(
                    "http://localhost:7072/api/college2career/users/companies/getCompanyDashboardStats",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = response.data;

                setStats({
                    totalVacancies: data.totalVacancies || 0,
                    activeVacancies: data.hiringVacancies || 0,
                    totalApplications: data.totalApplications || 0,
                    interviewsScheduled: data.interviewScheduledApplications || 0,
                    offersIssued: data.offeredApplications || 0,
                    studentsHired: data.offerAcceptedApplications || 0,
                });

                setPieData([
                    { name: "Pending", value: data.pendingApplications || 0 },
                    { name: "Shortlisted", value: data.shortlistedApplications || 0 },
                    { name: "Rejected", value: data.rejectedApplications || 0 },
                    { name: "Hired", value: data.offerAcceptedApplications || 0 },
                ]);

                setBarData(data.vacancyWiseStats || []);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };

        fetchDashboardStats();
    }, []);

    const dashboardStats = [
        {
            title: "Total Job Posts",
            count: stats.totalVacancies,
            icon: <Briefcase className="w-6 h-6 text-white" />,
            color: "bg-blue-500",
        },
        {
            title: "Active Vacancies",
            count: stats.activeVacancies,
            icon: <FileText className="w-6 h-6 text-white" />,
            color: "bg-green-500",
        },
        {
            title: "Applications Received",
            count: stats.totalApplications,
            icon: <Users className="w-6 h-6 text-white" />,
            color: "bg-indigo-500",
        },
        {
            title: "Interviews Scheduled",
            count: stats.interviewsScheduled,
            icon: <CalendarCheck className="w-6 h-6 text-white" />,
            color: "bg-yellow-500",
        },
        {
            title: "Offers Issued",
            count: stats.offersIssued,
            icon: <FileSignature className="w-6 h-6 text-white" />,
            color: "bg-purple-500",
        },
        {
            title: "Students Hired",
            count: stats.studentsHired,
            icon: <UserCheck className="w-6 h-6 text-white" />,
            color: "bg-emerald-500",
        },
    ];

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Company Dashboard</h2>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {dashboardStats.map((stat, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-5 rounded-2xl shadow-md bg-white hover:shadow-lg transition"
                    >
                        <div>
                            <p className="text-sm text-gray-500">{stat.title}</p>
                            <h3 className="text-2xl font-semibold">{stat.count}</h3>
                        </div>
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}
                        >
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pie Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Application Status</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={index} fill={pieColors[index % pieColors.length]} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Vacancies vs Applications</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={barData}>
                            <XAxis dataKey="vacancyTitle" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="vacancyCount" fill="#3b82f6" name="Vacancies" />
                            <Bar dataKey="applicationCount" fill="#10b981" name="Applications" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
