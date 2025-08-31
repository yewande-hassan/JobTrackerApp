
import "../styles/Card.css"
import { forwardRef } from "react";

const Card = forwardRef(({ job, onClick, ...dragProps }, ref) => {

  return (
      <>
       <div className="card" 
       onClick={onClick}
       ref={ref}
      {...dragProps}>
      <div className="card-heading">
        <span className="icon">
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
        <div className="job-info">
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
  );
});

export default Card;