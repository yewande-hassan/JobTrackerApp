
import "../styles/Card.css"
import { FaTwitch, FaSnapchat, FaSpotify, FaPlus } from "react-icons/fa";
// import { FaPlus } from "react-icons/fa";

const iconMap = {
  twitch: <FaTwitch color="#9146FF" />,
  snapchat: <FaSnapchat color="#FFFC00" />,
  spotify: <FaSpotify color="#1DB954" />,
  // zoom: <FaZoom color="#2D8CFF" />,
};
function Card({role,date,company,logo}) {

  return (
      <>
       <div className="card">
      <div className="card-heading">
        <p className="company">{company}</p>
        <span className="icon">{iconMap[logo]}</span>
      </div>
      <p className="role">{role}</p>
      <p className="date">{date}</p>
    </div>
      </>
  )
}

export default Card