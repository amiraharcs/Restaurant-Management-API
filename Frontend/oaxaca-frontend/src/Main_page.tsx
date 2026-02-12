import "./css/Main_page.css";
import NavBar from "./data/components/NavBar";

export default function Home() {
  return (
    <div>
      <NavBar />

      <section className="Title">
        <div className="Title-content">
          <h1>OAXACA</h1>
          <p>authentic Mexican street food</p>
        </div>
      </section>
    </div>
  );
}