
import "../styles/Card.css"

function Card({job,onClick}) {

  return (
      <>
       <div className="card" onClick={onClick}>
      <div className="card-heading">
        <span className="icon">
          {/* {iconMap[job.logo]} */}
          {job.logoUrl ? (
            <img
              src={job.logoUrl}
              alt={job.company_name}
              className="company-logo"
              onError={(e) => (e.target.src = "/default-logo.png")} // fallback if logo fails
            />
          ) : (
            <img src="/default-logo.png" alt="default" className="company-logo" />
          )}
          </span>
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