import "../../css/NavBarKitchen.css";
import { NavLink, useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { clearLoggedInStaffSession } from "./staffSession";

export default function NavBarKitchen() {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(window.scrollY);

  function handleLogout() {
    clearLoggedInStaffSession();
    navigate("/login");
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current && window.scrollY > 60) {
        setShow(false);
      } else {
        setShow(true);
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main>
      <nav className={`kitchenNavbar${show ? "" : " kitchenNavbar--hidden"}`}>
        <NavLink to="/kitchen" className="kitchenNavbar__brand">
          <img src="/images/main/logo.png" alt="OAXACA" className="kitchenNavbar__logoImg" />
        </NavLink>

        <div className="kitchenNavbar__center">
          <NavLink to="/kitchen" className="kitchenNavbar__link" end>
            ORDERS
          </NavLink>
          <NavLink to="/past-order" className="kitchenNavbar__link">
            PAST ORDERS
          </NavLink>
        </div>

        <div className="kitchenNavbar__right">
          <button type="button" className="kitchenIconsButton" onClick={handleLogout}>
            <LuLogOut className="kitchenIcons" />
          </button>
        </div>
      </nav>
    </main>
  );
}
