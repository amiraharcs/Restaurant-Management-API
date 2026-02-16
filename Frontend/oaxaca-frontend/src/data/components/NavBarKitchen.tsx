import "../../css/NavBarKitchen.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LuUserRound } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";

export default function NavBarKitchen() {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(window.scrollY);

  function toKitchen() {
    navigate("/kitchen");
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
          OAXACA
        </NavLink>

        <div className="kitchenNavbar__center">
          <NavLink to="/kitchen" className="kitchenNavbar__link" end>
            ORDERS
          </NavLink>
          <NavLink to="/" className="kitchenNavbar__link" end>
            LOGOUT
          </NavLink>
        </div>

        <div className="kitchenNavbar__right">
          <button type="button" className="kitchenIconsButton" onClick={toKitchen}>
            <LuUserRound className="kitchenIcons" />
          </button>
        </div>
      </nav>
    </main>
  );
}
