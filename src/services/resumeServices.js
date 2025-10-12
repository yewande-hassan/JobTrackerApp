// Parse resume text into structured profile fields.
// Tries a backend endpoint (VITE_RESUME_PARSE_URL) first; falls back to a naive client parser.

export async function parseResumeToProfile(resumeText) {
  const url = import.meta.env.VITE_RESUME_PARSE_URL;
  if (url) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText })
      });
      if (res.ok) {
        const data = await res.json();
        return sanitizeParsedProfile(data);
      }
    } catch (e) {
      console.warn("parseResumeToProfile backend failed, using fallback:", e?.message || e);
    }
  }
  return fallbackParse(resumeText);
}

function sanitizeParsedProfile(obj = {}) {
  // Ensure arrays exist and correct shapes
  const ensureArr = (v) => (Array.isArray(v) ? v : []);
  return {
    professionalSummary: obj.professionalSummary || "",
    skills: ensureArr(obj.skills).map((s) =>
      typeof s === "string" ? { name: s, level: "Intermediate" } : s
    ),
    workExperience: ensureArr(obj.workExperience),
    education: ensureArr(obj.education),
    certifications: ensureArr(obj.certifications),
    projects: ensureArr(obj.projects),
    languages: ensureArr(obj.languages),
  };
}

function fallbackParse(text = "") {
  const summary = text.split(/\n+/)[0]?.slice(0, 280) || "";
  // Look for a 'Skills' line or derive top keywords as skills
  const skillsLineMatch = text.match(/\bskills?\b[:-]?\s*(.+)/i);
  let skills = [];
  if (skillsLineMatch && skillsLineMatch[1]) {
    skills = skillsLineMatch[1]
      .split(/[,•\n]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20)
      .map((name) => ({ name, level: "Intermediate" }));
  } else {
    const words = text
      .toLowerCase()
      .split(/[^a-z0-9+.#]+/g)
      .filter((w) => w.length > 2);
    const freq = words.reduce((acc, w) => ((acc[w] = (acc[w] || 0) + 1), acc), {});
    const top = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([name]) => ({ name, level: "Intermediate" }));
    skills = top;
  }
  return {
    professionalSummary: summary,
    skills,
    workExperience: [],
    education: [],
    certifications: [],
    projects: [],
    languages: [],
  };
}
