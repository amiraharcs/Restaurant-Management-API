import { useEffect, useState } from 'react';
import './css/Waiter.css';
import NavBarWaiter from "./data/components/NavBarWaiter";
import orderData from "./data/waiter.json";
import mockAlertsData from "./data/mockAlertsData.json";
import { getTotalNotifications } from "./data/notificationCount.ts";
import { LuChevronRight } from 'react-icons/lu';
import OrderDetails from './data/components/showOrderDetails';
import StaffFooter from "./data/components/StaffFooter";
import StaffWelcome from "./data/components/StaffWelcome";

type status = "new" | "preparing" | "ready";
type Order = {
    orderId: string;
    customerName: string;
    tableNo: number;
    placedAt: string;
    status: status;
    items: { name: string; qty: number }[];
};

function pendingItemsSum(items : { qty: number }[]) {
    let count = 0;
    Object.values(items).forEach((item) => count += item.qty)
    return count;
}

function calculatePlacedAt(ms : number) {
    const mins = Math.floor(ms / 60000);
    if (mins < 1){
        return "<1 minute ago"
    }
    return `${mins} minutes ago`
}

export default function Waiter() {
    const [activeTab, setActiveTab] = useState<status>("new");

    // dummy data from waiter.json
    const orders = (orderData as { orders: Order[]}).orders;

    function filterOrders(tab : status) {
        const activeOrders = orders.filter((order) => order.status === tab);
        return activeOrders;
    }

    function calculateTabs() {
        const count = {
            new: 0,
            preparing: 0,
            ready: 0
        };
        for ( const s of orders ) {
            count[s.status] += 1;
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

    const totalNotifications = getTotalNotifications(
        mockAlertsData.mockCallWaiterAlerts || [],
        mockAlertsData.mockOrdersReady || [],
    );

    return (
        <main>
            <NavBarWaiter notificationCount={totalNotifications} />
            
            <div className='waiterPage'>
                <StaffWelcome />

                <div className='orderContainer'>
                    <div className='orderTabs'>
                        <button className={`orderTab ${activeTab === "new" ? "active" : ""}`} onClick={() => setActiveTab("new")}>
                            New ({calculateTabs().new})
                        </button>

                        <button className={`orderTab ${activeTab === "preparing" ? "active" : ""}`} onClick={() => setActiveTab("preparing")}>
                            Preparing ({calculateTabs().preparing})
                        </button>

                        <button className={`orderTab ${activeTab === "ready" ? "active" : ""}`} onClick={() => setActiveTab("ready")}>
                            Ready ({calculateTabs().ready})
                        </button>
                    </div>

                    <div className='orderTitle'>
                        <h2>{activeTab.toUpperCase()} ORDERS</h2>
                    </div>

                    <div className='topDivider' />

                    <div className='orderList'>
                        {filterOrders(activeTab).length === 0 && <div className='emptyList'> No orders in this section </div> }

                        {filterOrders(activeTab).map((order) => {
                            const placedMs = new Date(order.placedAt).getTime();
                            const ageMs = now - placedMs;

                            return (
                                <div key={order.orderId} className='orderRow' role='button' onClick={() => {setShowOrderDetails(true); setSelectedOrder(order); setorderDetailsPlacedAt(calculatePlacedAt(ageMs));}}>
                                    <div className='orderLeft'>
                                        <div className='orderTopLeft'>
                                            <div className='orderId'>Order #{order.orderId}</div>
                                        </div>
                                        <div className='orderCustomerName'>{order.customerName}</div>
                                    </div>

                                    <div className='orderLine' />

                                    <div className='orderMiddle'>
                                        <div className='orderTableNo'>Table No. {order.tableNo}</div>
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
            {showOrderDetails && <OrderDetails order={selectedOrder} placedAtTime={orderDetailsPlacedAt} onClose={() => {
                setShowOrderDetails(false)
                setSelectedOrder({})
            }}/>}

            <StaffFooter />
        </main>
    )
}