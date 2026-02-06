import "../../css/NavBar.css";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/">Order</Link>
        <Link to="/login">Login</Link>
      </nav>
    </div>
  );
}