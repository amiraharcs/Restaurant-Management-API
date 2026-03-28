import NavBar from "./data/components/NavBar";
import Footer from "./data/components/Footer";
import HelpWidget from "./data/components/Help_widget";
import "./css/TrackOrder.css";
import { useState, useEffect } from "react";
import { LuChefHat, LuCircleCheck, LuClipboardList, LuThumbsUp, LuUtensils } from "react-icons/lu";
import { getOrder } from "./api/waiterApi";

type status = "PLACED" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
export type OrderResponse = {
    id: string;
    status: status;
    createdAt: string;
    tableNumber: number;
    customerName: string;
    customerPhoneNumber: string;
    items: { menuItemId: number; name: string; quantity: number }[];
};

const steps = [
    { id: "PLACED", title: "Order received", icon: <LuClipboardList />},
    { id: "CONFIRMED", title: "Order confirmed", icon: <LuThumbsUp />},
    { id: "PREPARING", title: "Being prepared", icon: <LuChefHat />},
    { id: "READY", title: "Ready for service", icon: <LuUtensils />},
    { id: "DELIVERED", title: "Order served", icon: <LuCircleCheck />},
]

export default function TrackOrder() {
    const [orderNo, setOrderNo] = useState("");
    const [order , setOrder] = useState<OrderResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function submitTrackOrder() {
        if (!orderNo.trim()) {
            setError("Invalid order number format");
            return;
        }

        const orderNum: number = Number(orderNo);
        if (isNaN(orderNum)) {
            setError("Invalid order number format");
            return;
        }

        try {
            setLoading(true);
            const foundOrder = await getOrder(orderNum);

            if (!foundOrder) {
                setOrder(null);
                setError("Order number not found. Please read the message above and try again");
                return;
            }

            setError(null);
            setOrder(foundOrder);
        } catch (err) {
            setError('Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!order || order.status === "DELIVERED" || order.status === "CANCELLED") return;

        const interval = setInterval(async () => {
            try {
                const updated = await getOrder(Number(orderNo));
                if (updated) setOrder(updated);
            } catch {
                setError('Failed to fetch order details');
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [order?.status]);

    function handleReset() {
        setOrder(null);
        setOrderNo("");
        setError(null);
    }

    const activeStep = order?.status ?? null;
    let activeIndex = -1;
    if (activeStep != null) {
        activeIndex = (steps.findIndex((s) => s.id === activeStep) + 1);
    }

    const served = activeStep === "DELIVERED";

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
                                    placeholder="e.g 8"
                                    pattern="[0-9]*"
                                    minLength={1}
                                />

                                <button className="trackOrderButton" type="submit" disabled={!orderNo.trim()}>
                                    {loading ? 'Tracking Progress...' : 'Track Progress'}
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
