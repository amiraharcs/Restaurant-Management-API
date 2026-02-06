import "../../css/NavBar.css";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <div>
      <nav className="navbar">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/" end>Order</NavLink>
        <NavLink to="/login">Login</NavLink>
      </nav>
    </div>
  );
}