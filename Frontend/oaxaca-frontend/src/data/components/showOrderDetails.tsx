import '../../css/Waiter.css';
import { LuCircleCheck, LuCircleX, LuX } from 'react-icons/lu';

export default function OrderDetails({order, placedAtTime, onClose}: any) {
    return (
        <main className="orderDetailsMain">
            <div className="orderDetailsBackdrop" onClick={onClose} />
            <div className="orderDetailsContent">
                <div className='orderDetailsHeader'>
                    <div className='orderDetailsTitle'>Order #{order.orderId}</div>
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
                            <p className='infoValue'>{order.tableNo}</p>
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
                                    <p className='itemQuantity'>{item.qty}x</p>
                                    <p>{item.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {order.status === "new" && (
                        <div className='orderDetailsButtons'>
                            <button className='popupBtn confirmBtn'>
                                <LuCircleCheck className='buttonIcons' />
                                CONFIRM
                            </button>

                            <button className='popupBtn cancelBtn'>
                                <LuCircleX className='buttonIcons' />
                                CANCEL
                            </button>
                        </div>
                    )}

                    {order.status === "preparing" && (
                        <div className='orderDetailsButtons'>
                            <button className='popupBtn deliveredBtn disabled' disabled>
                                <LuCircleCheck className='buttonIcons' />
                                DELIVERED
                            </button>

                            <button className='popupBtn cancelBtn'>
                                <LuCircleX className='buttonIcons' />
                                CANCEL
                            </button>
                        </div>
                    )}

                    {order.status === "ready" && (
                        <div className='orderDetailsButtons'>
                            <button className='popupBtn deliveredBtn'>
                                <LuCircleCheck className='buttonIcons' />
                                DELIVERED
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