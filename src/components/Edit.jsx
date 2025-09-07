// import React from "react";
// import { useState } from "react";
// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../services/firebase";
// import { IoIosArrowBack } from "react-icons/io";
// import "../styles/Edit.css";
// import { useAuth } from "../context/AuthContext";

// export default function Edit({ section, onCancel, onJobAdded }) {
//   const { currentUser } = useAuth();
//   const [jobDetails, setJobDetails] = useState({
//         company_name: "",
//         job_title: "",
//         job_url: "",
//         work_mode: "",
//         source: "",
//         job_type: "",
//         salary_range: "",
//         app_date:"",
//         app_status:"",
//         recruiter_details: "",
//         resume:"",
//         cover_letter:"",
//         offer_letter:"",
//         location_link:"",
//         offered_salary:"",
//         offer_date:"",
//         acceptance_deadline:"",
//         benefit:"",
//         reminder:"",
//         status:"",
//         interview_time:"",
//         interview_date:"",
//         offeredRole_type:"",
//         country: "",
//         state: "",
//         city: "",
//         notes: "",
//   });
//   const [status, setStatus] = useState("idle");
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setJobDetails((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
//   async function handleSubmit(e) {
//     e.preventDefault();
//     try {
//       const date = new Date();
//       const formattedDate = `${String(date.getMonth() + 1).padStart(
//         2,
//         "0"
//       )}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
//       setStatus("submitting");
//       let logoUrl = "";
//       try {
//         const response = await fetch(
//           `https://logo.clearbit.com/${jobDetails.company_name
//             .replace(/\s+/g, "")
//             .toLowerCase()}.com`
//         );
//         if (response.ok) {
//           logoUrl = response.url;
//         } else {
//           logoUrl = "/default-logo.png";
//         }
//         if (onJobAdded) {
//           onJobAdded();
//         }
//       } catch (err) {
//         console.error("Logo fetch failed:", err);
//         logoUrl = "/default-logo.png";
//       }
//       await addDoc(collection(db, "job"), {
//         ...jobDetails,
//         status: section,
//         date: formattedDate,
//         logoUrl,
//         userId: currentUser.uid,
//       });
//       setStatus("success");
//       // Reset form
//       setJobDetails({
//         company_name: "",
//         job_title: "",
//         job_url: "",
//         work_mode: "",
//         source: "",
//         job_type: "",
//         salary_range: "",
//         app_date:"",
//         app_status:"",
//         recruiter_details: "",
//         resume:"",
//         cover_letter:"",
//         offer_letter:"",
//         acceptance_deadline:"",
//         benefit:"",
//         location_link:"",
//         offered_salary:"",
//         offer_date:"",
//         interview_time:"",
//         interview_date:"",
//         offeredRole_type:"",
//         status:"",
//         reminder:"",
//         country: "",
//         state: "",
//         city: "",
//         notes: "",
//       });
//     } catch (err) {
//       console.error(err);
//       setStatus("error");
//     }
//   }
//   return (
//     <>
//       <p onClick={onCancel}>
//         <IoIosArrowBack /> Go back
//       </p>
//       <h3>{section} Jobs</h3>
//       <p>Please fill in the input field below</p>
//       <div className="form-container">
//         <form className="job-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="job_title">Job Title</label>
//             <input
//               id="job_title"
//               type="text"
//               placeholder="Job Title"
//               name="job_title"
//               value={jobDetails.job_title}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="company_name">Company Name</label>
//             <input
//               id="company_name"
//               type="text"
//               placeholder="Company Name"
//               name="company_name"
//               value={jobDetails.company_name}
//               onChange={handleChange}
//             />
//           </div>
//           {section === "Saved" || section === "Applied" ?
//           <>
//            <div className="form-group">
//             <label htmlFor="job_location">Job Location (Optional)</label>
//             <div className="location">
//               <input
//                 id="job_location"
//                 type="text"
//                 placeholder="Enter Country"
//                 name="job_location"
//                 value={jobDetails.country}
//                 onChange={handleChange}
//               />
//               <input
//                 id="job_location"
//                 type="text"
//                 placeholder="Enter State"
//                 name="job_location"
//                 value={jobDetails.state}
//                 onChange={handleChange}
//               />
//               <input
//                 id="job_location"
//                 type="text"
//                 placeholder="Enter City"
//                 name="job_location"
//                 value={jobDetails.city}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
//            <div className="form-row">
//             <div className="form-group half">
//               <label htmlFor="work_mode">Work Mode</label>
//               <select
//                 id="work_mode"
//                 name="work_mode"
//                 value={jobDetails.work_mode}
//                 onChange={handleChange}
//               >
//                 <option value="Remote">Remote</option>
//                 <option value="Hybrid">Hybrid</option>
//                 <option value="Onsite">Onsite</option>
//               </select>
//             </div>
//             <div className="form-group half">
//               <label htmlFor="source">Source</label>
//               <input
//                 id="source"
//                 type="text"
//                 placeholder="Enter source"
//                 name="source"
//                 value={jobDetails.source}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
//           </>
//           : null
//           }
//           {section === "Saved" ?   
//           <div className="form-group">
//               <label htmlFor="job_type">Job Type</label>
//               <select
//                 id="job_type"
//                 name="job_type"
//                 value={jobDetails.job_type}
//                 onChange={handleChange}
//               >
//                 <option value="Full time">Full time</option>
//                 <option value="Part time">Part time</option>
//                 <option value="Contract">Contract</option>
//                 <option value="Internship">Internship</option>
//               </select>
//             </div>: null}
//                {section === "Saved" || section === "Applied" ?
//             <div className="form-group">
//             <label htmlFor="job_url">Job Posting Link</label>
//             <input
//               id="job_url"
//               type="text"
//               placeholder="Enter the link"
//               name="job_url"
//               value={jobDetails.job_url}
//               onChange={handleChange}
//             />
//           </div>
//           : null}
//           {section === "Applied" ?
//           <>
//               <div className="form-row">
//             <div className="form-group half">
//               <label htmlFor="app_date">Application Date</label>
//              <input
//                 id="app_date"
//                 type="date"
//                 placeholder="MM/DD/YYYY"
//                 name="app_date"
//                 value={jobDetails.app_date}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="form-group half">
//               <label htmlFor="app_status">Application Status</label>
//               <select
//                 id="app_status"
//                 name="app_status"
//                 value={jobDetails.app_status}
//                 onChange={handleChange}
//               >
//                 <option value="Submitted">Submitted</option>
//                 <option value="Pending">Pending</option>
//               </select>
//             </div>
//           </div>
//               <div className="form-group">
//             <label htmlFor="recruiter_details">Recruiter Details (Optional)</label>
//             <input
//               id="recruiter_details"
//               type="text"
//               placeholder="Enter"
//               name="recruiter_details"
//               value={jobDetails.recruiter_details}
//               onChange={handleChange}
//             />
//           </div>
//             <div className="form-group">
//             <label htmlFor="resume">Resume Used</label>
//             <input
//               id="resume"
//               type="file"
//               placeholder="Enter"
//               name="resume"
//               value={jobDetails.resume}
//               onChange={handleChange}
//             />
//           </div>
//              <div className="form-group">
//             <label htmlFor="cover_letter">Cover Letter</label>
//             <input
//               id="cover_letter"
//               type="file"
//               placeholder="Enter"
//               name="cover_letter"
//               value={jobDetails.cover_letter}
//               onChange={handleChange}
//             />
//           </div>
//           </>
//           :null}
//           {section === "Saved" ?  <div className="form-group">
//             <label htmlFor="salary_range">Salary Range (Optional)</label>
//             <input
//               id="salary_range"
//               type="text"
//               placeholder="Enter desired Salary"
//               name="salary_range"
//               value={jobDetails.salary_range}
//               onChange={handleChange}
//             />
//           </div>:null}
//           {section === "Interview" ?
//           <>
//           <div className="form-group">
//               <label htmlFor="interview_type">Interview Type</label>
//               <select
//                 id="interview_type"
//                 name="interview_type"
//                 value={jobDetails.interview_type}
//                 onChange={handleChange}
//               >
//                 <option value="virtual">Virtual</option>
//                 <option value="In Person">In Person</option>
//               </select>
//             </div>
//                 <div className="form-row">
//             <div className="form-group half">
//               <label htmlFor="interview_date">Date of the Interview</label>
//              <input
//                 id="interview_date"
//                 type="date"
//                 placeholder="MM/DD/YYYY"
//                 name="interview_date"
//                 value={jobDetails.interview_date}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="form-group half">
//               <label htmlFor="interview_time">Time of the Interview</label>
//               <input
//                 id="interview_time"
//                 type="text"
//                 placeholder="Enter time"
//                 name="interview_time"
//                 value={jobDetails.interview_times}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
//              <div className="form-group">
//               <label htmlFor="location_link">Location/Meeting Link</label>
//               <select
//                 id="location_link"
//                 name="location_link"
//                 value={jobDetails.location_link}
//                 onChange={handleChange}
//               >
//                 <option value="virtual">Virtual</option>
//                 <option value="In Person">In Person</option>
//               </select>
//             </div>
//               <div className="form-group">
//               <label htmlFor="status">Status</label>
//               <select
//                 id="status"
//                 name="status"
//                 value={jobDetails.status}
//                 onChange={handleChange}
//               >
//                 <option value="scheduled">Scheduled</option>
//                 <option value="In Person">In Person</option>
//               </select>
//             </div>
//               <div className="form-group">
//               <label htmlFor="reminder">Reminder Setting</label>
//               <select
//                 id="reminder"
//                 name="reminder"
//                 value={jobDetails.reminder}
//                 onChange={handleChange}
//               >
//                 <option value="A day">1 day before</option>
//                 <option value="A week">1 week before</option>
//               </select>
//             </div>
//             </>
//             :
//             null
//           }
//            {section === "Offer" ?
//           <>
//           <div className="form-group">
//               <label htmlFor="offeredRole_type">Offered Role Type</label>
//               <select
//                 id="offeredRole_type"
//                 name="offeredRole_type"
//                 value={jobDetails.offeredRole_type}
//                 onChange={handleChange}
//               >
//                 <option value="full time">Full time</option>
//                 <option value="contract">Contract</option>
//                  <option value="internship">Internship</option>
//               </select>
//             </div>
//                 <div className="form-row">
//             <div className="form-group half">
//               <label htmlFor="offer_date">Offer Date</label>
//              <input
//                 id="offer_date"
//                 type="date"
//                 placeholder="MM/DD/YYYY"
//                 name="offer_date"
//                 value={jobDetails.offer_date}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="form-group half">
//               <label htmlFor="offered_salary">Offered Salary</label>
//               <input
//                 id="offered_salary"
//                 type="text"
//                 placeholder="Enter time"
//                 name="offered_salary"
//                 value={jobDetails.offered_salary}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
//              <div className="form-group">
//               <label htmlFor="benefit">Benefits (Optional)</label>
//               <input
//                 id="benefit"
//                  type="text"
//                 placeholder="Enter time"
//                 name="benefit"
//                 value={jobDetails.benefit}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="acceptance_deadline">Acceptance Deadline</label>
//               <input
//                 id="acceptance_deadline"
//                  type="date"
//                 placeholder="Enter time"
//                 name="acceptance_deadline"
//                 value={jobDetails.acceptance_deadline}
//                 onChange={handleChange}
//               />
//             </div>
//              <div className="form-group">
//               <label htmlFor="offer_letter">Offer Letter</label>
//               <input
//                 id="offer_letter"
//                  type="file"
//                 placeholder="Enter time"
//                 name="offer_letter"
//                 value={jobDetails.offer_letter}
//                 onChange={handleChange}
//               />
//             </div>
//             </>
//             :
//             null
//           }
//           <div className="form-group">
//             <label htmlFor="notes">Notes</label>
//             <textarea
//               id="notes"
//               placeholder="Enter"
//               name="notes"
//               value={jobDetails.notes}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="btns">
//           <button type="button" className="btn-edit">
//             Check Match
//           </button>
//           {/* <div className="form-actions"> */}
//             <button type="submit" disabled={status === jobDetails.status} className="btn-edit">
//               Save
//             </button>
//             {/* {status === "success" && (
//               <div className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
//                 Thanks! Your message has been sent.
//               </div>
//             )}
//             {status === "error" && (
//               <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
//                 Oops, something went wrong. Please try again.
//               </div>
//             )} */}
//           {/* </div> */}
//           </div>
//         </form>
//       </div>
//     </>
//   );
// }

import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import { addJob } from "../services/jobServices";
import SavedJobForm from "../components/forms/SavedJobForms";
import AppliedJobForm from "../components/forms/AppliedJobsForm";
import InterviewJobForm from "../components/forms/InterviewJobsForm";
import OfferJobForm from "../components/forms/OfferJobsForm";

import "../styles/Edit.css";

export default function Edit({ section, onCancel, onJobAdded }) {
  const { currentUser } = useAuth();
  const [jobDetails, setJobDetails] = useState({});
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setJobDetails((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setStatus("submitting");
      await addJob(jobDetails, section, currentUser);
      setStatus("success");
      setJobDetails({});
      if (onJobAdded) onJobAdded();
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
