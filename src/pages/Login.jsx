
import { Link } from "react-router-dom"
import { FiEye, FiEyeOff } from 'react-icons/fi';
import "../styles/Login.css"
import { useState } from "react";

function Login() {
    const [showPassword,setShowPassword] = useState(false)
    const clickPassword =()=>{
        setShowPassword(prev =>!prev)
    }
  return (
    <>

        <div className="login-container">
            <div className="left-container">

            <h1>Welcome Back to Job Tracker!</h1>
            <form>
                <input type="text" placeholder="Username"/>
                <div className="input-container">
                <input type={showPassword? "text" :"password"} placeholder="Password"/>
                <span onClick={clickPassword} className="toggle-password">
                {showPassword ? <FiEye/> :<FiEyeOff/>}
                </span>
                </div>
                <Link to="/dashboard"><button type="submit" className="btn">Login</button></Link>
               
            </form>
            <div>
                <p>Don't have an account?<Link> Sign up</Link></p>
            </div>
            </div>
            <div className="right-container">
                <img src="/public/andrew-neel-cckf4TsHAuw-unsplash.jpg" alt="testing" className="bg-img"/>
            </div>
        </div>
    </>
  )
}

export default Login
