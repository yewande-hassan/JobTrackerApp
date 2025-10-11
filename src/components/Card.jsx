import "../styles/Card.css";
import { forwardRef, useEffect, useState } from "react";
import { getJobResumeMatch } from "../services/jobServices";


const Card = forwardRef(({ job, resumeText, onClick, ...dragProps }, ref) => {
  const [match, setMatch] = useState(null);

  useEffect(() => {
    async function fetchMatch() {
      try {
        // Use job.description and resumeText for matching
        const score = await getJobResumeMatch(job.description || job.job_title, resumeText || "");
        console.log("Match score:", score);
        setMatch(score);
      } catch (err) {
        console.error("Match error:", err);
        setMatch("-"); // fallback if error
      }
    }
    fetchMatch();
  }, [job.description, job.job_title, resumeText]);

  return (
    <>
      <div className="card" onClick={onClick} ref={ref} {...dragProps}>
        <div className="card-heading">
          <span className="icon">
            {job.logoUrl ? (
              <img
                src={job.logoUrl}
                alt={job.company_name}
                className="company-logo"
                onError={(e) => (e.target.src = "/default-logo.png")}
              />
            ) : (
              <img
                src="/default-logo.png"
                alt="default"
                className="company-logo"
              />
            )}
          </span>
          <div className="job-info">
            <p className="company">{job.company_name}</p>
            <p className="role">{job.job_title}</p>
            <p className="date">{job.date}</p>
          </div>
          <div>
            <p className="match">
              {match !== null ? `${match}% Match` : "Checking match..."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
});

export default Card;
