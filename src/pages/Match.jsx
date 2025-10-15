import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Match.css";
import { fetchJobDescriptionFromUrl } from "../services/jobDescriptionServices";
import { extractTextFromFile } from "../services/textExtract";
import { estimateLocalMatch, getJobResumeMatch } from "../services/jobServices";

export default function Match() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const initial = state?.jobDetails || {};

  const [jobTitle] = useState(initial.job_title || "");
  const [jobUrl] = useState(initial.job_url || "");
  // Keep description local; no need to store separately beyond score computation
  const [resumeText, setResumeText] = useState("");
  const [score, setScore] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const [skills, setSkills] = useState({ matched: [], missing: [] });
  const [loading, setLoading] = useState(true);

  const profileResumeText = state?.profileResume?.text || initial.resumeText || "";

  const tokens = useMemo(() => ({
    tokenize: (s = "") => (s || "").toLowerCase().split(/[^a-z0-9+#.]+/g).filter(Boolean),
    looksLikeSkill: (t) => /[A-Z]/.test(t) || /[+#.0-9]/.test(t) || t.length <= 5,
  }), []);

  useEffect(() => {
    let canceled = false;
    async function run() {
      try {
        // 1) Prepare job description
        let desc = initial.description || "";
        if (!desc) {
          if (jobUrl) {
            try {
              const fetched = await fetchJobDescriptionFromUrl(jobUrl);
              if (fetched && fetched.trim()) desc = fetched;
            } catch {
              // ignore fetch failures and fall back to title/empty description
            }
          }
          if (!desc && jobTitle) desc = jobTitle;
        }
        if (canceled) return;

        // 2) Prepare resume text
        let rtxt = profileResumeText;
        if (initial.resume && typeof initial.resume === "object") {
          try {
            const extracted = await extractTextFromFile(initial.resume);
            if (extracted && extracted.trim()) rtxt = extracted;
          } catch {
            // ignore extraction failures, we'll fall back to any provided text
          }
        }
        if (canceled) return;
        setResumeText(rtxt || "");

        // 3) Instant local estimate
        const local = estimateLocalMatch(desc, rtxt);
        if (canceled) return;
        setScore(local);

        // 4) Remote final (if configured)
        try {
          const remote = await getJobResumeMatch(desc, rtxt);
          if (!canceled) setFinalScore(remote);
        } catch {
          if (!canceled) setFinalScore(local);
        }

        // 5) Compute skills matched/missing
        const jdTokens = tokens.tokenize(desc);
        const rvTokens = new Set(tokens.tokenize(rtxt));
        const jdSkillCandidates = Array.from(new Set(jdTokens.filter(tokens.looksLikeSkill)));
        const matched = [];
        const missing = [];
        jdSkillCandidates.forEach((t) => (rvTokens.has(t) ? matched.push(t) : missing.push(t)));

        if (!canceled) setSkills({ matched: matched.slice(0, 12), missing: missing.slice(0, 12) });
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    run();
    return () => {
      canceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const workExperience = useMemo(() => {
    const lines = [];
    const misses = [];
    if ((resumeText || "").toLowerCase().includes((jobTitle || "").toLowerCase())) {
      lines.push(`Your experience as "${jobTitle}" aligns with the role's focus.`);
    }
    // Use first missing skill to craft a message
    if (skills.missing[0]) {
      misses.push(`The job requires experience with "${skills.missing[0]}", which was not found in your work history.`);
    }
    return { lines, misses };
  }, [resumeText, jobTitle, skills.missing]);

  const eduHighlights = useMemo(() => {
    const rv = (resumeText || "").toLowerCase();
    const out = [];
    if (/b\.?sc|bachelor|msc|master/.test(rv)) {
      out.push("Your degree appears to match the required academic background.");
    }
    if (/certificat|certified/.test(rv)) {
      out.push("A listed certification also supports your fit for this role.");
    }
    return out.slice(0, 2);
  }, [resumeText]);

  const displayScore = finalScore ?? score ?? 0;

  return (
    <div className="container">
      <Navbar />
      <div className="match-container">
        <button className="back-link" onClick={() => navigate(-1)}>&lt; Go back</button>
        <h1 className="match-title">Resume Match Score</h1>
        <p className="match-subtitle">Analyzing your resume against the job description.</p>

        <div className="match-card">
          <div className="match-card-header">
            <div className="job-role">
              <p className="muted">Job Role:</p>
              <p className="job-title">{jobTitle || "(untitled role)"}</p>
            </div>
            <div className="score-circle">
              <div className="score-inner">{loading && score == null ? "…" : `${displayScore}%`}</div>
            </div>
            <p className="score-caption">This score indicates the percentage of key skills and keywords from the job description that were found in your resume.</p>
          </div>

          <section className="match-section">
            <div className="section-header">
              <span className="section-icon" aria-hidden="true" />
              <h3>Work Experience Match</h3>
            </div>
            {workExperience.lines.map((l, idx) => (
              <div className="callout success" key={`ok-${idx}`}>
                <span className="icon-circle ok" aria-hidden="true">✓</span>
                <span><b className="label-ok">Matched:</b> {l}</span>
              </div>
            ))}
            {workExperience.misses.map((l, idx) => (
              <div className="callout warn" key={`miss-${idx}`}>
                <span className="icon-circle warn" aria-hidden="true">✕</span>
                <span><b className="label-warn">Missing:</b> {l}</span>
              </div>
            ))}
          </section>

          <section className="match-section">
            <div className="section-header">
              <span className="icon">✅</span>
              <h3>Core Skills Match</h3>
            </div>
            <div className="chips">
              {skills.matched.map((s) => (
                <span className="chip chip-ok" key={`m-${s}`}>{s}</span>
              ))}
              {skills.missing.map((s) => (
                <span className="chip chip-miss" key={`x-${s}`}>{s}</span>
              ))}
            </div>
          </section>

          <section className="match-section">
            <div className="section-header lg">
              <span className="section-icon pic" aria-hidden="true" />
              <h3>Education & Certifications Match</h3>
            </div>
            {eduHighlights.map((l, idx) => (
              <div className="callout success" key={`edu-${idx}`}>
                <span className="icon-circle ok" aria-hidden="true">✓</span>
                <span><b className="label-ok">Matched:</b> {l}</span>
              </div>
            ))}
          </section>

          <div className="match-footer">
            <span className="muted">Want to improve your score? </span>
            <button className="linklike" onClick={() => navigate("/profile")}>Edit your resume.</button>
            <div style={{ flex: 1 }} />
            <button
              className="btn-apply"
              disabled={!jobUrl}
              onClick={() => jobUrl && window.open(jobUrl, "_blank")}
            >
              Apply for this Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
