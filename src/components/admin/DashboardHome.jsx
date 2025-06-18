import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function DashboardHome() {
    const [dashboardData, setDashboardData] = useState(null);

    const fetchData = async () => {
        try {
            const res = await axios.get(
                "http://localhost:7072/api/college2career/users/college/getCollegeDashboardCounts"
            );
            setDashboardData(res.data.data || res.data); // safe access
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const animatedCount = (value) => (
        <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold text-[#005acd]"
        >
            {value}
        </motion.span>
    );

    const Card = ({ title, children }) => (
        <motion.div
            whileHover={{ scale: 1.03 }}
            className="relative overflow-hidden bg-white rounded-2xl shadow-md border border-[#bef0ff] p-6 transition-all duration-300"
        >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0093cb] to-[#6dd7fd] rounded-t-2xl" />
            <h2 className="text-xl font-semibold text-[#0093cb] mb-3 mt-2">{title}</h2>
            <div className="space-y-1 text-gray-700">{children}</div>
        </motion.div>
    );

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <div className="p-6 md:p-10 bg-[#f5ffff] min-h-screen">
            <h1 className="text-3xl font-bold text-[#005acd] mb-8">Admin Dashboard</h1>

            {dashboardData ? (
                <>
                    {/* Top Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card title="Students">
                            <p>Total: {animatedCount(dashboardData.students.total)}</p>
                            <p>Active: {animatedCount(dashboardData.students.active)}</p>
                            <p>Pending: {animatedCount(dashboardData.students.pending)}</p>
                        </Card>

                        <Card title="Companies">
                            <p>Total: {animatedCount(dashboardData.companies.total)}</p>
                            <p>Active: {animatedCount(dashboardData.companies.active)}</p>
                            <p>Pending: {animatedCount(dashboardData.companies.pending)}</p>
                        </Card>

                        <Card title="Vacancies">
                            <p>Total: {animatedCount(dashboardData.vacancies.total)}</p>
                            <p>Applications: {animatedCount(dashboardData.vacancies.applications)}</p>
                        </Card>

                        <Card title="Applications">
                            <p>Offers Accepted: {animatedCount(dashboardData.applications.offerAccepted)}</p>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                        <div className="bg-white p-6 rounded-2xl shadow border border-[#bef0ff]">
                            <h3 className="text-xl font-semibold text-[#005acd] mb-4">Student Status</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: "Active", value: dashboardData.students.active },
                                            { name: "Pending", value: dashboardData.students.pending },
                                        ]}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {COLORS.map((color, index) => (
                                            <Cell key={index} fill={color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow border border-[#bef0ff]">
                            <h3 className="text-xl font-semibold text-[#005acd] mb-4">Overview Comparison</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart
                                    data={[
                                        {
                                            name: "Students",
                                            Total: dashboardData.students.total,
                                            Active: dashboardData.students.active,
                                        },
                                        {
                                            name: "Companies",
                                            Total: dashboardData.companies.total,
                                            Active: dashboardData.companies.active,
                                        },
                                        {
                                            name: "Vacancies",
                                            Total: dashboardData.vacancies.total,
                                            Applications: dashboardData.vacancies.applications,
                                        },
                                        {
                                            name: "Offers",
                                            Accepted: dashboardData.applications.offerAccepted,
                                        },
                                    ]}
                                >
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Total" fill="#0088FE" />
                                    <Bar dataKey="Active" fill="#00C49F" />
                                    <Bar dataKey="Applications" fill="#FFBB28" />
                                    <Bar dataKey="Accepted" fill="#FF8042" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Extra Info Section */}
                    <div className="bg-white p-6 rounded-2xl shadow border border-[#bef0ff]">
                        <h3 className="text-xl font-semibold text-[#005acd] mb-4">Additional Stats</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                            <li>Total Students: {dashboardData.students.total}</li>
                            <li>Pending Company Approvals: {dashboardData.companies.pending}</li>
                            <li>Vacancy Applications: {dashboardData.vacancies.applications}</li>
                            <li>Offer Letters Accepted: {dashboardData.applications.offerAccepted}</li>
                        </ul>
                    </div>
                </>
            ) : (
                <p className="text-gray-500">Loading dashboard data...</p>
            )}
        </div>
    );
}
