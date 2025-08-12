import { createContext,useState, useEffect } from "react"
import {auth} from '../services/firebase'

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState()

    function login(email,password){
       return auth.signInWithEmailAndPassword(auth,email,password)
    }
    function signup(email,password){
       return auth.createUserWithEmailAndPassword(auth,email,password)
    }
    useEffect(()=>{
       const unsubscribe = auth.onAuthStateChanged(user =>{
            setCurrentUser(user)
        })
        return unsubscribe
    },[])
    const value = {
        currentUser,
        login,
        signup
    };

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  )
}

