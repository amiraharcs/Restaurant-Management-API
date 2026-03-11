import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { clearLoggedInStaffSession } from "./staffSession";
import { LuBell, LuUserRound } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";

export default function NavBarManager() {
    const [show, setShow] = useState(true);
    const lastScrollY = useRef(window.scrollY);
    
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
          <NavLink to="/manage-menu" className="waiterNavbar__link" end>
            MANAGE MENU
          </NavLink>
          <NavLink
            to="/login"
            className="waiterNavbar__link"
            end
            onClick={clearLoggedInStaffSession}
          >
            LOGOUT
          </NavLink>
        </div>

        <div className="waiterNavbar__right">
          <button
            type="button"
            className="rightIconsButton"
          >
            <LuUserRound className="rightIcons" />
          </button>
        </div>
      </nav>
    </main>
    )
}