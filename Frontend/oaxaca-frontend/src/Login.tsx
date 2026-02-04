import { useState } from 'react'
import './css/Login.css'
import { LuUser, LuLock, LuEye, LuEyeOff } from 'react-icons/lu'

export default function Login() {
    const [revealPassword, setRevealPassword] = useState(false);

    return (
        <div className='loginPage'>
            <div className='loginBox'>
                <h1 className='loginTitle'> Staff Login </h1>

                <form className='loginForm'>
                    <div className='inputWrap'>
                        <LuUser className='inputIcon' />
                        <input className='inputBox' type='text' placeholder='Username'></input>
                    </div>

                    <div className='inputWrap'>
                        <LuLock className='inputIcon' />
                        <input className='inputBox' type={revealPassword ? "text" : "password"} placeholder='Password'></input>

                        <button className='showPasswordButton' type='button' onClick={() => setRevealPassword(show => !show)} >
                            {revealPassword ? <LuEyeOff /> : <LuEye />}
                            
                        </button>
                    </div>

                    <button className='loginButton' type='button'> LOGIN </button>
                </form>
            </div>   
        </div>
    )
}