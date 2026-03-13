import NavBarWaiter from "./data/components/NavBarWaiter";
import StaffFooter from "./data/components/StaffFooter";
import StaffWelcome from "./data/components/StaffWelcome";
import { useEffect, useState } from 'react';
import { getAllOrders } from './api/waiterApi.ts';
import type { OrderResponse } from './api/waiterApi.ts';
import OrderDetails from './data/components/showOrderDetails';
import { LuChevronRight } from 'react-icons/lu';
import "./css/Waiter.css";

type status = "PLACED" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
type paymentStatus = "UNPAID" | "PAID";

function pendingItemsSum(items: { quantity: number }[]) {
    let count = 0;
    Object.values(items).forEach((item) => count += item.quantity)
    return count;
}

function calculatePlacedAt(ms: number) {
    const totalMins = Math.floor(ms / 60000);
    const totalHours = Math.floor(totalMins / 60);

    const days = Math.floor(totalHours / 24);
    const mins = totalMins % 60;
    const hours = totalHours % 24;

    if (totalMins < 1) {
        return "<1 minute ago";
    }
    if (totalMins === 1) {
        return "1 minute ago";
    }
    if (days > 0) {
        return `${days}d ${hours}h ${mins}m ago`;
    }
    if (totalHours > 0) {
        return `${totalHours}h ${mins}m ago`;
    }

    return `${totalMins} minutes ago`;
}

export default function PastOrder() {
    const [activeTab, setActiveTab] = useState<status | paymentStatus>("PAID");
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    async function fetchOrders(isInitial = false) {
        try {
            setLoading(true);
            const data = await getAllOrders();
            setOrders(data);
            if (isInitial) {
                setIsInitialLoad(false);
            }
        } catch (err) {
            setError('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders(true);

        const interval = setInterval(fetchOrders, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    function filterOrders(tab: status | paymentStatus) {
        if (tab === "PLACED") {
            return orders.filter((order) =>
                order.status === "PLACED" || order.status === "CONFIRMED"
            );
        }
        if (tab === "PAID") {
            return orders.filter((order) => 
                order.status === "DELIVERED" && order.paymentStatus === "PAID"
            );
        }
        const activeOrders = orders.filter((order) => order.status === tab);
        return activeOrders;
    }

    function calculateTabs() {
        const count = {
            PLACED: 0,
            CONFIRMED: 0,
            PREPARING: 0,
            READY: 0,
            DELIVERED: 0,
            CANCELLED: 0
        };
        for (const s of orders) {
            count[s.status] += 1;
        }
        return count;
    }

    function calculatePaymentTabs() {
        const count = {
            UNPAID: 0,
            PAID: 0
        };
        for (const s of orders) {
            if (s.status === "DELIVERED") {
                count[s.paymentStatus] += 1;
            }
        }
        return count;
    }

    const [now, setNow] = useState(Date.now())

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState({});
    const [orderDetailsPlacedAt, setorderDetailsPlacedAt] = useState("");

    return (
        <main>
            <NavBarWaiter />

            <div className='waiterPage'>
                <div className='waiterHeader'>
                    <StaffWelcome />
                </div>

                <div className='orderContainer'>
                    <div className='orderTabs'>
                        {/*  IGNORE THIS, WILL UPDATE WHEN PAID/UNPAID API IS FINISHED!!!   */}
                        <button className={`orderTab ${activeTab === "PAID" ? "active" : ""}`} onClick={() => setActiveTab("PAID")}>
                            Completed & Paid ({calculatePaymentTabs().PAID})
                        </button>

                        <button className={`orderTab ${activeTab === "CANCELLED" ? "active" : ""}`} onClick={() => setActiveTab("CANCELLED")}>
                            Cancelled ({calculateTabs().CANCELLED})
                        </button>
                    </div>

                    <div className='orderTitle'>
                        <h2>{activeTab.toUpperCase()} ORDERS</h2>
                    </div>

                    <div className='topDivider' />

                    <div className='orderList'>
                        {isInitialLoad && loading && (
                            <div className='emptyList'> Orders are currently loading... </div>
                        )}

                        {!isInitialLoad && filterOrders(activeTab).length === 0 && (
                            <div className='emptyList'> No orders in this section </div>
                        )}

                        {error && <div className='emptyList'> {error} </div>}

                        {filterOrders(activeTab).map((order) => {
                            const placedMs = new Date(order.createdAt).getTime();
                            const ageMs = now - placedMs;

                            return (
                                <div key={order.id} className={`orderRow ${order.paymentStatus === "UNPAID" ? "unpaid" : "paid"}`} role='button' onClick={() => { setShowOrderDetails(true); setSelectedOrder(order); setorderDetailsPlacedAt(calculatePlacedAt(ageMs)); }}>
                                    <div className='orderLeft'>
                                        <div className='orderTopLeft'>
                                            <div className='orderId'>Order #{order.id}</div>
                                            <div className={`paymentBadge ${order.paymentStatus === "UNPAID" ? "unpaid" : "paid"}`}>
                                                {order.paymentStatus}
                                            </div>
                                        </div>
                                        <div className='orderCustomerName'>{order.customerName}</div>
                                    </div>

                                    <div className='orderLine' />

                                    <div className='orderMiddle'>
                                        <div className='orderTableNo'>Table No. {order.tableNumber}</div>
                                        <div className='orderPlacedAt'>Placed {calculatePlacedAt(ageMs)}</div>
                                    </div>

                                    <div className='orderLine' />

                                    <div className='orderRight'>
                                        <div className='orderPendingText'>Pending Items</div>
                                        <div className='orderPendingItems'>{pendingItemsSum(order.items)}</div>
                                    </div>

                                    <div className='orderArrow'>
                                        <LuChevronRight />
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                </div>
            </div>
            {showOrderDetails && <OrderDetails order={selectedOrder} placedAtTime={orderDetailsPlacedAt} onOrderUpdated={fetchOrders} onClose={() => {
                setShowOrderDetails(false)
                setSelectedOrder({})
            }} />}

            <StaffFooter />
        </main>
    );
}
