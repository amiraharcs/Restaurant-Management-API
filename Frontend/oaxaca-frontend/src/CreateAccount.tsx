import NavBar from "./data/components/NavBar";
import StaffFooter from "./data/components/StaffFooter";
import "./css/Login.css";

export default function CreateAccount() {
  return (
    <main>
      <NavBar />

      <div className="loginPage">
        <div className="loginBox">
          <h1 className="loginTitle">Create Account</h1>
          <p style={{ textAlign: "center", margin: 0 }}>Placeholder page</p>
        </div>
      </div>

      <StaffFooter />
    </main>
  );
}
