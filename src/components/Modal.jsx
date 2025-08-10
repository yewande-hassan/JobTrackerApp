import "../styles/Modal.css"
function Modal({job,onClose}){
    if (!job) return null;
    return(
    <div className="modal-backdrop">
      <div className="modal">
        <button onClick={onClose}>Close</button>
        <h2>{job.title}</h2>
        <p><strong>Company:</strong> {job.company}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Salary:</strong> {job.salary}</p>
        <a href={job.url}>View Post</a>
        <p>{job.description}</p>
      </div>
    </div>
    )
}
export default Modal