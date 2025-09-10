import "../styles/ConnectionCard.css";

const ConnectionCard = ({ data }) => {
  return (
    <>
      <div className="card">
        <div className="card-heading">
          <div className="job-info">
            <p className="company">{data.name}</p>
            <p className="role">{data.company}</p>
            <p className="date">{data.role}</p>
          </div>
          <p
            className={`match ${
              data.status === "Connected"
                ? "status-connected"
                : data.status === "Waiting"
                ? "status-waiting"
                : data.status === "Follow up"
                ? "status-followup"
                : data.status === "No response"
                ? "status-noresponse"
                : ""
            }`}
          >
            {data.status}
          </p>
        </div>
        <p className="note"><span className="note-color">Note:</span> {data.note}</p>
      </div>
    </>
  );
};

export default ConnectionCard;
