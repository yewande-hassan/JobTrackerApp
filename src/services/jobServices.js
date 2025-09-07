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
    cover_letter: coverLetterUrl,
    offer_letter: offerLetterUrl,
    status: section,
    date: formattedDate,
    logoUrl,
    userId: currentUser.uid,
  });
}
