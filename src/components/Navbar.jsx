import "../styles/Navbar.css"
import { Link, useNavigate } from "react-router-dom"
import { FaSearch, FaBell, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeUnreadPresence } from "../services/notificationsService";



function Navbar() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [hasUnread, setHasUnread] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeUnreadPresence(currentUser, setHasUnread);
    return () => unsub && unsub();
  }, [currentUser]);

  return (
    <div className={`navbar-container ${menuOpen ? "open" : ""}`}>
      <h1 className="logo-icon">Track<span className="home">MyJob</span></h1>
      <button
        className="hamburger"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen((v) => !v)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
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
          {hasUnread && <span className="bell-dot" aria-label={`You have unread notifications`} />}
        </span>
        <FaUserCircle style={{ cursor: "pointer" }} onClick={() => navigate("/profile")}/>
      </div>
      {/* Mobile menu */}
      <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
        <Link to="/dashboard" className="nav-link">Board</Link>
        <Link to="/connection" className="nav-link">Connections</Link>
        <Link to="/report" className="nav-link">Report</Link>
        <Link to="/setting" className="nav-link">Settings</Link>
        <Link to="/notifications" className="nav-link mobile-extra">Notifications {hasUnread && <span className="bell-dot" aria-label="Unread notifications" />}</Link>
        <Link to="/profile" className="nav-link mobile-extra">Profile</Link>
      </div>
    </div>
  );
}

export default Navbar
