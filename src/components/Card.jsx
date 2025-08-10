
import "../styles/Card.css"
import { FaTwitch, FaSnapchat, FaSpotify} from "react-icons/fa";


const iconMap = {
  twitch: <FaTwitch color="#9146FF" />,
  snapchat: <FaSnapchat color="#FFFC00" />,
  spotify: <FaSpotify color="#1DB954" />,
};
function Card({job,onClick}) {

  return (
      <>
       <div className="card" onClick={onClick}>
      <div className="card-heading">
        <p className="company">{job.company}</p>
        <span className="icon">{iconMap[job.logo]}</span>
      </div>
      <p className="role">{job.role}</p>
      <p className="date">{job.date}</p>
    </div>
      </>
  )
}

export default Card