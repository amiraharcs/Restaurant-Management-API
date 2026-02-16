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
            <h1>OAXACA</h1>
            <p>authentic Mexican street food</p>
            <div className="main-buttons">
              <Link to="/menu" className="main-btn order-btn">Order Now</Link>
              <button className="main-btn track-btn">Track Order</button>
            </div>
          </div>
        </section>
        <HelpWidget />
      </main>
      <Footer />
    </div>
  );
}