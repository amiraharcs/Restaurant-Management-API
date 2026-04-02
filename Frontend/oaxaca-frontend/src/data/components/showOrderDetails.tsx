import { useEffect, useState } from 'react';
import '../../css/Waiter.css';
import { LuCircleCheck, LuCircleX, LuX, LuCircleDollarSign, LuPlus } from 'react-icons/lu';
import { cancelOrder, confirmOrder, deliverOrder, markPaidOrder, addItemToOrder, markUnpaidOrder } from '../../api/waiterApi';
import type { AddItemType } from '../../api/waiterApi';
import { fetchMenu } from '../../api/menuApi'

export default function OrderDetails({order, placedAtTime, onClose, onOrderUpdated}: any) {
    const [loading, setLoading] = useState(false);
    const [loadingMenu, setLoadingMenu] = useState(false);
    const [error, setError] = useState("");
    const [showAddItem, setShowAddItem] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuData>({ main: [], dessert: [], drinks: [] });

    // types used to display menu items
    type MenuItemType = {
        id?: number;
        name: string;
        description: string;
        price: number;
        calories: number;
        isAvailable: boolean;
        ingredients: string[];
        allergens: string[];
        filters: string[];
        image: string;
        itemType?: string;
    };
    type MenuData = Record<string, MenuItemType[]>;

    // Function to load menu items from menu API so waiters can add new items
    useEffect(() => {
        async function loadMenu() {
            try {
                setLoadingMenu(true);
                setError("");
    
                const data = await fetchMenu()
                const mapped: MenuData = {
                    main: data.FOOD ?? [],
                    dessert: data.DESSERT ?? [],
                    drinks: data.DRINK ?? []
                }
                setMenuItems(mapped)
            } catch (e: any) {
                setError(e?.message ?? "Failed to load menu")
            } finally {
                setLoadingMenu(false);
            }
        }
        loadMenu()
    }, []);

    // Function to call order confirmed API
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

    // Function to call order delivered API
    async function orderDelivered() {
        try {
            setLoading(true);
            await deliverOrder(order.id);
            onOrderUpdated?.();
            onClose();
        } catch {
            setError('Failed to mark order as delivered');
        } finally {
            setLoading(false);
        }
    }

    // Function to call order cancelled API
    async function orderCancelled() {
        try {
            setLoading(true);
            await cancelOrder(order.id);
            onOrderUpdated?.();
            onClose();
        } catch {
            setError('Failed to mark order as cancelled');
        } finally {
            setLoading(false);
        }
    }

    // Function to call order PAID API
    async function orderPaid() {
        try {
            setLoading(true);
            await markPaidOrder(order.id);
            onOrderUpdated?.();
            onClose();
        } catch {
            setError('Failed to mark order as paid');
        } finally {
            setLoading(false);
        }
    }

    // Function to handle the menu items when added to existing order
    async function handleAddItem(item : MenuItemType) {
        if (!item.id) return;

        try {
            setLoading(true);

            const requestType: AddItemType = {
                menuItemId: item.id,
                quantity: 1
            }

            await addItemToOrder(order.id, requestType);
            // If order already PAID, change to UNPAID since new items added
            if (order.paymentStatus === "PAID") {
                await markUnpaidOrder(order.id);
            }
            onOrderUpdated?.();
            setShowAddItem(false);
            onClose();
        } catch {
            setError('Failed to add item to order');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="orderDetailsMain">
            {/* Order Details popup */}
            <div className="orderDetailsBackdrop" onClick={onClose} />
            <div className="orderDetailsContent">
                <div className='orderDetailsHeader'>
                    <div className='orderDetailsTitle'>Order #{order.id}</div>
                    <button className="orderDetailsClose" onClick={onClose}>
                        <LuX />
                    </button>
                </div>

                {/* Customer details */}
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
                        <div className='infoRow'>
                            <p className='infoKey'>Paid :</p>
                            <p className={`infoValue ${order.paymentStatus === "UNPAID" ? "warning" : ""}`}>{order.paymentStatus.toUpperCase()}</p>
                        </div>
                    </div>

                    <div className='orderDetailsItems'>
                        <p className='itemsTitle'>Order Items</p>

                        <div className='itemsList'>
                            {/* List of menu items and add menu button */}
                            {order.items.map((item: any, index: number) => (
                                <div key={`${item.name}${index}`} className='itemsRow'>
                                    <p className='itemQuantity'>{item.quantity}x</p>
                                    <p>{item.name}</p>
                                </div>
                            ))}
                            {(order.status === "PLACED" || order.status === "CONFIRMED" || order.status === "PREPARING") && (
                                <div className='addItemWrapper'>
                                    <button className='addItemButton' onClick={() => setShowAddItem(opened => !opened)}>
                                        <LuPlus className='buttonIcons' />
                                        ADD MENU
                                    </button>
                                    {showAddItem && (
                                        <div className="modalOverlay">
                                            <div className="modalBackdrop" onClick={() => setShowAddItem(false)} />
                                            <div className="modalContent">
                                                <div className="modalHeader">
                                                    <p className="modalTitle">Add Item</p>
                                                </div>
                                                <div className="modalBody">
                                                    {loadingMenu ? (
                                                        <p className='addItemEmpty'>Loading menu...</p>
                                                    ) : (
                                                        Object.entries(menuItems).map(([category, items]) =>
                                                            items.length > 0 && (
                                                                <div key={category}>
                                                                    <p className='addItemCategory'>{category.toUpperCase()}</p>
                                                                    {items.filter(item => item.isAvailable).map(item => (
                                                                        <button 
                                                                            key={item.id} 
                                                                            className='addItemOption'
                                                                            onClick={() => handleAddItem(item)}
                                                                        >
                                                                            {item.name}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {error && <div className='orderDetailsButtons'> {error} </div>}
                    
                    {/* Depending on order status, buttons will change */}
                    {order.status === "PLACED" && (
                        <div className='orderDetailsButtons'>
                            <button className='popupBtn confirmBtn' onClick={orderConfirmed} disabled={loading}>
                                <LuCircleCheck className='buttonIcons' />
                                {loading ? 'CONFIRMING...' : 'CONFIRM'}
                            </button>
                            <button className='popupBtn cancelBtn' onClick={orderCancelled}>
                                <LuCircleX className='buttonIcons' />
                                CANCEL
                            </button>
                            <button className={`popupBtn paidBtn ${order.paymentStatus === "PAID" ? "disabled" : ""}`} onClick={orderPaid} disabled={order.paymentStatus === "PAID"}>
                                <LuCircleDollarSign className='buttonIcons' />
                                PAID
                            </button>
                        </div>
                    )}

                    {order.status === "CONFIRMED" && (
                        <div className='orderDetailsButtons'>
                            <button className='popupBtn confirmBtn disabled' disabled>
                                <LuCircleCheck className='buttonIcons' />
                                CONFIRM
                            </button>
                            <button className='popupBtn cancelBtn' onClick={orderCancelled}>
                                <LuCircleX className='buttonIcons' />
                                CANCEL
                            </button>
                            <button className={`popupBtn paidBtn ${order.paymentStatus === "PAID" ? "disabled" : ""}`} onClick={orderPaid} disabled={order.paymentStatus === "PAID"}>
                                <LuCircleDollarSign className='buttonIcons' />
                                PAID
                            </button>
                        </div>
                    )}

                    {order.status === "PREPARING" && (
                        <div className='orderDetailsButtons'>
                            <button className='popupBtn deliveredBtn disabled' disabled>
                                <LuCircleCheck className='buttonIcons' />
                                DELIVERED
                            </button>
                            <button className='popupBtn cancelBtn' onClick={orderCancelled}>
                                <LuCircleX className='buttonIcons' />
                                CANCEL
                            </button>
                            <button className={`popupBtn paidBtn ${order.paymentStatus === "PAID" ? "disabled" : ""}`} onClick={orderPaid} disabled={order.paymentStatus === "PAID"}>
                                <LuCircleDollarSign className='buttonIcons' />
                                PAID
                            </button>
                        </div>
                    )}

                    {order.status === "READY" && (
                        <div className='orderDetailsButtons'>
                            <button className='popupBtn deliveredBtn' onClick={orderDelivered} disabled={loading}>
                                <LuCircleCheck className='buttonIcons' />
                                {loading ? 'UPDATING...' : 'DELIVERED'}
                            </button>
                            <button className='popupBtn cancelBtn' onClick={orderCancelled}>
                                <LuCircleX className='buttonIcons' />
                                CANCEL
                            </button>
                            <button className={`popupBtn paidBtn ${order.paymentStatus === "PAID" ? "disabled" : ""}`} onClick={orderPaid} disabled={order.paymentStatus === "PAID"}>
                                <LuCircleDollarSign className='buttonIcons' />
                                PAID
                            </button>
                        </div>
                    )}

                    {order.status === "DELIVERED" && (
                        <div className='orderDetailsButtons'>
                            <button className={`popupBtn paidBtn ${order.paymentStatus === "PAID" ? "disabled" : ""}`} onClick={orderPaid} disabled={order.paymentStatus === "PAID"}>
                                <LuCircleDollarSign className='buttonIcons' />
                                PAID
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
