import "../styles/Navbar.css"
import { Link } from "react-router-dom"
import { FaSearch, FaBell, FaUserCircle} from 'react-icons/fa';


function Navbar() {

  return (
    <div className="navbar-container">
    <h1 className="logo-icon">TrackMyJob</h1>
        <div className="nav-links">
        <Link to="/dashboard" className="nav-link">Board</Link>
        <Link to="connection" className="nav-link">Connections</Link>
        <Link to="/report" className="nav-link">Report</Link>
        <Link to="/setting" className="nav-link">Settings</Link>
        </div>
        <div className="profile">
            <div className="search">
        <input type="text" placeholder="Search anything"/>
        <span
        className="search-icon">
        <FaSearch/>
        </span>
            </div>
            <FaBell/>
            <FaUserCircle/>
            
        </div>

    </div>
  )
}

export default Navbar
