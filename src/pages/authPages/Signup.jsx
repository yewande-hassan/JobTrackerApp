
import { Link } from "react-router-dom"
import { FiEye, FiEyeOff } from 'react-icons/fi';
import "../../styles/Login.css"
import { useRef, useState } from "react";
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from "react-router-dom";
function Signup() {
    const [showPassword,setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const {signup} = useAuth()
     const navigate = useNavigate();
   
    const clickPassword =()=>{
        setShowPassword(prev =>!prev)
    }
    const confirmPassword = () => setShowConfirmPassword(prev => !prev);
    async function handleSubmit (e){
        e.preventDefault()
          const email = emailRef.current.value;
          const password = passwordRef.current.value;
          const passwordConfirm = passwordConfirmRef.current.value;

        if(password !== passwordConfirm){
            setError('Password does not match')
            return;
        }
         try{
            setError('')
            setLoading(true)
            await signup(email,password)
            navigate("/")
            console.log("Signed up successfully")
            }
            catch{
                setError('Failed to sign up')
            }
            setLoading(false)
            emailRef.current.value = "";
            passwordRef.current.value = "";
            passwordConfirmRef.current.value = "";
    }

  return (
    <>
        <div className="login-container">
            <div className="left-container">
                <div className="header">
            <h1>Welcome to Job Tracker!</h1>
            <p>Organize every application, take control of your career and visualize your progress, all in one place</p>
                </div>
            <form onSubmit={handleSubmit} className="forms">
                {error && <div className="error">{error}</div>}
                <input type='email' placeholder="Enter your email address" ref={emailRef}/>
                <div className="input-container">
                <input type={showPassword? "text" :"password"} placeholder="Create password" ref={passwordRef}/>
                <span onClick={clickPassword} className="toggle-password">
                {showPassword ? <FiEye/> :<FiEyeOff/>}
                </span>
                </div>
                <div className="input-container">
                <input type={showConfirmPassword? "text" :"password"} placeholder="Confirm password" ref={passwordConfirmRef}/>
                <span onClick={confirmPassword} className="toggle-password">
                {showPassword ? <FiEye/> :<FiEyeOff/>}
                </span>
                </div>
                <button type="submit" disabled={loading} className="btn">Sign Up</button>
            </form>
            <div>
                <p>Already have an account?<Link to='/' className="link">  Log In</Link></p>
            </div>
            </div>
            <div className="right-container">
                <img src="/public/Sign-up.jpg" alt="testing" className="bg-img"/>
            </div>
        </div>
    </>
  )
}

export default Signup
