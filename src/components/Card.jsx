
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
        <span className="icon">{iconMap[job.logo]}</span>
        <div>
      <p className="company">{job.company_name}</p>
      <p className="role">{job.job_title}</p>
      <p className="date">{job.date}</p>
        </div>
        <div>
          <p className="match">86% Match</p>
        </div>

      </div>

    </div>
      </>
  )
}

export default Card