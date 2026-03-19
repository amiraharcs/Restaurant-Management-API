import { NavLink, useNavigate } from "react-router-dom";
import { clearLoggedInStaffSession } from "./staffSession";
import { LuLogOut } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import "../../css/NavBarManager.css"

export default function NavBarManager() {
    const [show, setShow] = useState(true);
    const lastScrollY = useRef(window.scrollY);
    const navigate = useNavigate();

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

    function handleLogout() {
        clearLoggedInStaffSession();
        navigate("/login");
    }

    return (
    <main>
      <nav className={`managerNavbar${show ? "" : " managerNavbar--hidden"}`}>
        <NavLink to="/manager" className="managerNavbar__brand">
          <img src="/images/main/logo.png" alt="OAXACA" className="managerNavbar__logoImg" />
        </NavLink>

        <div className="managerNavbar__center">
          <NavLink to="/manager/overview" className="managerNavbar__link" end>
            OVERVIEW
          </NavLink>
          <NavLink to="/manager" className="managerNavbar__link" end>
            EMPLOYEE DATA
          </NavLink>
          <NavLink to="/manage-menu-manager" className="managerNavbar__link" end>
            MANAGE MENU
          </NavLink>
        </div>

        <div className="managerNavbar__right">
          <button
            type="button"
            className="rightIconsButton"
            onClick={handleLogout}
          >
            <LuLogOut className="rightIcons" />
          </button>
        </div>
      </nav>
    </main>
    )
}
