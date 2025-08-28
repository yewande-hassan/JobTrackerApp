import React from "react";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import "../styles/Edit.css";
export default function Edit({section}) {
  const [jobDetails, setJobDetails] = useState({
    company_name: "",
    job_title: "",
    job_url: "",
    status: "",
    date: "",
  });
  // const [errors, setErrors] = useState({});
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
      // Simulate async submit (replace with your API call)
      await addDoc(collection(db, "job"), {
        ...jobDetails,
        status: section,
        date: formattedDate,
      });
      setStatus("success");
      // Reset form
      setJobDetails({
        company_name: "",
        job_title: "",
        job_url: "",
        status: "",
        date: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }
  return (
    <>
      <h3>{section} Jobs</h3>
      <p>Please fill in the input below</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="job_title">Job Title</label>
        <input
          id="job_title"
          type="text"
          placeholder="Job Title"
          name="job_title"
          value={jobDetails.job_title}
          onChange={handleChange}
        />
        <label htmlFor="company_name">Company Name</label>
        <input
          id="company_name"
          type="text"
          placeholder="Company Name"
          name="company_name"
          value={jobDetails.company_name}
          onChange={handleChange}
        />
        <label htmlFor="job_url">Job Posting Link</label>
        <input
          id="job_url"
          type="text"
          placeholder="Enter the link"
          name="job_url"
          value={jobDetails.job_url}
          onChange={handleChange}
        />
        <div className="form-actions">
          <button type="submit" disabled={status === jobDetails.status}>
            {/* {status === "submitting" ? "Sending…" : "Send Message"} */}
            Submit
          </button>
          {status === "success" && (
            <div className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
              Thanks! Your message has been sent.
            </div>
          )}
          {status === "error" && (
            <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              Oops, something went wrong. Please try again.
            </div>
          )}
          {/* <button type="button" onClick={onClose}>
            Cancel
          </button> */}
        </div>
      </form>
    </>
  );
}
