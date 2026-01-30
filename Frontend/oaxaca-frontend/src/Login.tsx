import './css/Login.css'
import { LuUser, LuLock } from 'react-icons/lu'

export default function Login() {
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
                        <input className='inputBox' type='text' placeholder='Password'></input>
                    </div>

                    <button className='loginButton' type='button'> LOGIN </button>
                </form>
            </div>   
        </div>
    )
}