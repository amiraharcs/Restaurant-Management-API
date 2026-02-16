import NavBar from "./data/components/NavBar";
import Footer from "./data/components/Footer";
import "./css/InfoPages.css";

export default function AboutUs() {
  return (
    <div className="infoPage">
      <NavBar />
      <main className="infoPage__content">
        <h1 className="infoPage__title">About Us</h1>
        <p className="infoPage__subtitle">
          About rest contnet will go here.
        </p>
      </main>
      <Footer />
    </div>
  );
}
