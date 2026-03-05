import "./css/Order.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import NavBar from "./data/components/NavBar";
import { useState } from "react";
import Footer from "./data/components/Footer";
import { placeOrder } from "./api/orderApi";

export default function Order() {
  const location = useLocation();
  const basket = location.state?.basket;

  const navigate = useNavigate();

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

  type BasketItem = {
    item: MenuItem;
    quantity: number;
  };

  type OrderResponse = {
  orderId: number;
  status: string;
};

  const [confirmedOrder, showConfirmedOrder] = useState(false);

  const total = basket.reduce(
    (sum: number, basketItem: BasketItem) =>
      sum + basketItem.item.price * basketItem.quantity,
    0,
  );

  const [loading, setLoading] = useState(false);

  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(null); 

  async function submitOrder(formData: FormData) {
      if (loading) return;

      setLoading(true);
      const name = formData.get("name");
      const phoneNumber = formData.get("phoneNumber");
      const tableNumberRaw = formData.get("tableNumber");

      const items = basket.map( (item: BasketItem) => ({
        menuItemId: item.item.id, quantity: item.quantity
      }))

      try {
        const response = await placeOrder({name, phoneNumber, tableNumber: Number(tableNumberRaw), items})
        setOrderResponse(response);
        console.log(orderResponse)
        showConfirmedOrder(true)
      } catch(e: any) {
        console.error(e)
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
          <form
            className="order_form"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              submitOrder(formData);

            }}
          >
            <div className="inputWrap">
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
            </div>
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

            <button type="submit" className="order_button" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
        <div className="order_right">
          <div>
            <h3 className="order_right_title">Your Order</h3>
            <div className="order_right_items">
              {basket.map((basketItem: BasketItem) => (
                <div className="order_right_item">
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
                      £
                      {(basketItem.item.price * basketItem.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <p className="order_right_total">
                Total:{" "}
                <span className="order_right_total_span">
                  £{total.toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {confirmedOrder && (
        <div className="confirm_order_main">
          <div className="confirm_order_main_backdrop"></div>
          <div className="confirm_order_main_content">
            <button
              className="confirm_order_main_close"
              onClick={() => {
                showConfirmedOrder(false);
                navigate("/");
              }}
            >
              x
            </button>
            <h3 className="confirm_order_main_title">Order Confirmed!</h3>
            <p>Thank you for ordering with us.</p>
            <p>Your order Id: {orderResponse?.orderId}</p>
            <p>Your food will be ready soon.</p>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
