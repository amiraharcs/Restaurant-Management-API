import { useState } from 'react';
import '../../css/Waiter.css';
import { LuCircleCheck, LuCircleX, LuX } from 'react-icons/lu';
import { confirmOrder, acceptOrder, markReady } from '../../api/waiterApi';

export default function OrderDetails({order, placedAtTime, onClose, role = "waiter", onOrderUpdated}: any) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Waiter confirms a newly placed order → CONFIRMED (goes to kitchen)
    async function orderConfirmed() {
        try {
            setLoading(true);
            await confirmOrder(order.id);
            onOrderUpdated?.();
            onClose();
        } catch {
            setError('Failed to confirm order');
        } finally {
            setLoading(false);
        }
    }

    // Kitchen accepts a confirmed order → PREPARING
    async function orderAccepted() {
        try {
            setLoading(true);
            await acceptOrder(order.id);
            onOrderUpdated?.();
            onClose();
        } catch {
            setError('Failed to accept order');
        } finally {
            setLoading(false);
        }
    }

    // Kitchen marks a preparing order as ready → READY (appears in waiter's Ready tab)
    async function orderMarkedReady() {
        try {
            setLoading(true);
            await markReady(order.id);
            onOrderUpdated?.();
            onClose();
        } catch {
            setError('Failed to mark order as ready');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="orderDetailsMain">
            <div className="orderDetailsBackdrop" onClick={onClose} />
            <div className="orderDetailsContent">
                <div className='orderDetailsHeader'>
                    <div className='orderDetailsTitle'>Order #{order.id}</div>
                    <button className="orderDetailsClose" onClick={onClose}>
                        <LuX />
                    </button>
                </div>

                <div className='orderDetailsMainBody'>
                    <div className='orderDetailsInfo'>
                        <div className='infoRow'>
                            <p className='infoKey'>Customer :</p>
                            <p className='infoValue'>{order.customerName}</p>
                        </div>
                        <div className='infoRow'>
                            <p className='infoKey'>Table :</p>
                            <p className='infoValue'>{order.tableNumber}</p>
                        </div>
                        <div className='infoRow'>
                            <p className='infoKey'>Placed :</p>
                            <p className='infoValue'>{placedAtTime}</p>
                        </div>
                        <div className='infoRow'>
                            <p className='infoKey'>Status :</p>
                            <p className='infoValue'>{order.status.toUpperCase()}</p>
                        </div>
                    </div>

                    <div className='orderDetailsItems'>
                        <p className='itemsTitle'>Order Items</p>

                        <div className='itemsList'>
                            {order.items.map((item: any, index: number) => (
                                <div key={`${item.name}${index}`} className='itemsRow'>
                                    <p className='itemQuantity'>{item.quantity}x</p>
                                    <p>{item.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {error && <div className='orderDetailsButtons'> {error} </div>}

                    {/* Waiter: confirm a new order → sends it to kitchen */}
                    {role === "waiter" && order.status === "PLACED" && (
                        <div className='orderDetailsButtons'>
                            <button className='popupBtn confirmBtn' onClick={orderConfirmed} disabled={loading}>
                                <LuCircleCheck className='buttonIcons' />
                                {loading ? 'CONFIRMING...' : 'CONFIRM'}
                            </button>
                            <button className='popupBtn cancelBtn'>
                                <LuCircleX className='buttonIcons' />
                                CANCEL
                            </button>
                        </div>
                    )}

                    {/* Kitchen: accept a confirmed order → moves to preparing */}
                    {role === "kitchen" && order.status === "CONFIRMED" && (
                        <div className='orderDetailsButtons'>
                            <button className='popupBtn confirmBtn' onClick={orderAccepted} disabled={loading}>
                                <LuCircleCheck className='buttonIcons' />
                                {loading ? 'ACCEPTING...' : 'ACCEPT'}
                            </button>
                            <button className='popupBtn cancelBtn'>
                                <LuCircleX className='buttonIcons' />
                                CANCEL
                            </button>
                        </div>
                    )}

                    {/* Kitchen: mark a preparing order as ready → appears in waiter's Ready tab */}
                    {role === "kitchen" && order.status === "PREPARING" && (
                        <div className='orderDetailsButtons'>
                            <button className='popupBtn deliveredBtn' onClick={orderMarkedReady} disabled={loading}>
                                <LuCircleCheck className='buttonIcons' />
                                {loading ? 'UPDATING...' : 'MARK READY'}
                            </button>
                            <button className='popupBtn cancelBtn'>
                                <LuCircleX className='buttonIcons' />
                                CANCEL
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}