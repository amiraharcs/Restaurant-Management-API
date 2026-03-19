import { useEffect, useState } from "react";
import NavBarManager from "./data/components/NavBarManager";
import { fetchAllOrders, fetchManagerrMenu } from "./api/managerApi";
import type { MenuItemDto } from "./api/managerApi";
import { fetchCallWaiterAlerts } from "./api/alertsApi";
import type { CallWaiterAlert } from "./api/alertsApi";
import type { OrderResponse } from "./api/waiterApi";
import "./css/Manager.css";

const TABLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const STATUS_LABELS: Record<string, string> = {
    PLACED: "New",
    CONFIRMED: "Accepted",
    PREPARING: "Prepping",
    READY: "Waiting on Delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

const STATUS_CLASSES: Record<string, string> = {
    PLACED: "status_new",
    CONFIRMED: "status_accepted",
    PREPARING: "status_prepping",
    READY: "status_waiting",
    DELIVERED: "status_delivered",
    CANCELLED: "status_cancelled",
};

function timeAgo(isoString: string): string {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
}

function isActiveOrder(order: OrderResponse): boolean {
    if (order.status === "CANCELLED") return false;
    if (order.status === "DELIVERED" && order.paymentStatus === "PAID") return false;
    return true;
}

type TableBoxProps = {
    tableNumber: number;
    orders: OrderResponse[];
    alerts: CallWaiterAlert[];
};

function TableBox({ tableNumber, orders, alerts }: TableBoxProps) {
    const [tab, setTab] = useState<"orders" | "requests">("orders");
    const activeOrders = orders.filter(o => o.tableNumber === tableNumber && isActiveOrder(o));
    const tableAlerts = alerts.filter(a => a.tableNumber === tableNumber);
    const isEmpty = activeOrders.length === 0 && tableAlerts.length === 0;

    return (
        <div className={`table_box${isEmpty ? " empty" : ""}`}>
            <div className={`table_box_header${isEmpty ? " empty_header" : ""}`}>
                <span>Table {tableNumber}</span>
                {activeOrders.length > 0 && (
                    <span className="table_order_count">{activeOrders.length}</span>
                )}
            </div>
            <div className="table_inner_toggle">
                <button
                    className={`table_inner_tab${tab === "orders" ? " active" : ""}`}
                    onClick={() => setTab("orders")}
                >
                    Orders
                </button>
                <button
                    className={`table_inner_tab${tab === "requests" ? " active" : ""}`}
                    onClick={() => setTab("requests")}
                >
                    Requests {tableAlerts.length > 0 && `(${tableAlerts.length})`}
                </button>
            </div>
            <div className="table_box_body">
                {tab === "orders" && (
                    activeOrders.length === 0
                        ? <span className="table_empty_msg">No active orders</span>
                        : activeOrders.map(order => (
                            <div key={order.id} className="order_row">
                                <span className="order_row_waiter">
                                    {order.assignedWaiter ?? "Unassigned"}
                                </span>
                                <div className="order_row_badges">
                                    <span className={`order_status_badge ${STATUS_CLASSES[order.status] ?? ""}`}>
                                        {STATUS_LABELS[order.status] ?? order.status}
                                    </span>
                                    <span className={`payment_badge ${order.paymentStatus === "PAID" ? "payment_paid" : "payment_unpaid"}`}>
                                        {order.paymentStatus === "PAID" ? "Paid" : "Unpaid"}
                                    </span>
                                </div>
                            </div>
                        ))
                )}
                {tab === "requests" && (
                    tableAlerts.length === 0
                        ? <span className="table_empty_msg">No requests</span>
                        : tableAlerts.map(alert => {
                            const isWaiter = alert.customerName.startsWith("Waiter (");
                            return (
                                <div key={alert.id} className="request_row">
                                    <span className={`request_source ${isWaiter ? "waiter" : "customer"}`}>
                                        {isWaiter ? "Staff" : "Customer"} — {alert.customerName}
                                    </span>
                                    <span className="request_message">{alert.message}</span>
                                    <span className="request_time">{timeAgo(alert.createdAt)}</span>
                                </div>
                            );
                        })
                )}
            </div>
        </div>
    );
}

export default function OperationsOverview() {
    const [view, setView] = useState<"tables" | "stock">("tables");
    const [stockTab, setStockTab] = useState<"in" | "out">("in");
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [alerts, setAlerts] = useState<CallWaiterAlert[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItemDto[]>([]);

    useEffect(() => {
        async function load() {
            try {
                const [o, a, m] = await Promise.all([
                    fetchAllOrders(),
                    fetchCallWaiterAlerts(),
                    fetchManagerrMenu(),
                ]);
                setOrders(o);
                setAlerts(a);
                setMenuItems(m);
            } catch {}
        }
        load();
        const id = setInterval(load, 5000);
        return () => clearInterval(id);
    }, []);

    const filteredStock = menuItems.filter((item: any) =>
        stockTab === "in" ? item.isAvailable : !item.isAvailable
    );

    return (
        <div className="overview_page" style={{ paddingTop: "calc(7% + 80px)" }}>
            <NavBarManager />

            <div className="overview_top_toggle">
                <button
                    className={`overview_tab${view === "tables" ? " active" : ""}`}
                    onClick={() => setView("tables")}
                >
                    Tables
                </button>
                <button
                    className={`overview_tab${view === "stock" ? " active" : ""}`}
                    onClick={() => setView("stock")}
                >
                    Stock
                </button>
            </div>

            {view === "tables" && (
                <div className="tables_grid">
                    {TABLES.map(n => (
                        <TableBox key={n} tableNumber={n} orders={orders} alerts={alerts} />
                    ))}
                </div>
            )}

            {view === "stock" && (
                <div>
                    <div className="stock_inner_toggle">
                        <button
                            className={`stock_tab${stockTab === "in" ? " active" : ""}`}
                            onClick={() => setStockTab("in")}
                        >
                            In Stock
                        </button>
                        <button
                            className={`stock_tab${stockTab === "out" ? " active" : ""}`}
                            onClick={() => setStockTab("out")}
                        >
                            Out of Stock
                        </button>
                    </div>
                    <div className="stock_grid">
                        {filteredStock.length === 0 ? (
                            <span style={{ color: "#9ca3af", fontWeight: 600 }}>
                                No items to show
                            </span>
                        ) : (
                            filteredStock.map(item => (
                                <div key={item.id} className="stock_item">
                                    <span className={`stock_dot ${ (item as any).isAvailable ? "in" : "out"}`} />
                                    <div>
                                        <div className="stock_item_name">{item.name}</div>
                                        <span className="stock_item_type">{item.itemType}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
