import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavBar from "./data/components/NavBar";
import Footer from "./data/components/Footer";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown === 0) {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="order">
      <NavBar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          gap: "1rem",
          padding: "2rem",
        }}
      >
        <div style={{ fontSize: "4rem" }}>✅</div>
        <h1>Payment Successful!</h1>
        <p>Thank you for your order. Your payment has been confirmed.</p>
        {orderId && (
          <p>
            Your order ID: <strong>#{orderId}</strong>
          </p>
        )}
        <p style={{ color: "#888", fontSize: "0.9rem" }}>
          Redirecting to home in {countdown}s…
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 2rem",
            borderRadius: "8px",
            border: "none",
            background: "#4caf50",
            color: "white",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
      </div>
      <Footer />
    </div>
  );
}
