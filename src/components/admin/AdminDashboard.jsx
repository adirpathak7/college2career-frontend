import React, { useEffect } from "react";
import SideBar from "../admin/SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import PageTitle from "../../PageTitle";
import Cookies from "js-cookie";

export default function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("userToken");

        if (!token) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    return (
        <div className="h-screen flex bg-gray-100">
            <SideBar />

            <div className="flex-1 flex flex-col">
                <div className="bg-white shadow-sm px-6 py-4">
                    <PageTitle title="Dashboard" />
                </div>

                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
