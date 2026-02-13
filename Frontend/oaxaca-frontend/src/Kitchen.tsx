import { useState } from 'react';
import './css/Waiter.css';
import NavBarWaiter from "./data/components/NavBarWaiter"

type status = "new" | "preparing" | "completed" ;

export default function Kitchen() {
    const [activeTab, setActiveTab] = useState<status>("new");

    // dummy data for amount of orders shown on the tabs
    const count = {
        requests: 2,
        preparing: 1,
        completed: 0,
    };

    return (
        <main>
            <NavBarWaiter />
            
            <div className='waiterPage'>

                <div className='orderTabs'>
                    <button className={`orderTab ${activeTab === "new" ? "active" : ""}`} onClick={() => setActiveTab("new")}>
                        New ({count.requests})
                    </button>

                    <button className={`orderTab ${activeTab === "preparing" ? "active" : ""}`} onClick={() => setActiveTab("preparing")}>
                        Preparing ({count.preparing})
                    </button>

                    <button className={`orderTab ${activeTab === "completed" ? "active" : ""}`} onClick={() => setActiveTab("completed")}>
                        Completed ({count.completed})
                    </button>
                </div>

                <div className='orderTitle'>
                    <h2>{activeTab.toUpperCase()} ORDERS</h2>
                </div>
            </div>
        </main>
    )
}