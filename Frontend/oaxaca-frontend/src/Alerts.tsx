import { useState, useEffect } from "react";
import NavBarWaiter from "./data/components/NavBarWaiter";
import AlertDetails from "./data/components/AlertDetails";
import "./css/Alerts.css";

import mockAlertsData from "./data/mockAlertsData.json";

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

function timeAgo(iso: string) {
  const now = new Date();
  const created = new Date(iso);
  const mins = Math.floor((now.getTime() - created.getTime()) / 60000);
  return mins <= 0 ? "Just now" : `${mins} minute${mins > 1 ? "s" : ""} ago`;
}

export default function Alerts() {
  const [activeTab, setActiveTab] = useState("callWaiter");
  const [callWaiterAlerts, setCallWaiterAlerts] = useState<CallWaiterAlert[]>(
    [],
  );
  const [ordersReady, setOrdersReady] = useState<OrderReady[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<
    CallWaiterAlert | OrderReady | null
  >(null);

  // Load mock data from JSON on mount
  useEffect(() => {
    if (mockAlertsData) {
      setCallWaiterAlerts(mockAlertsData.mockCallWaiterAlerts || []);
      setOrdersReady(mockAlertsData.mockOrdersReady || []);
    }
  }, []);

  const handleMarkHandled = (id: number | string) => {
    setCallWaiterAlerts((alerts) =>
      alerts.map((a) => (a.id === id ? { ...a, handled: true } : a)),
    );
    setOrdersReady((alerts) =>
      alerts.map((a) => (a.id === id ? { ...a, handled: true } : a)),
    );
    setShowDetails(false);
    // TODO: PATCH /api/alerts/{id}/ack when backend is ready
  };

  return (
    <main>
      <NavBarWaiter />

      <div className="alertsPage">
        <h2 className="welcomeText"> Welcome, John Doe </h2>
        <div className="orderContainer">
          <div className="alertTabs">
            <button
              className={`alertTab ${activeTab === "callWaiter" ? "active" : ""}`}
              onClick={() => setActiveTab("callWaiter")}
            >
              Customer Requests (
              {callWaiterAlerts.filter((a) => !a.handled).length})
            </button>
            <button
              className={`alertTab ${activeTab === "ordersReady" ? "active" : ""}`}
              onClick={() => setActiveTab("ordersReady")}
            >
              Orders Ready ({ordersReady.filter((a) => !a.handled).length})
            </button>
          </div>
          {activeTab === "callWaiter" && (
            <div className="alertList">
              {callWaiterAlerts.filter((a) => !a.handled).length === 0 ? (
                <div className="emptyList">No new customer requests.</div>
              ) : (
                callWaiterAlerts
                  .filter((a) => !a.handled)
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className="alertCard"
                      onClick={() => {
                        setShowDetails(true);
                        setSelectedAlert(alert);
                      }}
                    >
                      <div className="orderLeft">
                        <div className="orderTopLeft">
                          <div className="orderId">
                            Table {alert.tableNumber}
                          </div>
                        </div>
                        <div className="orderCustomerName">
                          {alert.customerName}
                        </div>
                      </div>
                      <div className="orderLine" />
                      <div className="orderMiddle">
                        <div className="orderPlacedAt">
                          Created {timeAgo(alert.createdAt)}
                        </div>
                        <div className="orderMessage">{alert.message}</div>
                      </div>
                      <div className="orderLine" />
                      <div className="orderRight">
                        <div className="orderPendingText">Pending</div>
                        <div className="orderPendingItems">1</div>
                      </div>
                      <div className="orderArrow">&gt;</div>
                    </div>
                  ))
              )}
            </div>
          )}
          {activeTab === "ordersReady" && (
            <div className="alertList">
              {ordersReady.filter((a) => !a.handled).length === 0 ? (
                <div className="emptyList">No orders ready for pickup.</div>
              ) : (
                ordersReady
                  .filter((a) => !a.handled)
                  .map((order) => (
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
                          Placed {timeAgo(order.placedAt)}
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
                          handleMarkHandled(order.id);
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
              onMarkHandled={handleMarkHandled}
              isOrderReady={activeTab === "ordersReady"}
            />
          )}
        </div>
      </div>
    </main>
  );
}
