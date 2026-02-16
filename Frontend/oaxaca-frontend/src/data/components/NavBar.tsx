import "../../css/NavBar.css";
import { NavLink } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

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
      <nav className={`navbar${show ? "" : " navbar--hidden"}`}>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/" end>Order</NavLink>
        <NavLink to="/login">Login</NavLink>
      </nav>
    </div>
  );
}