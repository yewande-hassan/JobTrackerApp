import React from 'react'
import "../styles/Dashboard.css";
function Edit({section, onClose }) {
  return (
    <>
      <h3>{section} Jobs</h3>
      <p>Please fill in the input below</p>
      <form>
        <label htmlFor="jobTitle">Job Title</label>
        <input id="jobTitle" type="text" placeholder="Job Title" />
         <label htmlFor="companyName">Company Name</label>
        <input id="companyName" type="text" placeholder="Company Name" />
        {/* Add other fields */}
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