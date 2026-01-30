import './css/Login.css'

export default function Login() {
    return (
        <div className='loginPage'>
            <div className='loginBox'>
                <h1 className='loginTitle'> Staff Login </h1>

                <form className='loginForm'>
                    <div className='inputWrap'>
                        <input className='inputBox' type='text' placeholder='Username'></input>
                    </div>

                    <div className='inputWrap'>
                        <input className='inputBox' type='text' placeholder='Password'></input>
                    </div>

                    <button className='loginButton' type='button'> LOG IN </button>
                </form>
            </div>   
        </div>
    )
}