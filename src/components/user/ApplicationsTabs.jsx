import React from "react";

const ApplicationTabs = ({ selectedStatus, setSelectedStatus }) => {
    const tabs = ["All", "Applied", "Shortlisted", "InterviewScheduled", "Rejected"];

    return (
        <div className="flex flex-wrap justify-center gap-3 mb-8">
            {tabs.map((status) => (
                <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedStatus === status
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-100"
                        }`}
                >
                    {status}
                </button>
            ))}
        </div>
    );
};

export default ApplicationTabs;
