import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function DashboardHome() {
    const [dashboardData, setDashboardData] = useState(null);

    const fetchData = () => {
        axios
            .get("http://localhost:7072/api/college2career/users/college/getCollegeDashboardCounts")
            .then((res) => {
                setDashboardData(res.data.data);
            })
            .catch((err) => console.error(err));
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

    return (
        <div className="p-6 md:p-10 bg-[#f5ffff] min-h-screen">
            <h1 className="text-3xl font-bold text-[#005acd] mb-8">Admin Dashboard</h1>

            {dashboardData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            ) : (
                <p className="text-gray-500">Loading dashboard data...</p>
            )}
        </div>
    );
}
