import React from 'react'
import "../styles/Edit.css";
function Edit({section, onClose,submit, title,name,url, handleChange}) {
  return (
    <>
      <h3>{section} Jobs</h3>
      <p>Please fill in the input below</p>
      <form onSubmit={submit}>
        <label htmlFor="job_title">Job Title</label>
        <input id="job_title" type="text" placeholder="Job Title" name='job_title' value ={title} onChange={handleChange}/>
        <label htmlFor="company_name">Company Name</label>
        <input id="company_name" type="text" placeholder="Company Name" name='company_name' value ={name} onChange={handleChange}/>
        <label htmlFor="jobLocation">Job Location (Optional)</label>
        <div className="location">
          <input id="jobLocation" type="text" placeholder="Enter Country" />
          <input id="jobLocation" type="text" placeholder="Enter State" />
          <input id="jobLocation" type="text" placeholder="Enter City" />
        </div>

        <div className="location">
          <div>
            <label htmlFor="jobLocation">Job Location (Optional)</label>
            <input id="jobLocation" type="text" placeholder="Enter Country" />
          </div>
          <div>
            <label htmlFor="jobLocation">Job Location (Optional)</label>
            <input id="jobLocation" type="text" placeholder="Enter State" />
          </div>
        </div>
        <label htmlFor="job_url">Job Posting Link</label>
        <input id="job_url" type="text" placeholder="Enter the link" name='job_url' value ={url} onChange={handleChange}/>
        <label htmlFor="range">Salary Range (optional)</label>
        <input id="range" type="text" placeholder="Enter" />
        <label htmlFor="message">Notes</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          cols="50"
          placeholder="Type your message here..."
        ></textarea>

        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default Edit