import { useEffect, useState } from "react";
import "./css/Kitchen.css";
import { LuChevronRight } from "react-icons/lu";
import NavBarKitchen from "./data/components/NavBarKitchen";
import KitchenOrderDetails from "./data/components/KitchenOrderDetails";
import StaffFooter from "./data/components/StaffFooter";
import StaffWelcome from "./data/components/StaffWelcome";
import { getAllOrders } from "./api/waiterApi";
import type { OrderResponse } from "./api/waiterApi";

type KitchenStatus = "new" | "preparing";

function pendingItemsSum(items: { quantity: number }[]) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
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

export default function Kitchen() {
    const [activeTab, setActiveTab] = useState<KitchenStatus>("new");
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [now, setNow] = useState(Date.now());
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
    const [orderDetailsPlacedAt, setOrderDetailsPlacedAt] = useState("");

    async function fetchOrders(isInitial = false) {
        try {
            setLoading(true);
            const data = await getAllOrders();
            setOrders(data);
            if (isInitial) {
                setIsInitialLoad(false);
            }
        } catch {
            setError("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders(true);
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    function filterOrders(tab: KitchenStatus) {
        if (tab === "new") return orders.filter((o) => o.status === "CONFIRMED");
        return orders.filter((o) => o.status === "PREPARING");
    }

    function calculateTabs() {
        return {
            new: orders.filter((o) => o.status === "CONFIRMED").length,
            preparing: orders.filter((o) => o.status === "PREPARING").length,
        };
    }

    return (
        <main>
            <NavBarKitchen />

            <div className="alertsPage">
                <StaffWelcome />

                <div className="orderContainer">
                    <div className="orderTabs">
                        <button
                            className={`orderTab ${activeTab === "new" ? "active" : ""}`}
                            onClick={() => setActiveTab("new")}
                        >
                            New ({calculateTabs().new})
                        </button>

                        <button
                            className={`orderTab ${activeTab === "preparing" ? "active" : ""}`}
                            onClick={() => setActiveTab("preparing")}
                        >
                            Preparing ({calculateTabs().preparing})
                        </button>

                    </div>

                    <div className="orderTitle">
                        <h2>{activeTab === "new" ? "NEW ORDERS" : "BEING PREPARED"}</h2>
                    </div>

                    <div className="topDivider" />

                    <div className="orderList">
                        {isInitialLoad && loading && (
                            <div className="emptyList">Loading orders...</div>
                        )}

                        {!isInitialLoad && filterOrders(activeTab).length === 0 && (
                            <div className="emptyList"> No orders in this section </div>
                        )}

                        {error && <div className="emptyList">{error}</div>}

                        {filterOrders(activeTab).map((order) => {
                            const placedMs = new Date(order.createdAt).getTime();
                            const ageMs = now - placedMs;

                            return (
                                <div
                                    key={order.id}
                                    className="orderRow"
                                    role="button"
                                    onClick={() => {
                                        setShowOrderDetails(true);
                                        setSelectedOrder(order);
                                        setOrderDetailsPlacedAt(calculatePlacedAt(ageMs));
                                    }}
                                >
                                    <div className="orderLeft">
                                        <div className="orderTopLeft">
                                            <div className="orderId">Order #{order.id}</div>
                                        </div>
                                        <div className="orderCustomerName">{order.customerName}</div>
                                    </div>

                                    <div className="orderLine" />

                                    <div className="orderMiddle">
                                        <div className="orderTableNo">Table No. {order.tableNumber}</div>
                                        <div className="orderPlacedAt">
                                            Placed {calculatePlacedAt(ageMs)}
                                        </div>
                                    </div>

                                    <div className="orderLine" />

                                    <div className="orderRight">
                                        <div className="orderPendingText">Pending Items</div>
                                        <div className="orderPendingItems">
                                            {pendingItemsSum(order.items)}
                                        </div>
                                    </div>

                                    <div className="orderArrow">
                                        <LuChevronRight />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {showOrderDetails && selectedOrder && (
                <KitchenOrderDetails
                    order={selectedOrder}
                    placedAtTime={orderDetailsPlacedAt}
                    onClose={() => {
                        setShowOrderDetails(false);
                        setSelectedOrder(null);
                    }}
                    onOrderUpdated={fetchOrders}
                />
            )}

            <StaffFooter />
        </main>
    );
}