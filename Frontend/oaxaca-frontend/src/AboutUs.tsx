import NavBar from "./data/components/NavBar";
import Footer from "./data/components/Footer";
import "./css/AboutUs.css";

export default function AboutUs() {
  return (
    <div className="about_page">
      <NavBar />

      <section className="about_hero">
        <img src="/images/main/logo.png" alt="OAXACA" className="about_hero_logo" />
        <p className="about_hero_tagline">Authentic Mexican flavours. A dining experience built around you.</p>
      </section>

      <section className="about_section about_white">
        <h2>Who We Are</h2>
        <p>
          OAXACA is a Mexican restaurant built on bold flavours and effortless service. Every dish is crafted fresh,
          every table is looked after by a dedicated team, and every visit is designed to feel seamless from start to finish.
          We believe great food deserves service that keeps up — so we built a system that does exactly that.
        </p>
      </section>

      <section className="about_section about_green">
        <h2>Your Experience</h2>
        <p>
          From the moment you sit down, your table is your control centre. Browse our full menu — complete with photos,
          allergens and dietary filters — right from your device. Place your order at your own pace and watch it move
          from kitchen to table in real time. Need anything along the way? One tap calls your waiter directly.
          When you're done, paying is just as simple. No waiting, no chasing — just the meal you came for.
        </p>
      </section>

      <section className="about_section about_white">
        <h2>Behind the Scenes</h2>
        <p>
          Our waiters and kitchen team work through a connected system that keeps everyone in sync. Orders arrive at
          the kitchen the moment you place them, staff are alerted the instant a table needs attention, and managers
          have a live view of every table, order and menu item at all times. The result is a team that moves fast,
          makes fewer mistakes, and focuses on what matters — making your visit one worth coming back for.
        </p>
      </section>

      <Footer />
    </div>
  );
}
