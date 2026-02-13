import { useState } from 'react';
import './css/Waiter.css';
import NavBarWaiter from "./data/components/NavBarWaiter";
import orderData from "./data/waiter.json";
import { LuChevronRight } from 'react-icons/lu';

type status = "new" | "preparing" | "ready" ;

export default function Waiter() {
    const [activeTab, setActiveTab] = useState<status>("new");

    const orders = orderData.orders;

    // dummy data for amount of orders shown on the tabs
    const count = {
        requests: 2,
        preparing: 1,
        completed: 0,
    };

    function filterOrders(tab : status) {
        const activeOrders = orders.filter((order) => order.status === tab);
        return activeOrders;
    }
    
    function pendingItemsSum(items : { name: string ;qty: number }[]) {
        let count = 0;
        Object.values(items).forEach((item) => count += item.qty)
        return count;
    }

    return (
        <main>
            <NavBarWaiter />
            
            <div className='waiterPage'>

                <h2 className='welcomeText'> Welcome, John Doe </h2>

                <div className='orderContainer'>
                    <div className='orderTabs'>
                        <button className={`orderTab ${activeTab === "new" ? "active" : ""}`} onClick={() => setActiveTab("new")}>
                            New ({count.requests})
                        </button>

                        <button className={`orderTab ${activeTab === "preparing" ? "active" : ""}`} onClick={() => setActiveTab("preparing")}>
                            Preparing ({count.preparing})
                        </button>

                        <button className={`orderTab ${activeTab === "ready" ? "active" : ""}`} onClick={() => setActiveTab("ready")}>
                            Ready ({count.completed})
                        </button>
                    </div>

                    <div className='orderTitle'>
                        <h2>{activeTab.toUpperCase()} ORDERS</h2>
                    </div>

                    <div className='orderList'>
                        {filterOrders(activeTab).length === 0 && <div className='emptyList'> No orders in this section </div>}

                        {filterOrders(activeTab).map((order) => {
                            return (
                                <div key={order.orderId} className='orderRow' role='button'>
                                    <div className='orderLeft'>
                                        <div className='orderTopLeft'>
                                            <div className='orderId'>Order #{order.orderId}</div>
                                        </div>
                                        <div className='orderCustomerName'>{order.customerName}</div>
                                    </div>

                                    <div className='orderLine' />

                                    <div className='orderMiddle'>
                                        <div className='orderTableNo'>Table No. {order.tableNo}</div> 
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
        </main>
    )
}