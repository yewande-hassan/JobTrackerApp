import React from "react";

export default function AppliedJobsForm({ jobDetails, handleChange }) {
  // Custom handler for file inputs
  function handleFileChange(e) {
    const { name, files } = e.target;
    handleChange({
      target: {
        name,
        value: files && files[0] ? files[0] : null
      }
    });
  }
  return (
    <>
      <div className="form-group">
        <label htmlFor="job_location">Job Location (Optional)</label>
        <div className="location">
          <input
            id="job_location"
            type="text"
            placeholder="Enter Country"
            name="job_location"
            value={jobDetails.country}
            onChange={handleChange}
          />
          <input
            id="job_location"
            type="text"
            placeholder="Enter State"
            name="job_location"
            value={jobDetails.state}
            onChange={handleChange}
          />
          <input
            id="job_location"
            type="text"
            placeholder="Enter City"
            name="job_location"
            value={jobDetails.city}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="work_mode">Work Mode</label>
          <select
            id="work_mode"
            name="work_mode"
            value={jobDetails.work_mode}
            onChange={handleChange}
          >
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </div>
        <div className="form-group half">
          <label htmlFor="source">Source</label>
          <input
            id="source"
            type="text"
            placeholder="Enter source"
            name="source"
            value={jobDetails.source}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="job_url">Job Posting Link</label>
        <input
          id="job_url"
          type="text"
          placeholder="Enter the link"
          name="job_url"
          value={jobDetails.job_url}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="app_date">Application Date</label>
          <input
            id="app_date"
            type="date"
            name="app_date"
            value={jobDetails.app_date || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group half">
          <label htmlFor="app_status">Application Status</label>
          <select
            id="app_status"
            name="app_status"
            value={jobDetails.app_status || ""}
            onChange={handleChange}
          >
            <option value="Submitted">Submitted</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="recruiter_details">Recruiter Details</label>
        <input
          id="recruiter_details"
          type="text"
          name="recruiter_details"
          value={jobDetails.recruiter_details || ""}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="resume">Resume Used</label>
        <input
          id="resume"
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="cover_letter">Cover Letter (Optional) </label>
        <input
          id="cover_letter"
          type="file"
          name="cover_letter"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
      </div>
    </>
  );
}
