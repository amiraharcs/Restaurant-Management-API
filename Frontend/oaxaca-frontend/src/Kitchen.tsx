import { useState } from "react";
import "./css/Kitchen.css";
import { LuChevronRight } from "react-icons/lu";
import orderData from "./data/waiter.json";
import NavBarKitchen from "./data/components/NavBarKitchen";
import OrderDetails from "./data/components/showOrderDetails";
import StaffFooter from "./data/components/StaffFooter";

type KitchenStatus = "new" | "preparing" | "ready";

type KitchenOrder = {
    orderId: string;
    customerName: string;
    tableNo: number;
    placedAt: string;
    status: KitchenStatus;
    items: { name: string; qty: number }[];
};

function pendingItemsSum(items: { qty: number }[]) {
    let count = 0;
    Object.values(items).forEach((item) => {
        count += item.qty;
    });
    return count;
}

function calculatePlacedAt(ms: number) {
    const mins = Math.floor(ms / 60000);
    if (mins < 1) {
        return "<1 minute ago";
    }
    return `${mins} minutes ago`;
}

export default function Kitchen() {
    const [activeTab, setActiveTab] = useState<KitchenStatus>("new");
    const [now, setNow] = useState(Date.now());
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<KitchenOrder | null>(null);
    const [orderDetailsPlacedAt, setOrderDetailsPlacedAt] = useState("");

    setInterval(() => setNow(Date.now()), 1000);

    const orders = (orderData as { orders: KitchenOrder[] }).orders;

    function filterOrders(tab: KitchenStatus) {
        return orders.filter((order) => order.status === tab);
    }

    function calculateTabs() {
        const count = {
            new: 0,
            preparing: 0,
            ready: 0,
        };

        for (const order of orders) {
            count[order.status] += 1;
        }
        return count;
    }

    return (
        <main>
            <NavBarKitchen />

            <div className="alertsPage">
                <h2 className="welcomeText"> Welcome, John Doe </h2>

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

                        <button
                            className={`orderTab ${activeTab === "ready" ? "active" : ""}`}
                            onClick={() => setActiveTab("ready")}
                        >
                            Ready ({calculateTabs().ready})
                        </button>
                    </div>

                    <div className="orderTitle">
                        <h2>{activeTab.toUpperCase()} ORDERS</h2>
                    </div>

                    <div className="topDivider" />

                    <div className="orderList">
                        {filterOrders(activeTab).length === 0 && (
                            <div className="emptyList"> No orders in this section </div>
                        )}

                        {filterOrders(activeTab).map((order) => {
                            const placedMs = new Date(order.placedAt).getTime();
                            const ageMs = now - placedMs;

                            return (
                                <div
                                    key={order.orderId}
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
                                            <div className="orderId">Order #{order.orderId}</div>
                                        </div>
                                        <div className="orderCustomerName">{order.customerName}</div>
                                    </div>

                                    <div className="orderLine" />

                                    <div className="orderMiddle">
                                        <div className="orderTableNo">Table No. {order.tableNo}</div>
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
                <OrderDetails
                    order={selectedOrder}
                    placedAtTime={orderDetailsPlacedAt}
                    onClose={() => {
                        setShowOrderDetails(false);
                        setSelectedOrder(null);
                    }}
                />
            )}

            <StaffFooter />
        </main>
    );
}