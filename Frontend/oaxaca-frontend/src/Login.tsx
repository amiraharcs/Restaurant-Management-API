import { useState } from 'react'
import './css/Login.css'
import { LuUser, LuLock, LuEye, LuEyeOff } from 'react-icons/lu'
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./data/components/NavBar";
import Footer from "./data/components/Footer";
import { postLogin } from './api/loginApi';
import { setLoggedInStaffRole, setLoggedInStaffUsername } from "./data/components/staffSession";

export default function Login() {
    let navigate = useNavigate();

    const [revealPassword, setRevealPassword] = useState(false);
    const [loginUser, setUsername] = useState("");
    const [loginPass, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState("");

    async function submitLogin(formData: FormData) {
        setIsSubmitting(true);
        setLoginError("");

        try {
            const user = (formData.get("username") ?? "").toString();
            const pass = (formData.get("password") ?? "").toString();
            const res = await postLogin({
                username: user,
                password: pass,
            });

            const role = (res.role ?? "").toUpperCase();
            setLoggedInStaffRole(role)
            setLoggedInStaffUsername(res.username ?? "");

            if (role === "WAITER") {
                navigate("/waiter", {state: { username: res.username }});
            } else if (role === "KITCHEN") {
                navigate("/kitchen", {state: { username: res.username }});
            } else if (role === "MANAGER") {
                navigate("/manager", {state: { username: res.username }});
            } else {
                setLoginError("Your account role is not supported in this app.");
            }
        } catch {
            setLoginError("Login failed. Check your username/password and that the backend is running.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main>
            <NavBar />

            <div className='loginPage'>
                <div className='loginBox'>
                    <h1 className='loginTitle'> Staff Login </h1>

                    <form 
                        className='loginForm' 
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            await submitLogin(formData);
                        }}>
                        <div className='inputWrap'>
                            <LuUser className='inputIcon' />
                            <input 
                                className='inputBox'
                                name='username'
                                type='text'
                                placeholder='Username'
                                value={loginUser}
                                onChange={(u) => setUsername(u.target.value)}
                                required
                                minLength={4}
                            />    
                        </div>

                        <div className='inputWrap'>
                            <LuLock className='inputIcon' />
                            <input
                                className='inputBox'
                                name='password'
                                type={revealPassword ? "text" : "password"}
                                placeholder='Password'
                                value={loginPass}
                                onChange={(p) => setPassword(p.target.value)}
                                required
                                minLength={6}
                            />

                            <button 
                                className='showPasswordButton'
                                type='button'
                                onClick={() => setRevealPassword(show => !show)}
                            >
                                {revealPassword ? <LuEyeOff /> : <LuEye />}
                            </button>
                        </div>

                        {loginError && <p className='loginError'>{loginError}</p>}

                        <button className='loginButton' type='submit' disabled={isSubmitting}>
                            {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
                        </button>

                        <div className='loginLinks'>
                            <Link className='loginLink' to='/reset-password'>Forgot password?</Link>
                            <Link className='loginLink' to='/create-account'>Create new Account</Link>
                        </div>
                    </form>
                </div>   
            </div>

            <Footer />
        </main>
    )
}