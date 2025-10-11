import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import { uploadFiles } from "./uploadFiles";

export async function addJob(jobDetails, section, currentUser) {
  const date = new Date();
  const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;

  // Upload files (resume, cover letter, offer letter)
  const resumeUrl = await uploadFiles(jobDetails.resume, "resumes");
  const coverLetterUrl = await uploadFiles(jobDetails.cover_letter, "cover_letters");
  const offerLetterUrl = await uploadFiles(jobDetails.offer_letter, "offer_letters");

  // Extract resume text if file is provided
  let resumeText = "";
  if (jobDetails.resume && typeof jobDetails.resume.text === "function") {
    resumeText = await jobDetails.resume.text();
  }

  // Try fetching logo
  let logoUrl = "";
  try {
    const response = await fetch(
      `https://logo.clearbit.com/${jobDetails.company_name.replace(/\s+/g, "").toLowerCase()}.com`
    );
    logoUrl = response.ok ? response.url : "/default-logo.png";
  } catch {
    logoUrl = "/default-logo.png";
  }

  // Save to Firestore
  return await addDoc(collection(db, "job"), {
    ...jobDetails,
    resume: resumeUrl,
    resumeText, // Save extracted resume text for matching
    cover_letter: coverLetterUrl,
    offer_letter: offerLetterUrl,
    status: section,
    date: formattedDate,
    logoUrl,
    userId: currentUser.uid,
  });
}

// Service to call Firebase Cloud Function for job/resume match
export async function getJobResumeMatch(jobDescription, resume) {
  const response = await fetch(
    "https://us-central1-YOUR_PROJECT.cloudfunctions.net/getJobResumeMatch",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription, resume })
    }
  );
  const data = await response.json();
  return data.matchScore;
}
