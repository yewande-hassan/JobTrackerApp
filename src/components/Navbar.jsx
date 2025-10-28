import "../styles/Navbar.css"
import { Link, useNavigate } from "react-router-dom"
import { FaSearch, FaBell, FaUserCircle} from 'react-icons/fa';
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeNotifications } from "../services/notificationsService";



function Navbar() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const unsub = subscribeNotifications(currentUser, setNotifs);
    return () => unsub && unsub();
  }, [currentUser]);

  const unreadCount = useMemo(() => notifs.filter(n => !n.read).length, [notifs]);
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
        <FaSearch />
        <span className="bell-wrapper" onClick={() => navigate("/notifications")}>
          <FaBell style={{ cursor: "pointer" }} />
          {unreadCount > 0 && <span className="bell-dot" aria-label={`You have ${unreadCount} unread notifications`} />}
        </span>
        <FaUserCircle style={{ cursor: "pointer" }} onClick={() => navigate("/profile")}/>
      </div>
    </div>
  );
}

export default Navbar
