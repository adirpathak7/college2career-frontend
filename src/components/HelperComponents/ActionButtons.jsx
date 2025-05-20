import React from 'react';

const ActionButtons = ({
    student,
    showReasonInput,
    setShowReasonInput,
    statusReason,
    setStatusReason,
    cardErrors,
    updateStudentStatus,
}) => {
    const status = student.status?.toLowerCase();
    const showReason = student.studentId === showReasonInput;

    const renderReasonInput = (nextStatus) => (
        <div className="mt-2">
            <textarea
                rows={2}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="Enter reason..."
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
            />
            {cardErrors[student.studentId] && (
                <p className="text-red-500 text-xs mt-1">{cardErrors[student.studentId]}</p>
            )}
            <div className="flex gap-2 mt-1">
                <button
                    className="px-3 py-1 text-white bg-green-600 rounded text-sm"
                    onClick={() => { updateStudentStatus(student.studentId, nextStatus, statusReason)
                    }}
                >
                    Confirm
                    
                </button>
                <button
                    className="px-3 py-1 text-white bg-gray-500 rounded text-sm"
                    onClick={() => {
                        setShowReasonInput(null);
                        setStatusReason('');
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );

    switch (status) {
        case 'pending':
            return (
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => updateStudentStatus(student.studentId, 'activated')}
                        className="bg-green-600 text-white px-3 py-1 text-sm rounded"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => setShowReasonInput(student.studentId)}
                        className="bg-red-600 text-white px-3 py-1 text-sm rounded"
                    >
                        Reject
                    </button>
                    {showReason && renderReasonInput('rejected')}
                </div>
            );

        case 'activated':
            return (
                <div>
                    <button
                        onClick={() => setShowReasonInput(student.studentId)}
                        className="bg-red-600 text-white px-3 py-1 text-sm rounded"
                    >
                        Deactivate
                    </button>
                    {showReason && renderReasonInput('deactivated')}
                </div>
            );

        case 'rejected':
            return (
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => updateStudentStatus(student.studentId, 'activated')}
                        className="bg-green-600 text-white px-3 py-1 text-sm rounded"
                    >
                        Activate
                    </button>
                    <button
                        onClick={() => setShowReasonInput(student.studentId)}
                        className="bg-red-600 text-white px-3 py-1 text-sm rounded"
                    >
                        Deactivate
                    </button>
                    {showReason && renderReasonInput('deactivated')}
                </div>
            );

        case 'deactivated':
            return (
                <button
                    onClick={() => updateStudentStatus(student.studentId, 'activated')}
                    className="bg-green-600 text-white px-3 py-1 text-sm rounded"
                >
                    Activate
                </button>
            );

        default:
            return null;
    }
};

export default ActionButtons;
