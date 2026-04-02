import "../../css/Footer.css";
import { NavLink } from "react-router-dom";
import { LuPhone, LuMail, LuMapPin } from "react-icons/lu";

const Footer: React.FC = () => (
  <footer className="footer">
    {/* Footer component */}
    <div className="footer-grid">

      <div className="footer-brand">
        <img src="/images/main/logo.png" alt="Oaxaca Heat" className="footer-logo" />
        <p className="footer-tagline">Fresh flavours, bold bites — every time.</p>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="footer-col-heading">Quick Links</h4>
        <nav className="footer-nav">
          <NavLink to="/"            className="footer-link">Home</NavLink>
          <NavLink to="/menu"        className="footer-link">Menu</NavLink>
          <NavLink to="/track-order" className="footer-link">Track Order</NavLink>
          <NavLink to="/about-us"    className="footer-link">About Us</NavLink>
        </nav>
      </div>

      {/* Contact Us Links */}
      <div>
        <h4 className="footer-col-heading">Contact Us</h4>
        <ul className="footer-contact">
          <li><LuMapPin className="footer-contact-icon" />123 Spice Lane, London, UK</li>
          <li><LuPhone  className="footer-contact-icon" />01234 567890</li>
          <li><LuMail   className="footer-contact-icon" />info@oaxaca.com</li>
        </ul>
      </div>

    </div>

    <div className="footer-bottom">
      <span>&copy; {new Date().getFullYear()} Oaxaca Heat. All rights reserved.</span>
    </div>
  </footer>
);

export default Footer;
