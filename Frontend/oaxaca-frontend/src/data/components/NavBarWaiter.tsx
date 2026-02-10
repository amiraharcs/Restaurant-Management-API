import "../../css/NavBarWaiter.css";
import { NavLink } from "react-router-dom";

export default function NavBarWaiter() {
  return (
    <div>
      <nav className="navbar">
        <NavLink to="/waiter" end>Orders</NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/" end>Logout</NavLink>
      </nav>
    </div>
  );
}