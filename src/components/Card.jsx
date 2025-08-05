
import "../styles/Card.css"
import { FaPlus } from 'react-icons/fa';


function Card({title}) {

  return (
      <>
      <div className="card-container">
      <div className="card-heading">
        <p>{title}</p>
        <FaPlus size={20} />
      </div>
      </div>
      </>
  )
}

export default Card