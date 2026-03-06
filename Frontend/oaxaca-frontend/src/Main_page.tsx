import "./css/Main_page.css";
import NavBar from "./data/components/NavBar";
import HelpWidget from "./data/components/Help_widget";
import Footer from "./data/components/Footer";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="main_page">
      <NavBar />
      <main>
        <section className="Title">
          <div className="Title-content">
            <div className="main-buttons">
              <Link to="/menu" className="main-btn order-btn">Order Now</Link>
              <Link to="/track-order" className="main-btn track-btn">Track Order</Link>
            </div>
          </div>
        </section>
        <HelpWidget />
      </main>
      <Footer />
    </div>
  );
}