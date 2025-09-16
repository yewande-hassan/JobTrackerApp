import ConnectionCard from "../components/ConnectionCard";
import Navbar from "../components/Navbar"
import "../styles/Connection.css"
import { FaPlus } from "react-icons/fa";
import { CardData } from "../data/CardData";

function Connection() {

  return (
    <div className="container">
      <Navbar />
      <div className="connection-container">
        <div className="connection-header">
          <p className="heading">Networking Tracker</p>
          <button type="button" className="btn-connection">
            <FaPlus className="plus-btn" />
            New Connection
          </button>
        </div>
        <p className="text">
          Keep track of the people you’ve connected with, follow up on
          opportunities, and grow your professional network easily.
        </p>
          {CardData.map((d) => {
            return (
              
        <ConnectionCard
              data={d}
        />
            )})}
      </div>
    </div>
  );
}

export default Connection