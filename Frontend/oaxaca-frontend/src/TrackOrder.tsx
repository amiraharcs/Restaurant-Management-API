import NavBar from "./data/components/NavBar";
import Footer from "./data/components/Footer";
import HelpWidget from "./data/components/Help_widget";
import "./css/TrackOrder.css";
import { useState } from "react";
import orderData from "./data/waiter.json";
import { LuChefHat, LuCircleCheck, LuClipboardList, LuThumbsUp, LuUtensils } from "react-icons/lu";

type status = "received" | "confirmed" | "preparing" | "ready" | "served";
type OrderResponse = {
    orderId: string;
    customerName: string;
    tableNo: number;
    placedAt: string;
    status: status;
    items: { name: string; qty: number }[];
};
type MockData = { orders: OrderResponse[] };
const typedOrderData = orderData as MockData;

const steps = [
    { id: "received", title: "Order received", icon: <LuClipboardList />},
    { id: "confirmed", title: "Order confirmed", icon: <LuThumbsUp />},
    { id: "preparing", title: "Being prepared", icon: <LuChefHat />},
    { id: "ready", title: "Ready for service", icon: <LuUtensils />},
    { id: "served", title: "Order served", icon: <LuCircleCheck />},
]

export default function TrackOrder() {
    const [orderNo, setOrderNo] = useState("");
    const [order , setOrder] = useState<OrderResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function submitTrackOrder() {
        if (!orderNo.trim()) return;

        const foundOrder = typedOrderData.orders.find(
            (o) => o.orderId === orderNo.trim()
        );

        if (!foundOrder) {
            setOrder(null);
            setError("Order number not found. Please read the message above and try again");
            return;
        }

        setError(null);
        setOrder(foundOrder);
    }

    function handleReset() {
        setOrder(null);
        setOrderNo("");
        setError(null);
    }

    const activeStep = order?.status ?? null;
    let activeIndex = -1;
    if (activeStep != null) {
        activeIndex = steps.findIndex((s) => s.id === activeStep);
    }

    const served = activeStep === "served";

    return (
        <main>
        <NavBar />

        <div className="trackOrderPage">
            <section className="panel">
                <div className="innerPanel">
                    {!order ? (
                        <>
                            <h1 className="trackOrderTitle">Please enter your</h1>
                            <h1 className="trackOrderTitle">order number:</h1>

                            <form 
                                className="trackOrderForm" 
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    await submitTrackOrder();
                                }}>
                            
                                <label className="trackOrderLabel">
                                    Order Number:
                                </label>

                                <input
                                    id="orderNo"
                                    name="orderNo"
                                    className="trackOrderInput"
                                    value={orderNo}
                                    onChange={(e) => setOrderNo(e.target.value)}
                                    placeholder="019"
                                    pattern="[0-9]*"
                                    minLength={3}
                                />

                                <button className="trackOrderButton" type="submit" disabled={!orderNo.trim()}>
                                    Track Progress
                                </button>

                                <p className="trackOrderHint">You can find your order number on your receipt or confirmation page.</p>

                                {error && <p className="trackOrderError">{error}</p>}
                            </form>
                        </>
                    ) : (
                        <>
                            <h1 className="trackOrderTitle">No Stress...</h1>
                            <h1 className="trackOrderTitle">We got your order!</h1>

                            <div className="stepsRow">
                                {steps.map((step, index) => {
                                    const done = index < activeIndex;
                                    const current = index === activeIndex;

                                    return (
                                        <div
                                            key={step.id}
                                            className={`stepsItem ${done ? "isDone" : ""} ${current ? "isCurrent" : ""} ${served ? "isServed" : ""}`}
                                        >
                                            <div className="stepsIconWrap">
                                                <div className="stepsIcon">{step.icon}</div>
                                            </div>
                                            <div className="stepsLabel">{step.title}</div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="trackOrderDetails">
                                {served && <h2>Thank you for dining with us!</h2>}
                                <button className="trackOrderResetButton" type="button" onClick={handleReset}>
                                    Track another order
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>

            <HelpWidget />
        </div>

        <Footer />
        </main>
    );
}
