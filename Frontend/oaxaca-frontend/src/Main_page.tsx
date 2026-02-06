import "./Main_page.css";

export default function Home() {
  return (
    <div>
      <nav className="navbar">
        <a href="#">Home</a>
        <a href="#">Menu</a>
        <a href="#">Order</a>
        <a href="#">Login</a>
      </nav>

      <section className="Title">
        <div className="Title-content">
          <h1>OAXACA</h1>
          <p>authentic Mexican street food</p>
        </div>
      </section>
    </div>
  );
}