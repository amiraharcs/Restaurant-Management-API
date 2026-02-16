import "./css/Login.css";
import "./css/ResetPassword.css";
import { LuMail, LuLock } from "react-icons/lu";
import NavBar from "./data/components/NavBar";
import StaffFooter from "./data/components/StaffFooter";

export default function ResetPassword() {
  function submitResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <main>
      <NavBar />

      <div className="loginPage">
        <div className="loginBox">
          <h1 className="loginTitle">Reset Password</h1>
          <p className="loginSubtitle">
            Please use the email you registered with to set a new password.
          </p>

          <form className="loginForm" onSubmit={submitResetPassword}>
            <div className="inputWrap">
              <LuMail className="inputIcon" />
              <input
                className="inputBox"
                type="email"
                placeholder="Email Address"
                required
              />
            </div>

            <div className="inputWrap">
              <LuLock className="inputIcon" />
              <input
                className="inputBox"
                type="password"
                placeholder="Enter New Password"
                required
                minLength={6}
              />
            </div>

            <div className="inputWrap">
              <LuLock className="inputIcon" />
              <input
                className="inputBox"
                type="password"
                placeholder="Confirm New Password"
                required
                minLength={6}
              />
            </div>

            <button className="loginButton" type="submit">
              RESET PASSWORD
            </button>
          </form>
        </div>
      </div>

      <StaffFooter />
    </main>
  );
}
