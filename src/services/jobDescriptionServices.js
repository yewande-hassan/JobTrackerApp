// Fetch job description text from a job posting URL via a backend function.
// The backend should handle CORS and site-specific scraping/extraction.

export async function fetchJobDescriptionFromUrl(jobUrl) {
  const url = import.meta.env.VITE_JOB_DESC_FUNCTION_URL;
  if (!url || !jobUrl) return "";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobUrl })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // Expect { description: string }
    return (data && typeof data.description === "string") ? data.description : "";
  } catch (e) {
    console.warn("fetchJobDescriptionFromUrl failed:", e?.message || e);
    return "";
  }
}
