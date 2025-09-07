import React from "react";

export default function SavedJobForm({ jobDetails, handleChange }) {
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
        <label htmlFor="job_type">Job Type</label>
        <select
          id="job_type"
          name="job_type"
          value={jobDetails.job_type || ""}
          onChange={handleChange}
        >
          <option value="Full time">Full time</option>
          <option value="Part time">Part time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
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
      <div className="form-group">
        <label htmlFor="salary_range">Salary Range (Optional)</label>
        <input
          id="salary_range"
          type="text"
          placeholder="Enter desired salary"
          name="salary_range"
          value={jobDetails.salary_range || ""}
          onChange={handleChange}
        />
      </div>
    </>
  );
}
