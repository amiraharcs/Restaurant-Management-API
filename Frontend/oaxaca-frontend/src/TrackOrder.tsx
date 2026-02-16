import NavBar from "./data/components/NavBar";
import Footer from "./data/components/Footer";
import "./css/InfoPages.css";

export default function TrackOrder() {
  return (
    <div className="infoPage">
      <NavBar />
      <main className="infoPage__content">
        <h1 className="infoPage__title">Track Order</h1>
        <p className="infoPage__subtitle">
          This will be the tracking order page for customers to see how far their order has progressed.
        </p>
      </main>
      <Footer />
    </div>
  );
}
