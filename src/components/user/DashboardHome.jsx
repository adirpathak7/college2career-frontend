import React from "react";
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

const dashboardStats = [
    {
        title: "Total Job Posts",
        count: 10,
        icon: <Briefcase className="w-6 h-6 text-white" />,
        color: "bg-blue-500",
    },
    {
        title: "Active Vacancies",
        count: 5,
        icon: <FileText className="w-6 h-6 text-white" />,
        color: "bg-green-500",
    },
    {
        title: "Applications Received",
        count: 123,
        icon: <Users className="w-6 h-6 text-white" />,
        color: "bg-indigo-500",
    },
    {
        title: "Interviews Scheduled",
        count: 15,
        icon: <CalendarCheck className="w-6 h-6 text-white" />,
        color: "bg-yellow-500",
    },
    {
        title: "Offers Issued",
        count: 4,
        icon: <FileSignature className="w-6 h-6 text-white" />,
        color: "bg-purple-500",
    },
    {
        title: "Students Hired",
        count: 2,
        icon: <UserCheck className="w-6 h-6 text-white" />,
        color: "bg-emerald-500",
    },
];

const pieData = [
    { name: "Pending", value: 40 },
    { name: "Shortlisted", value: 30 },
    { name: "Rejected", value: 20 },
    { name: "Hired", value: 10 },
];

const pieColors = ["#fbbf24", "#34d399", "#f87171", "#6366f1"];

const barData = [
    { name: "React Dev", vacancies: 2, applications: 50 },
    { name: "Backend Dev", vacancies: 3, applications: 30 },
    { name: "QA Tester", vacancies: 1, applications: 20 },
];

const DashboardHome = () => {
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
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="vacancies" fill="#3b82f6" />
                            <Bar dataKey="applications" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
