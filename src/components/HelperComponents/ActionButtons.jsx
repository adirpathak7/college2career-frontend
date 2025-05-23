import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const ActionButtons = ({
    student,
    updateStudentStatus
}) => {
    const status = student.status?.toLowerCase();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [nextStatus, setNextStatus] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const openDialog = (statusType) => {
        setNextStatus(statusType);
        setDialogVisible(true);
    };

    const handleConfirm = () => {
        if ((nextStatus === 'rejected' || nextStatus === 'deactivated') && !reason.trim()) {
            setError('Reason is required');
            return;
        }
        updateStudentStatus(student.studentId, nextStatus, reason);
        setDialogVisible(false);
        setReason('');
        setError('');
    };

    const getActionMessage = (status) => {
        switch (status) {
            case 'activated': return 'activate';
            case 'rejected': return 'reject';
            case 'deactivated': return 'deactivate';
            default: return 'update';
        }
    };


    const handleCancel = () => {
        setDialogVisible(false);
        setReason('');
        setError('');
    };

    const renderDialog = () => (
        <Dialog
            header={`Provide reason to ${getActionMessage(nextStatus)}`}
            visible={dialogVisible}
            style={{ width: '400px' }}
            modal
            onHide={handleCancel}
            footer={
                <div className="flex justify-end gap-2">
                    <Button label="Cancel" onClick={handleCancel} icon="pi pi-times" className="bg-gray-400 px-3 py-1 rounded text-white" />
                    <Button label="Confirm" onClick={handleConfirm} icon="pi pi-check" className="bg-blue-600 px-3 py-1 rounded text-white" />
                </div>
            }
        >
            <p>
                Are you sure you want to <b>{getActionMessage(nextStatus)}</b> <b>{student.studentName}</b>?
            </p>

            {(nextStatus === 'rejected' || nextStatus === 'deactivated') && (
                <>
                    <textarea
                        rows={4}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm mt-3"
                        placeholder="Enter reason..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </>
            )}
        </Dialog>
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
                        onClick={() => openDialog('rejected')}
                        className="bg-red-600 text-white px-3 py-1 text-sm rounded"
                    >
                        Reject
                    </button>
                    {renderDialog()}
                </div>
            );

        case 'activated':
            return (
                <div>
                    <button
                        onClick={() => openDialog('deactivated')}
                        className="bg-red-600 text-white px-3 py-1 text-sm rounded"
                    >
                        Deactivate
                    </button>
                    {renderDialog()}
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
                        onClick={() => openDialog('deactivated')}
                        className="bg-red-600 text-white px-3 py-1 text-sm rounded"
                    >
                        Deactivate
                    </button>
                    {renderDialog()}
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
