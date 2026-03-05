import { useState } from 'react';
import { createCallWaiterAlert } from '../../api/alertsApi.ts';
import { getLoggedInStaffUsername } from './staffSession.ts';
import '../../css/WaiterAlertsWaiter.css';

export default function WaiterAlertsWaiter() {
    const [showModal, setShowModal] = useState(false);
    const [tableNumber, setTableNumber] = useState("");
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    function openModal() {
        setTableNumber("");
        setNote("");
        setError("");
        setShowModal(true);
    }

    async function handleSubmit() {
        const tableNum = parseInt(tableNumber, 10);
        if (!tableNumber || isNaN(tableNum) || tableNum < 1) {
            setError("Please enter a valid table number.");
            return;
        }
        setSubmitting(true);
        setError("");
        try {
            const username = getLoggedInStaffUsername() ?? "Waiter";
            await createCallWaiterAlert({
                tableNumber: tableNum,
                customerName: `Waiter (${username})`,
                message: note.trim() || "Waiter assistance needed",
            });
            setShowModal(false);
        } catch {
            setError("Failed to send alert. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <button className='flagTableBtn' onClick={openModal}>
                🔔 Flag Table
            </button>

            {showModal && (
                <div className='orderDetailsMain'>
                    <div className='orderDetailsBackdrop' onClick={() => setShowModal(false)} />
                    <div className='orderDetailsContent'>
                        <div className='orderDetailsHeader'>
                            <span className='orderDetailsTitle'>Flag Table for Assistance</span>
                            <button className='orderDetailsClose' onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className='flagModalBody'>
                            <label className='flagLabel'>
                                Table Number
                                <input
                                    className='flagInput'
                                    type='number'
                                    min={1}
                                    placeholder='e.g. 4'
                                    value={tableNumber}
                                    onChange={(e) => setTableNumber(e.target.value)}
                                />
                            </label>
                            <label className='flagLabel'>
                                Note (optional)
                                <textarea
                                    className='flagTextarea'
                                    placeholder='e.g. Customer needs extra napkins'
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={4}
                                />
                            </label>
                            {error && <div className='flagError'>{error}</div>}
                            <button
                                className='popupBtn confirmBtn flagSubmitBtn'
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? "Sending..." : "Send Alert"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
