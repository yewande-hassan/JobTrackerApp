
import { Link } from "react-router-dom"
import { FiEye, FiEyeOff } from 'react-icons/fi';
import "../styles/Login.css"
import { useRef, useState } from "react";
import { useAuth } from "../context/useAuth";
function Signup() {
    const [showPassword,setShowPassword] = useState(false)
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const {signup} = useAuth()
   
    const clickPassword =()=>{
        setShowPassword(prev =>!prev)
    }
    async function handleSubmit (e){
        e.preventDefault()
        if(passwordRef.current.value !== passwordConfirmRef.current.value){
            setError('Password does not match')
            return;
        }
         try{
            setError('')
            setLoading(true)
            await signup(emailRef.current.value,passwordRef.current.value)
            console.log("Signed up successfully")
            }
            catch{
                setError('Failed to sign up')
            }
            setLoading(false)
    }

  return (
    <>
        <div className="login-container">
            <div className="left-container">

            <h1>Sign Up to Job Tracker!</h1>
            <form onSubmit={handleSubmit}>
                {error && <div className="error">{error}</div>}
                <input type='email' placeholder="Email Address" ref={emailRef}/>
                <div className="input-container">
                <input type={showPassword? "text" :"password"} placeholder="Password" ref={passwordRef}/>
                <span onClick={clickPassword} className="toggle-password">
                {showPassword ? <FiEye/> :<FiEyeOff/>}
                </span>
                </div>
                <div className="input-container">
                <input type={showPassword? "text" :"password"} placeholder="Confirm Password" ref={passwordConfirmRef}/>
                <span onClick={clickPassword} className="toggle-password">
                {showPassword ? <FiEye/> :<FiEyeOff/>}
                </span>
                </div>
                {/* <Link to="/dashboard"> */}
                <button type="submit" disabled={loading} className="btn">Sign Up</button>
                {/* </Link> */}
               
            </form>
            <div>
                <p>Already have an account?<Link to='/'> Log In</Link></p>
            </div>
            </div>
            <div className="right-container">
                <img src="/public/andrew-neel-cckf4TsHAuw-unsplash.jpg" alt="testing" className="bg-img"/>
            </div>
        </div>
    </>
  )
}

export default Signup
