import { useState } from 'react';
import './css/Alerts.css';
import NavBarWaiter from "./data/components/NavBarWaiter"

type alertType = "callWaiter" | "orderReady";

export default function Alerts() {
    const [activeTab, setActiveTab] = useState<alertType>("callWaiter");

    // dummy data for amount of alerts shown on the tabs
    const count = {
        callWaiter: 3,
        orderReady: 2,
    };

    return (
        <main>
            <NavBarWaiter />
            
            <div className='alertsPage'>

                <div className='alertTabs'>
                    <button className={`alertTab ${activeTab === "callWaiter" ? "active" : ""}`} onClick={() => setActiveTab("callWaiter")}>
                        Call Waiter ({count.callWaiter})
                    </button>

                    <button className={`alertTab ${activeTab === "orderReady" ? "active" : ""}`} onClick={() => setActiveTab("orderReady")}>
                        Order Ready ({count.orderReady})
                    </button>
                </div>

                <div className='alertTitle'>
                    <h2>{activeTab === "callWaiter" ? "CUSTOMER CALL ALERTS" : "KITCHEN ORDER READY"}</h2>
                </div>
            </div>
        </main>
    )
}
