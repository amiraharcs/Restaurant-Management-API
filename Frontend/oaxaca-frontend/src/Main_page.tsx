import "./css/Main_page.css";
import NavBar from "./data/components/NavBar";
import HelpWidget from "./data/components/Help_widget";
import Footer from "./data/components/Footer";
import { Link } from "react-router-dom";

//Defining an array contianing images and the correspoding name of dishes
const DISHES = [
  { img: "/images/menu/beef-tacos.jpg",         name: "Beef Tacos" },
  { img: "/images/menu/chicken-fajitas.jpg",    name: "Chicken Fajitas" },
  { img: "/images/menu/beef-burrito.jpg",       name: "Beef Burrito" },
  { img: "/images/menu/churros.jpg",            name: "Churros" },
  { img: "/images/menu/tres-leches.jpg",        name: "Tres Leches" },
  { img: "/images/menu/chicken-quesadilla.jpg", name: "Chicken Quesadilla" },
];

export default function Home() {
  return (
    <div className="main_page">
      <NavBar />
      <main>
        <section className="Title">
          <div className="Title-content">
            {/*Main action buttons*/}
            <div className="main-buttons">
              <Link to="/menu" className="main-btn order-btn">Order Now</Link>
              <Link to="/track-order" className="main-btn track-btn">Track Order</Link>
            </div>
          </div>
        </section>
        <HelpWidget />

        {/*Section to show some menu items and link to menu*/}
        <section className="main_food_section">
          <h2 className="main_food_title">A taste of what's waiting</h2>
          <div className="main_food_grid">
            {DISHES.map(d => (
              <div key={d.name} className="main_food_card">
                <img src={d.img} alt={d.name} className="main_food_img" />
                <span className="main_food_name">{d.name}</span>
              </div>
            ))}
          </div>
          <Link to="/menu" className="main_food_link">See full menu →</Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
