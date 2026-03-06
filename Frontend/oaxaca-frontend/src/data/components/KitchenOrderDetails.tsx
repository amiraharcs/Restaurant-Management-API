import { useState } from 'react';
import '../../css/Waiter.css';
import { LuCircleCheck, LuCircleX, LuX } from 'react-icons/lu';
import { acceptOrder, markReady } from '../../api/waiterApi';

export default function KitchenOrderDetails({order, placedAtTime, onClose, onOrderUpdated}: any) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Accept a confirmed order → PREPARING
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

    // Mark a preparing order as ready → READY
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

                    {order.status === "CONFIRMED" && (
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

                    {order.status === "PREPARING" && (
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
