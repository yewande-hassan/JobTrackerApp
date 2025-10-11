import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/authPages/Login'
import Dashboard from './pages/Dashboard'
import Setting from './pages/Setting'
import Connection from './pages/Connection'
import Report from './pages/Report'
import Profile from './pages/Profile'
import Signup from './pages/authPages/Signup'
import Edit from './components/Edit'



function App() {


  return (
    <Router>
      <Routes>
        {/* {Public Route} */}
        <Route exact path="/" element={<Login/>}/>
        <Route exact path="/sign-up" element={<Signup/>}/>
        {/* Protected route */}
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/dashboard/new/:section" element={<Edit />} />
      <Route path="/setting" element={<Setting/>}/>
      <Route path="/report" element={<Report/>}/>
      <Route path="/connection" element={<Connection/>}/>
      <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </Router>
  )
}

export default App
