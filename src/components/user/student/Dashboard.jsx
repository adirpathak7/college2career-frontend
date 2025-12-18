import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import { Sliders } from "lucide-react";
import Cookies from 'js-cookie';
import PageTitle from "../../../PageTitle";

export default function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const userToken = Cookies.get('userToken');

        if (!userToken) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="h-screen flex bg-gray-100">
            <SideBar />
            <div className="flex-1 flex flex-col">
                {/* Header Section */}
                <div className="bg-white shadow-sm px-6 py-4">
                    <PageTitle title="Dashboard" />
                </div>

                {/* Main Content Area with Blue Card */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="bg-blue-100 p-6 rounded-lg shadow-lg border border-blue-300">
                        {/* You can style the card content further if needed */}
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>

    );
}
