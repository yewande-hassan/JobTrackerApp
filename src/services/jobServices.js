import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import { uploadFiles } from "./uploadFiles";
import { extractTextFromFile } from "./textExtract";

export async function addJob(jobDetails, section, currentUser) {
  const date = new Date();
  const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;

  // Upload files (resume, cover letter, offer letter)
  const resumeUrl = await uploadFiles(jobDetails.resume, "resumes");
  const coverLetterUrl = await uploadFiles(jobDetails.cover_letter, "cover_letters");
  const offerLetterUrl = await uploadFiles(jobDetails.offer_letter, "offer_letters");

  // Extract resume text if file is provided
  let resumeText = jobDetails.resumeText || "";
  if (jobDetails.resume) {
    // If a new file is uploaded for this job, try to extract text.
    // If extraction yields empty, keep the existing resumeText (profile fallback).
    const extracted = await extractTextFromFile(jobDetails.resume);
    if (extracted && extracted.trim()) {
      resumeText = extracted;
    }
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
  const url = import.meta.env.VITE_MATCH_FUNCTION_URL;
  // Basic guard: if no URL or no inputs, fallback
  if (!url || !jobDescription || !resume) {
    console.debug("[match] using fallback (no url or missing inputs)");
    return estimateLocalMatch(jobDescription, resume);
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription, resume })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (typeof data.matchScore === "number") return data.matchScore;
    console.debug("[match] url returned no matchScore, fallback");
    return estimateLocalMatch(jobDescription, resume);
  } catch (e) {
    console.warn("getJobResumeMatch fallback due to error:", e?.message || e);
    return estimateLocalMatch(jobDescription, resume);
  }
}

export function estimateLocalMatch(jobDescription = "", resume = "") {
  // Fallback matcher (no network): normalize text, filter generic terms, and compute a weighted similarity.
  const jd = (jobDescription || "").toLowerCase();
  const rv = (resume || "").toLowerCase();
  if (!jd || !rv) return 0;

  const stop = new Set([
    "the","and","a","an","to","of","in","for","on","with","at","by","from","as","is","are","be","this","that","it","or","we","you","your","our","their",
    // job-posting generic terms
    "job","role","position","responsibilities","requirements","preferred","required","years","experience","skills","ability","team","work","candidate","strong","excellent","communication","benefits"
  ]);

  const tokenize = (s) => s.split(/[^a-z0-9+#.]+/g).filter(Boolean);
  const keepToken = (w) => (/[a-z]/.test(w) || ["c#","c++","c"].includes(w)) && w.length > 1; // keep tokens that have letters or key tech
  const filterStop = (arr) => arr.filter((w) => keepToken(w) && !stop.has(w));
  const ngrams2 = (arr) => arr.slice(0, -1).map((_, i) => `${arr[i]}_${arr[i+1]}`);

  const jdTokens = filterStop(tokenize(jd));
  const rvTokens = filterStop(tokenize(rv));
  const jdUniSet = new Set(jdTokens);
  const rvUniSet = new Set(rvTokens);
  const jdSet = new Set([...jdTokens, ...ngrams2(jdTokens)]);
  const rvSet = new Set([...rvTokens, ...ngrams2(rvTokens)]);

  let intersection = 0;
  for (const t of jdSet) if (rvSet.has(t)) intersection++;
  const union = Math.max(1, jdSet.size + rvSet.size - intersection);
  const jaccard = intersection / union;
  // Weighted coverage over unigrams: weight rarer JD tokens higher
  const jdUniFreq = jdTokens.reduce((m, t) => { m[t] = (m[t] || 0) + 1; return m; }, {});
  const techish = (t) => /[#+.0-9]/.test(t);
  let sumWU = 0, hitWU = 0;
  for (const t of jdUniSet) {
    const freq = jdUniFreq[t] || 1;
    const w = (1 / Math.sqrt(freq)) * (techish(t) ? 1.3 : 1.0);
    sumWU += w;
    if (rvUniSet.has(t)) hitWU += w;
  }
  const coverageWeighted = sumWU ? (hitWU / sumWU) : 0;

  // Weighted coverage over bigrams: build JD bigram multiset and compare to RV bigrams
  const jdBigrams = ngrams2(jdTokens);
  const rvBigrams = new Set(ngrams2(rvTokens));
  const jdBiFreq = jdBigrams.reduce((m, t) => { m[t] = (m[t] || 0) + 1; return m; }, {});
  let sumWB = 0, hitWB = 0;
  for (const [t, f] of Object.entries(jdBiFreq)) {
    const w = (1 / Math.sqrt(f)) * 1.4; // bigrams get a bit more weight
    sumWB += w;
    if (rvBigrams.has(t)) hitWB += w;
  }
  const bigramCoverage = sumWB ? (hitWB / sumWB) : 0;

  // Blend the components; allow 100% when truly aligned
  const blended = 0.5 * jaccard + 0.35 * coverageWeighted + 0.15 * bigramCoverage;
  const score = Math.round(Math.max(0, Math.min(1, blended)) * 100);
  console.debug("[fallback-match] score=", score, {
    lenJD: jdSet.size, lenRV: rvSet.size, intersection,
    jaccard: jaccard.toFixed(2), covU: coverageWeighted.toFixed(2), covB: bigramCoverage.toFixed(2)
  });
  return score;
}
