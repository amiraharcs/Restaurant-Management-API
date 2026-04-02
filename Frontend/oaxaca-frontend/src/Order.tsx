import "./css/Order.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import NavBar from "./data/components/NavBar";
import { useState } from "react";
import Footer from "./data/components/Footer";
import { placeOrder } from "./api/orderApi";

export default function Order() {
  const location = useLocation();
  const basket = location.state?.basket;
  const navigate = useNavigate();

  //Store user selected payment method
  const [payment_method, setPaymentMethod] = useState<"cash" | "card" | null>(null);

  //Structure of a menu item
  type MenuItem = {
    id?: number;
    name: string;
    description: string;
    price: number;
    calories: number;
    isAvailable: boolean;
    ingredients: string[];
    allergens: string[];
    filters: string[];
    image: string;
    itemType?: string;
  };

  //Structure of a basket item
  type BasketItem = {
    item: MenuItem;
    quantity: number;
  };

  //Strucutre of backend order response
  type OrderResponse = {
    orderId: number;
    status: string;
  };

  //Controls confirmation popup and loading state
  const [confirmedOrder, showConfirmedOrder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(null);

  //Calculate total order price
  const total = basket.reduce(
    (sum: number, basketItem: BasketItem) =>
      sum + basketItem.item.price * basketItem.quantity,
    0,
  );

  //Submit order to backend
  async function submitOrder(formData: FormData) {
    if (loading) return;
    setLoading(true);

    const name = formData.get("name");
    const phoneNumber = formData.get("phoneNumber");
    const tableNumberRaw = formData.get("tableNumber");

    //Convert basket into API order item format
    const items = basket.map((item: BasketItem) => ({
      menuItemId: item.item.id,
      quantity: item.quantity,
    }));

    try {
      const response = await placeOrder({
        name,
        phoneNumber,
        tableNumber: Number(tableNumberRaw),
        items,
        paymentStatus: "UNPAID",
      });

      const newOrderId = response.orderId;

      // Card payments redirect user to Stripe checkout
      if (payment_method === "card") {
        const res = await fetch(`/api/orders/${newOrderId}/checkout`, {
          method: "POST",
        });

        if (!res.ok) {
          throw new Error("Failed to create Stripe session");
        }

        const { checkoutUrl } = await res.json();

        await fetch(`/api/orders/${newOrderId}/paid`, {
          method: "PATCH",
        });

        window.location.href = checkoutUrl;
      } else {
        // Cash payments show confirmation immediately
        setOrderResponse(response);
        showConfirmedOrder(true);
      }
    } catch (e: any) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="order">
      <NavBar />
      <div className="order_header">
        <h1>Order</h1>
        <FaLock className="order_header_lock" />
      </div>

      <div className="order_main">
        <div className="order_left">
          <h3 className="order_left_title">Your Details</h3>
          {/* Customer details form */}
          <form
            className="order_form"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              submitOrder(formData);
            }}
          >
              <input
                className="input_box"
                type="text"
                placeholder="Firstname"
                name="name"
                required
                pattern="[A-Za-z ]+"
                minLength={1}
                title="Enter a name"
              />
            <div>
              <input
                className="input_box"
                type="tel"
                placeholder="Phone Number"
                name="phoneNumber"
                required
                pattern="(07[0-9]{9}|\+447[0-9]{9})"
                title="Enter a valid UK mobile number"
              />
            </div>
            <div>
              <input
                className="input_box"
                type="number"
                placeholder="Table Number"
                name="tableNumber"
                required
                min={1}
                max={10}
                title="There are only 10 tables"
              />
            </div>

            <h2>Payment Method</h2>

            {/* Payment method selection */}
            <div className="payment_options">
              <button
                type="button"
                className={payment_method === "cash" ? "selected" : ""}
                onClick={() => setPaymentMethod("cash")}
              >
                Pay in cash
              </button>
              <button
                type="button"
                className={payment_method === "card" ? "selected" : ""}
                onClick={() => setPaymentMethod("card")}
              >
                Pay by card
              </button>
            </div>

            {/* Extra message for card payments */}
            {payment_method === "card" && (
              <div className="card_payment_info">
                <p>🔒 You'll be redirected to Stripe's secure payment page to complete your payment.</p>
              </div>
            )}

            {/* Submit order */}
            <button
              type="submit"
              className="order_button"
              disabled={loading || !payment_method}
            >
              {loading
                ? "Processing..."
                : payment_method === "card"
                ? "Proceed to Payment →"
                : "Place Order"}
            </button>
          </form>
        </div>

        <div className="order_right">
          <div>
            <h3 className="order_right_title">Your Order</h3>
            {/* Basket summary */}
            <div className="order_right_items">
              {basket.map((basketItem: BasketItem) => (
                <div className="order_right_item" key={basketItem.item.name}>
                  <img
                    src={basketItem.item.image}
                    alt={basketItem.item.name}
                    className="order_right_item_image"
                  />
                  <div className="order_right_item_text">
                    <div className="order_right_item_text_details">
                      <p className="order_right_item_name">
                        {basketItem.item.name}
                      </p>
                      <p className="order_right_item_quantity">
                        Quantity: {basketItem.quantity}
                      </p>
                    </div>
                    <p className="order_right_item_price">
                      £{(basketItem.item.price * basketItem.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Total price */}
            <p className="order_right_total">
              Total:{" "}
              <span className="order_right_total_span">
                £{total.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation popup for cash orders */}
      {confirmedOrder && (
        <div className="confirm_order_main">
          <div
            className="confirm_order_main_backdrop"
            onClick={() => {
              showConfirmedOrder(false);
              navigate("/track-order");
            }}
          ></div>
          <div className="confirm_order_main_content">
            <button
              className="confirm_order_main_close"
              onClick={() => {
                showConfirmedOrder(false);
                navigate("/track-order");
              }}
            >
              x
            </button>
            <div className="confirm_order_container">
              <div className="confirm_order_card">
                <SiTicktick className="confirm_order_tick" />
                <h3 className="confirm_order_main_title">Order Confirmed!</h3>
                <p>Thank you for ordering with us.</p>
                <p>Your food is being prepared and will be ready soon.</p>

                {/* Display generated order ID */}
                <div className="confirm_order_id_box">
                  <span className="confirm_order_id_label">Order ID:</span>
                  <span className="confirm_order_id_value">
                    #{orderResponse?.orderId}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
