import { useState } from "react";
import "./css/Payment_page.css"
import NavBar from "./data/components/NavBar";
import Footer from "./data/components/Footer";

export default function PaymentPage() {
    const [ payment_method, setPaymentMethod] = useState<"cash" | "card" | null>(null);

    return (

        <main>
        <NavBar />
        <div className="info">


            <h1>Your details</h1>

            <div className="Input_group">
                <input type="text" placeholder="Full Name" />
                <input type="text" placeholder="Email address" />
            </div>

            <h2>Payment Method</h2>

            <div className="payment_options">
                <button
                    className={payment_method == "cash" ? "selected" : ""}
                    onClick={() => setPaymentMethod("cash")}
                >
                    Pay in cash
                </button>

                <button
                    className={payment_method == "card" ? "selected" : ""}
                    onClick={() => setPaymentMethod("card")}
                >
                    Pay by card
                </button>
            </div>

            {payment_method == "cash" && (
                <div className="cash_payment">
                    <input 
                        type="number"
                        placeholder="Table number (0-15)"
                        min="0"
                        max="15"
                    />
                </div>    
            )}

            {payment_method == "card" &&(
                <div className="card_payment">
                    <input type="text" placeholder="Card Number" />
                    <input type="text" placeholder="Name on card" />
                    <input type="text" placeholder="MM/YY" />
                    <input type="text" placeholder="CVV" />
                </div>
            )}

            <button className="submit_button">
                {payment_method == "card" ? "pay amount" : "Call waiter"}
            </button>
        </div>
        <Footer />
        </main>
    );
}