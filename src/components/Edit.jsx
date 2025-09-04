import React from "react";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { IoIosArrowBack } from "react-icons/io";
import "../styles/Edit.css";
import { useAuth } from "../context/AuthContext";

export default function Edit({ section, onCancel, onJobAdded }) {
  const { currentUser } = useAuth();
  const [jobDetails, setJobDetails] = useState({
    company_name: "",
    job_title: "",
    job_url: "",
    work_mode: "",
    source: "",
    job_type: "",
    salary_range: "",
    country: "",
    state: "",
    city: "",
    status: "",
    date: "",
    notes: "",
  });
  const [status, setStatus] = useState("idle");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const date = new Date();
      const formattedDate = `${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
      setStatus("submitting");
      let logoUrl = "";
      try {
        const response = await fetch(
          `https://logo.clearbit.com/${jobDetails.company_name
            .replace(/\s+/g, "")
            .toLowerCase()}.com`
        );
        if (response.ok) {
          logoUrl = response.url;
        } else {
          logoUrl = "/default-logo.png";
        }
        if (onJobAdded) {
          onJobAdded();
        }
      } catch (err) {
        console.error("Logo fetch failed:", err);
        logoUrl = "/default-logo.png";
      }
      await addDoc(collection(db, "job"), {
        ...jobDetails,
        status: section,
        date: formattedDate,
        logoUrl,
        userId: currentUser.uid,
      });
      setStatus("success");
      // Reset form
      setJobDetails({
        company_name: "",
        job_title: "",
        job_url: "",
        work_mode: "",
        source: "",
        job_type: "",
        salary_range: "",
        country: "",
        state: "",
        city: "",
        notes: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }
  return (
    <>
      <p onClick={onCancel}>
        <IoIosArrowBack /> Go back
      </p>
      <h3>{section} Jobs</h3>
      <p>Please fill in the input field below</p>
      <div className="form-container">
        <form className="job-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="job_title">Job Title</label>
            <input
              id="job_title"
              type="text"
              placeholder="Job Title"
              name="job_title"
              value={jobDetails.job_title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="company_name">Company Name</label>
            <input
              id="company_name"
              type="text"
              placeholder="Company Name"
              name="company_name"
              value={jobDetails.company_name}
              onChange={handleChange}
            />
          </div>
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
                value={jobDetails.job_type}
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
              placeholder="Enter desired Salary"
              name="salary_range"
              value={jobDetails.salary_range}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              placeholder="Enter"
              name="notes"
              value={jobDetails.notes}
              onChange={handleChange}
            />
          </div>
          <div className="btns">
          <button type="button" className="btn-edit">
            Check Match
          </button>
          {/* <div className="form-actions"> */}
            <button type="submit" disabled={status === jobDetails.status} className="btn-edit">
              Save
            </button>
            {/* {status === "success" && (
              <div className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                Thanks! Your message has been sent.
              </div>
            )}
            {status === "error" && (
              <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                Oops, something went wrong. Please try again.
              </div>
            )} */}
          {/* </div> */}
          </div>
        </form>
      </div>
    </>
  );
}
