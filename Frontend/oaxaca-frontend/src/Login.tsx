import { useState } from 'react'
import './css/Login.css'
import { LuUser, LuLock, LuEye, LuEyeOff } from 'react-icons/lu'
import { useNavigate } from "react-router-dom";
import NavBar from "./data/components/NavBar";
import StaffFooter from "./data/components/StaffFooter";

export default function Login() {
    let navigate = useNavigate();

    const [revealPassword, setRevealPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function submitLogin(e : React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        console.log("Login:", username, password);
        navigate("/waiter");
    }

    return (
        <main>
            <NavBar />

            <div className='loginPage'>
                <div className='loginBox'>
                    <h1 className='loginTitle'> Staff Login </h1>

                    <form className='loginForm' onSubmit={submitLogin}>
                        <div className='inputWrap'>
                            <LuUser className='inputIcon' />
                            <input 
                                className='inputBox'
                                type='text'
                                placeholder='Username'
                                value={username}
                                onChange={(u) => setUsername(u.target.value)}
                                required
                                minLength={4}
                            />    
                        </div>

                        <div className='inputWrap'>
                            <LuLock className='inputIcon' />
                            <input
                                className='inputBox'
                                type={revealPassword ? "text" : "password"}
                                placeholder='Password'
                                value={password}
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
                    </form>
                </div>   
            </div>

            <StaffFooter />
        </main>
    )
}