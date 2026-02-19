import { useState } from 'react'
import './css/Login.css'
import { LuUser, LuLock, LuEye, LuEyeOff } from 'react-icons/lu'
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./data/components/NavBar";
import StaffFooter from "./data/components/StaffFooter";
import { postLogin } from './api/loginApi';

export default function Login() {
    let navigate = useNavigate();

    const [revealPassword, setRevealPassword] = useState(false);
    const [loginUser, setUsername] = useState("");
    const [loginPass, setPassword] = useState("");

    async function submitLogin(formData: FormData) {
        const user = (formData.get("username") ?? "").toString();
        const pass = (formData.get("password") ?? "").toString();
        console.log("Login:", user, pass);

        const res = await postLogin({
            username: user,
            password: pass,
        })
        console.log("Response:", res);

        if (res.role === "WAITER") {
            navigate("/waiter", {state: { username: res.username }});
        } else if (res.role === "KITCHEN") {
            navigate("/kitchen", {state: { username: res.username }});
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
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            submitLogin(formData);
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

                        <button className='loginButton' type='submit'> LOGIN </button>

                        <div className='loginLinks'>
                            <Link className='loginLink' to='/reset-password'>Forgot password?</Link>
                            <Link className='loginLink' to='/create-account'>Create new Account</Link>
                        </div>
                    </form>
                </div>   
            </div>

            <StaffFooter />
        </main>
    )
}