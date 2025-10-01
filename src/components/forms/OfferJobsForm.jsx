import React from "react";

export default function OfferJobsForm({ jobDetails, handleChange }) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="offeredRole_type">Offered Role Type</label>
        <select
          id="offeredRole_type"
          name="offeredRole_type"
          value={jobDetails.offeredRole_type || ""}
          onChange={handleChange}
        >
          <option value="">Select role type</option>
          <option value="full_time">Full time</option>
          <option value="part_time">Part time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="offer_date">Offer Date</label>
          <input
            id="offer_date"
            type="date"
            name="offer_date"
            value={jobDetails.offer_date || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group half">
          <label htmlFor="offered_salary">Offered Salary</label>
          <input
            id="offered_salary"
            type="text"
            name="offered_salary"
            value={jobDetails.offered_salary || ""}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="benefit">Benefits (Optional)</label>
        <input
          id="benefit"
          type="text"
          placeholder="Enter time"
          name="benefit"
          value={jobDetails.benefit}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="acceptance_deadline">Acceptance Deadline</label>
        <input
          id="acceptance_deadline"
          type="date"
          placeholder="Enter time"
          name="acceptance_deadline"
          value={jobDetails.acceptance_deadline}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="offer_letter">Offer Letter</label>
        <input
          id="offer_letter"
          type="file"
          placeholder="Enter time"
          name="offer_letter"
          value={jobDetails.offer_letter}
          onChange={handleChange}
        />
      </div>
            {/* <div className="form-group">
        <label htmlFor="offer_status">Status</label>
        <select
          id="offer_status"
          name="offeredRole_type"
          value={jobDetails.offeredRole_type || ""}
          onChange={handleChange}
        >
          <option value="">Select role type</option>
          <option value="full_time">Full time</option>
          <option value="part_time">Part time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
      </div> */}
    </>
  );
}
