import "../../css/NavBar.css";
import { NavLink } from "react-router-dom";
import { LuUserRound } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";

export default function NavBar() {
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current && window.scrollY > 60) {
        setShow(false); // scrolling down
      } else {
        setShow(true); // scrolling up
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <nav className={`mainNavbar${show ? "" : " mainNavbar--hidden"}`}>
        <NavLink to="/" end className="mainNavbar__brand">
          OAXACA
        </NavLink>

        <div className="mainNavbar__center">
          <NavLink to="/" end className="mainNavbar__link">
            HOME
          </NavLink>
          <NavLink to="/menu" className="mainNavbar__link">
            MENU
          </NavLink>
          <NavLink to="/track-order" className="mainNavbar__link">
            TRACK ORDER
          </NavLink>
          <NavLink to="/payment" className="mainNavbar__link">
            PAY NOW
          </NavLink>
          <NavLink to="/about-us" end className="mainNavbar__link">
            ABOUT US
          </NavLink>
        </div>

        <NavLink to="/login" className="mainNavbar__loginBtn">
          <LuUserRound className="mainNavbar__loginIcon" />
          Staff Login
        </NavLink>
      </nav>
    </div>
  );
}