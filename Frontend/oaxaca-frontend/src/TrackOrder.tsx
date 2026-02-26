import NavBar from "./data/components/NavBar";
import Footer from "./data/components/Footer";
import HelpWidget from "./data/components/Help_widget";
import "./css/TrackOrder.css";
import { useState } from "react";

export default function TrackOrder() {
  const [orderNo, setOrderNo] = useState("");

  return (
    <main>
      <NavBar />

      <div className="trackOrderPage">
        <section className="panel">
          <div className="innerPanel">
            <h1 className="trackOrderTitle">Please enter your</h1>
            <h1 className="trackOrderTitle">order number:</h1>

            <form className="trackOrderForm">
              <label className="trackOrderLabel">
                Order Number:
              </label>

              <input
                id="orderNo"
                className="trackOrderInput"
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                placeholder="007"
                inputMode="numeric"
              />

              <button className="trackOrderButton" type="submit" disabled={!orderNo.trim()}>
                Track Progress
              </button>

              <p className="trackOrderHint">You can find your order number on your receipt or confirmation page.</p>
            </form>
          </div>
        </section>

        <HelpWidget />
      </div>

      <Footer />
    </main>
  );
}
