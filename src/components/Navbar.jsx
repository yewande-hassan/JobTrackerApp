import "../styles/Navbar.css"
import { Link } from "react-router-dom"
import { FaSearch, FaBell, FaUserCircle} from 'react-icons/fa';


function Navbar() {

  return (
    <div className="navbar-container">
    <h1 className="logo-icon">Track<span className="home">MyJob</span></h1>
        <div className="nav-links">
        <Link to="/dashboard" className="nav-link">Board</Link>
        <Link to="/connection" className="nav-link">Connections</Link>
        <Link to="/report" className="nav-link">Report</Link>
        <Link to="/setting" className="nav-link">Settings</Link>
        </div>
        <div className="profile">
            <FaSearch/>
            <FaBell/>
            <FaUserCircle/>
            
        </div>

    </div>
  )
}

export default Navbar
