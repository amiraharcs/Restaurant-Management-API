import "../../css/NavBarWaiter.css";
import { NavLink, useNavigate } from "react-router-dom";
import { LuBell, LuLogOut } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { clearLoggedInStaffSession, getLoggedInStaffUsername } from "./staffSession";
import { setWaiterOffline } from "../../api/waiterApi";
import { fetchCallWaiterAlerts } from "../../api/alertsApi";

export default function NavBarWaiter() {
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(window.scrollY);

  function toAlerts() {
    navigate("/alerts");
  }

  function handleLogout() {
    const username = getLoggedInStaffUsername();
    if (username) setWaiterOffline(username);
    clearLoggedInStaffSession();
    navigate("/login");
  }

  useEffect(() => {
    async function loadAlerts() {
      try {
        const alerts = await fetchCallWaiterAlerts();
        setNotificationCount(alerts.filter(a => !a.handled).length);
      } catch {}
    }
    loadAlerts();
    const interval = setInterval(loadAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

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
          <img src="/images/main/logo.png" alt="OAXACA" className="waiterNavbar__logoImg" />
        </NavLink>

        <div className="waiterNavbar__center">
          <NavLink to="/waiter" className="waiterNavbar__link" end>
            ORDERS
          </NavLink>
          <NavLink to="/past-order" className="waiterNavbar__link">
            PAST ORDERS
          </NavLink>
          <NavLink to="/manage-menu-waiter" className="waiterNavbar__link" end>
            MANAGE MENU
          </NavLink>
        </div>

        <div className="waiterNavbar__right">
          <button type="button" className="rightIconsButton" onClick={toAlerts}>
            <LuBell className="rightIcons" />
            {notificationCount > 0 && (
              <span className="redBadge">{notificationCount}</span>
            )}
          </button>

          <button type="button" className="rightIconsButton" onClick={handleLogout}>
            <LuLogOut className="rightIcons" />
          </button>
        </div>
      </nav>
    </main>
  );
}
