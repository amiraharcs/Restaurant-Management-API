import NavBar from "./data/components/NavBar";
import StaffFooter from "./data/components/StaffFooter";
import "./css/Login.css";
import "./css/ResetPassword.css";
import { LuUser, LuLock, LuMail } from "react-icons/lu";

export default function CreateAccount() {
  function submitCreateAccount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <main>
      <NavBar />

      <div className="loginPage">
        <div className="loginBox">
          <h1 className="loginTitle">Create New Account</h1>
          <p className="loginSubtitle">Create a staff account and choose a role.</p>

          <form className="loginForm" onSubmit={submitCreateAccount}>
            <div className="inputWrap">
              <LuUser className="inputIcon" />
              <input
                className="inputBox"
                id="new-username"
                type="text"
                placeholder="Username"
                required
                minLength={4}
              />
            </div>

            <div className="inputWrap">
              <LuLock className="inputIcon" />
              <input
                className="inputBox"
                id="new-password"
                type="password"
                placeholder="Password"
                required
                minLength={6}
              />
            </div>

            <div className="inputWrap">
              <LuMail className="inputIcon" />
              <input
                className="inputBox"
                id="new-email"
                type="email"
                placeholder="Email Address"
                required
              />
            </div>

            <div className="inputWrap">
              <LuUser className="inputIcon" />
              <select className="inputBox roleSelect" defaultValue="" required>
                <option value="" disabled>
                  Select your role
                </option>
                <option value="waiter">Waiter</option>
                <option value="kitchen-staff">Kitchen staff</option>
              </select>
            </div>

            <button className="loginButton" type="submit">
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>

      <StaffFooter />
    </main>
  );
}
