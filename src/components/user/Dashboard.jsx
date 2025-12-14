import React from "react";
import SideBar from "../SideBar";
import { Outlet } from "react-router-dom";
import PageTitle from "../../PageTitle";

export default function Dashboard() {
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
