import "../../css/Footer.css";

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer-content">
      <p>&copy; {new Date().getFullYear()} Oaxaca Restaurant. All rights reserved.</p>
      <p>Contact: info@oaxaca.com | 01234 567890</p>
    </div>
  </footer>
);

export default Footer;
