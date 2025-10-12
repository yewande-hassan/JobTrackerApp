import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import { addJob } from "../services/jobServices";
import SavedJobForm from "../components/forms/SavedJobForms";
import AppliedJobForm from "../components/forms/AppliedJobsForm";
import InterviewJobForm from "../components/forms/InterviewJobsForm";
import OfferJobForm from "../components/forms/OfferJobsForm";


import "../styles/Edit.css";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Edit({ section, onCancel, onJobAdded }) {
  const { currentUser } = useAuth();
  const [jobDetails, setJobDetails] = useState({});
  const [status, setStatus] = useState("idle");
  const [profileResume, setProfileResume] = useState({ text: "", url: "", fileName: "" });


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setJobDetails((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Prefill applied form with profile resume metadata for convenience
  useEffect(() => {
    async function loadProfileResume() {
      if (!currentUser) return;
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const d = snap.data();
          setProfileResume({
            text: d?.resumeText || "",
            url: d?.resumeUrl || "",
            fileName: d?.resumeFileName || "",
          });
        }
      } catch (e) {
        console.warn("Failed to load profile resume:", e?.message || e);
      }
    }
    loadProfileResume();
  }, [currentUser]);

  async function handleSubmit(e) {
    
    e.preventDefault();
    try {
      setStatus("submitting");
      // If user didn't upload a resume file for this job, embed profile resume text
      // addJob already extracts text if a File is provided; otherwise we pass resumeText explicitly
      const payload = { ...jobDetails };
      if (!payload.resume && profileResume.text) {
        payload.resumeText = profileResume.text;
      }
      await addJob(payload, section, currentUser);
      setStatus("success");
      setJobDetails({});
      if (onJobAdded) onJobAdded();
      onCancel()
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
      <p>Please fill in the input fields below</p>

      <div className="form-container">
        <form className="job-form" onSubmit={handleSubmit}>
          {/* Common Fields */}
          <div className="form-group">
            <label htmlFor="job_title">Job Title</label>
            <input
              id="job_title"
              type="text"
              name="job_title"
              value={jobDetails.job_title || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="company_name">Company Name</label>
            <input
              id="company_name"
              type="text"
              name="company_name"
              value={jobDetails.company_name || ""}
              onChange={handleChange}
            />
          </div>

          {/* Section-specific forms */}
          {section === "Saved" && (
            <SavedJobForm jobDetails={jobDetails} handleChange={handleChange} />
          )}
          {section === "Applied" && (
            <AppliedJobForm jobDetails={jobDetails} handleChange={handleChange} />
          )}
          {section === "Interview" && (
            <InterviewJobForm jobDetails={jobDetails} handleChange={handleChange} />
          )}
          {section === "Offer" && (
            <OfferJobForm jobDetails={jobDetails} handleChange={handleChange} />
          )}

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={jobDetails.notes || ""}
              onChange={handleChange}
            />
          </div>

          <div className="btns">
          <button type="button" className="btn-edit">
            Check Match
          </button>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-edit"
            >
              {status === "submitting" ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
