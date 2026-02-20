import { useState, useEffect } from "react";
import NavBarWaiter from "./data/components/NavBarWaiter";
import AlertDetails from "./data/components/AlertDetails";
import "./css/Alerts.css";

import mockAlertsData from "./data/mockAlertsData.json";
import { getTotalNotifications } from "./data/notificationCount.ts";
import StaffFooter from "./data/components/StaffFooter.tsx";
import {
  fetchCallWaiterAlerts,
  markCallWaiterAlertHandled,
} from "./api/alertsApi";
import StaffWelcome from "./data/components/StaffWelcome";

type CallWaiterAlert = {
  id: number;
  tableNumber: number;
  customerName: string;
  message: string;
  createdAt: string;
  handled: boolean;
};

type OrderReady = {
  id: string;
  customerName: string;
  tableNumber: number;
  placedAt: string;
  status: string;
  items: { name: string; qty: number }[];
  handled: boolean;
};

function timeAgo(iso: string, nowMs = Date.now()) {
  const createdMs = new Date(iso).getTime();
  const mins = Math.max(0, Math.floor((nowMs - createdMs) / 60000));

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    const remainingMins = mins % 60;
    return remainingMins === 0
      ? `${hours} hour${hours > 1 ? "s" : ""} ago`
      : `${hours}h ${remainingMins}m ago`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours === 0
    ? `${days} day${days > 1 ? "s" : ""} ago`
    : `${days}d ${remainingHours}h ago`;
}

export default function Alerts() {
  const [activeTab, setActiveTab] = useState<"callWaiter" | "ordersReady">(
    "callWaiter",
  );
  const [callWaiterAlerts, setCallWaiterAlerts] = useState<CallWaiterAlert[]>(
    [],
  );
  const [ordersReady, setOrdersReady] = useState<OrderReady[]>([]);
  const [nowMs, setNowMs] = useState(Date.now());
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<
    CallWaiterAlert | OrderReady | null
  >(null);

  // Load data on mount
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setCallWaiterAlerts(await fetchCallWaiterAlerts());
      } catch {
        setCallWaiterAlerts([]);
      }

      if (mockAlertsData) {
        setOrdersReady(mockAlertsData.mockOrdersReady || []);
      }
    };

    loadAlerts();
  }, []);

  useEffect(() => {
    const refreshTimer = window.setInterval(async () => {
      try {
        setCallWaiterAlerts(await fetchCallWaiterAlerts());
      } catch {}
    }, 5000);

    return () => window.clearInterval(refreshTimer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 30000);

    return () => window.clearInterval(timer);
  }, []);

  const handleMarkCallWaiterHandled = async (id: number) => {
    try {
      await markCallWaiterAlertHandled(id);
    } catch {
      return;
    }

    setCallWaiterAlerts((alerts) =>
      alerts.map((a) => (a.id === id ? { ...a, handled: true } : a)),
    );
    setShowDetails(false);
  };

  const handleMarkOrderHandled = (id: string) => {
    setOrdersReady((alerts) =>
      alerts.map((a) => (a.id === id ? { ...a, handled: true } : a)),
    );
    setShowDetails(false);
  };

  const unhandledCallWaiterAlerts = callWaiterAlerts.filter((a) => !a.handled);
  const unhandledOrdersReady = ordersReady.filter((a) => !a.handled);
  const totalNotifications = getTotalNotifications(
    unhandledCallWaiterAlerts,
    unhandledOrdersReady,
  );

  return (
    <main>
      <NavBarWaiter notificationCount={totalNotifications} />

      <div className="alertsPage">
        <StaffWelcome />
        <div className="orderContainer">
          <div className="alertTabs">
            <button
              className={`alertTab ${activeTab === "callWaiter" ? "active" : ""}`}
              onClick={() => setActiveTab("callWaiter")}
            >
              Customer Requests ({unhandledCallWaiterAlerts.length})
            </button>
            <button
              className={`alertTab ${activeTab === "ordersReady" ? "active" : ""}`}
              onClick={() => setActiveTab("ordersReady")}
            >
              Orders Ready ({unhandledOrdersReady.length})
            </button>
          </div>
          {activeTab === "callWaiter" && (
            <div className="alertList">
              {unhandledCallWaiterAlerts.length === 0 ? (
                <div className="emptyList">No new customer requests.</div>
              ) : (
                unhandledCallWaiterAlerts.map((alert) => (
                  <div key={alert.id} className="requestCard">
                    <button
                      className="requestCloseBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                            handleMarkCallWaiterHandled(alert.id);
                      }}
                    >
                      ×
                    </button>
                    <div className="requestCardBox">
                      <div className="requestHeader">
                        <span className="info-btn">ⓘ</span>
                        <div className="requestContent">
                          <span className="requestTable">
                            Table number: {alert.tableNumber}
                          </span>
                          <div className="requestCustomerName">
                            {alert.customerName}
                          </div>
                          <p className="requestMessage">{alert.message}</p>
                          <div className="requestAge">
                            Requested {timeAgo(alert.createdAt, nowMs)}
                          </div>
                        </div>
                      </div>
                      <button
                        className="dismiss-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkCallWaiterHandled(alert.id);
                        }}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {activeTab === "ordersReady" && (
            <div className="alertList">
              {unhandledOrdersReady.length === 0 ? (
                <div className="emptyList">No orders ready for pickup.</div>
              ) : (
                unhandledOrdersReady.map((order) => (
                  <div
                    key={order.id}
                    className="alertCard"
                    onClick={() => {
                      setShowDetails(true);
                      setSelectedAlert(order);
                    }}
                  >
                    <div className="orderLeft">
                      <div className="orderTopLeft">
                        <div className="orderId">Order #{order.id}</div>
                      </div>
                      <div className="orderCustomerName">
                        {order.customerName}
                      </div>
                    </div>
                    <div className="orderLine" />
                    <div className="orderMiddle">
                      <div className="orderTableNo">
                        Table No. {order.tableNumber}
                      </div>
                      <div className="orderPlacedAt">
                        Placed {timeAgo(order.placedAt, nowMs)}
                      </div>
                    </div>
                    <div className="orderLine" />
                    <div className="orderRight">
                      <div className="orderPendingText">Items</div>
                      <div className="orderPendingItems">
                        {order.items.length}
                      </div>
                    </div>
                    <button
                      className="popupBtn confirmBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkOrderHandled(order.id);
                      }}
                    >
                      Delivered
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
          {showDetails && selectedAlert && (
            <AlertDetails
              alert={selectedAlert}
              onClose={() => {
                setShowDetails(false);
                setSelectedAlert(null);
              }}
              onMarkHandled={
                activeTab === "ordersReady"
                  ? (id: string) => handleMarkOrderHandled(id)
                  : (id: number) => void handleMarkCallWaiterHandled(id)
              }
              isOrderReady={activeTab === "ordersReady"}
            />
          )}
        </div>
      </div>
      <StaffFooter />
    </main>
  );
}
