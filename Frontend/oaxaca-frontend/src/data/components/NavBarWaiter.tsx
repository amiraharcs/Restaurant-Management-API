import "../../css/NavBarWaiter.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LuBell, LuUserRound } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";

type NavBarWaiterProps = {
  notificationCount?: number;
};

export default function NavBarWaiter({
  notificationCount = 0,
}: NavBarWaiterProps) {
  let navigate = useNavigate();
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(window.scrollY);

  function toAccount() {
    navigate("/waiter");
  }

  function toAlerts() {
    navigate("/alerts");
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
      <nav className={`waiterNavbar${show ? "" : " waiterNavbar--hidden"}`}>
        <NavLink to="/waiter" className="waiterNavbar__brand">
          OAXACA
        </NavLink>

        <div className="waiterNavbar__center">
          <NavLink to="/waiter" className="waiterNavbar__link" end>
            ORDERS
          </NavLink>
          <NavLink to="/alerts" className="waiterNavbar__link">
            ALERTS
          </NavLink>
          <NavLink to="/manage-menu" className="waiterNavbar__link" end>
            MANAGE MENU
          </NavLink>
          <NavLink to="/" className="waiterNavbar__link" end>
            LOGOUT
          </NavLink>
        </div>

        <div className="waiterNavbar__right">
          <button type="button" className="rightIconsButton" onClick={toAlerts}>
            <LuBell className="rightIcons" />
            {notificationCount > 0 && (
              <span className="redBadge">{notificationCount}</span>
            )}
          </button>

          <button
            type="button"
            className="rightIconsButton"
            onClick={toAccount}
          >
            <LuUserRound className="rightIcons" />
          </button>
        </div>
      </nav>
    </main>
  );
}
