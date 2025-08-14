import { createContext,useState, useEffect,useContext } from "react"
import {auth} from '../services/firebase';

import { onAuthStateChanged,signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth";
const AuthContext = createContext();

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null)
    const [userLoggedIn, setUserLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false)

    function login(email,password){
       return signInWithEmailAndPassword(auth,email,password)
    }
    function signup(email,password){
       return createUserWithEmailAndPassword(auth,email,password)
    }
    async function initializeUser(user){
        if(user){
            setCurrentUser({...user})
            setUserLoggedIn(true)
        }else{
            setCurrentUser(null)
            setUserLoggedIn(false)
        }
        setLoading(false)
    }
    useEffect(()=>{
       const unsubscribe = onAuthStateChanged(auth, initializeUser)
        return unsubscribe
    },[])
    
    const value = {
        currentUser,
        userLoggedIn,
        loading,
        login,
        signup
    };

  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  )
}

