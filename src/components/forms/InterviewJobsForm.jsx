import React from "react";

export default function InterviewJobsForm({ jobDetails, handleChange }) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="interview_type">Interview Type</label>
        <select
          id="interview_type"
          name="interview_type"
          value={jobDetails.interview_type || ""}
          onChange={handleChange}
        >
          <option value="">Select type</option>
          <option value="virtual">Virtual</option>
          <option value="in_person">In Person</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="interview_date">Interview Date</label>
          <input
            id="interview_date"
            type="date"
            name="interview_date"
            value={jobDetails.interview_date || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group half">
          <label htmlFor="interview_time">Interview Time</label>
          <input
            id="interview_time"
            type="text"
            placeholder="Enter time"
            name="interview_time"
            value={jobDetails.interview_time || ""}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="location_link">Location/Meeting Link</label>
        <select
          id="location_link"
          name="location_link"
          value={jobDetails.location_link}
          onChange={handleChange}
        >
          <option value="virtual">Virtual</option>
          <option value="In Person">In Person</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={jobDetails.status}
          onChange={handleChange}
        >
          <option value="scheduled">Scheduled</option>
          <option value="In Person">In Person</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="reminder">Reminder Setting</label>
        <select
          id="reminder"
          name="reminder"
          value={jobDetails.reminder}
          onChange={handleChange}
        >
          <option value="A day">1 day before</option>
          <option value="A week">1 week before</option>
        </select>
      </div>
    </>
  );
}
