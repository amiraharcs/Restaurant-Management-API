import "./css/Main_page.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/">Order</Link>
        <Link to="/login">Login</Link>
      </nav>

      <section className="Title">
        <div className="Title-content">
          <h1>OAXACA</h1>
          <p>authentic Mexican street food</p>
        </div>
      </section>
    </div>
  );
}