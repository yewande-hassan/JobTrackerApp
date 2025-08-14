import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/authPages/Login'
import Dashboard from './pages/Dashboard'
import Setting from './pages/Setting'
import Connection from './pages/Connection'
import Report from './pages/Report'
import Signup from './pages/authPages/Signup'



function App() {


  return (
    <Router>
      <Routes>
        {/* {Public Route} */}
        <Route exact path="/" element={<Login/>}/>
        <Route exact path="/sign-up" element={<Signup/>}/>
        {/* Protected route */}
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/setting" element={<Setting/>}/>
      <Route path="/report" element={<Report/>}/>
      <Route path="/connection" element={<Connection/>}/>
      </Routes>
    </Router>
  )
}

export default App
