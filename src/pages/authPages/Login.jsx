
import { Link } from "react-router-dom"
import { FiEye, FiEyeOff } from 'react-icons/fi';
import "../../styles/Login.css"
import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
function Login() {
    const [showPassword,setShowPassword] = useState(false)
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const emailRef = useRef()
    const passwordRef = useRef()
    const {login} = useAuth()
    const navigate = useNavigate();
   
    const clickPassword =()=>{
        setShowPassword(prev =>!prev)
    }
    async function handleSubmit (e){
        e.preventDefault()
        let email = emailRef.current.value;
        let password = passwordRef.current.value;
        if(!email || !password){
            setError('please enter your email or password')
            return
        }
         try{
            setError('')
            setLoading(true)
            await login(email,password)
            navigate("/dashboard")
            }
            catch{
                setError('Failed to Log In')
            }
            setLoading(false)
            emailRef.current.value = "";
            passwordRef.current.value = "";
    }

  return (
    <>
        <div className="login-container">
            <div className="left-container">
            <div className="header">
            <h1>Welcome Back! Let’s Get You Hired!</h1>
            <p>Track your applications, follow up on opportunities, and land your dream job faster.</p>
            </div>
            <form onSubmit={handleSubmit} className="forms">
                {error && <div className="error">{error}</div>}
                <input type='email' placeholder="Enter your Email Address" ref={emailRef}/>
                <div className="input-container">
                <input type={showPassword? "text" :"password"} placeholder="Password" ref={passwordRef}/>
                <span onClick={clickPassword} className="toggle-password">
                {showPassword ? <FiEye/> :<FiEyeOff/>}
                </span>
                </div>
                <button type="submit" disabled={loading} className="btn">Log In</button>
            </form>
            <div>
                <p>Don't have an account yet?<Link to='/sign-up' className="link">   Sign up</Link></p>
            </div>
            </div>
            <div className="right-container">
                <div class="bg-blur"></div>
                <img src="/public/log-in.jpg" alt="testing" className="bg-img-login"/>
            </div>
        </div>
    </>
  )
}

export default Login
