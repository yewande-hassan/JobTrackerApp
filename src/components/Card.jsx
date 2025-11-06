import "../styles/Card.css";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { deleteJob } from "../services/jobServices";
import ConfirmDialog from "./ConfirmDialog";
import { getJobResumeMatch, estimateLocalMatch } from "../services/jobServices";
import { fetchJobDescriptionFromUrl } from "../services/jobDescriptionServices";
import { db } from "../services/firebase";
import { doc, updateDoc } from "firebase/firestore";


function useInViewport(elRef, rootMargin = "0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = elRef?.current;
    if (!el || typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { root: null, rootMargin, threshold: 0.01 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [elRef, rootMargin]);
  return inView;
}

const Card = forwardRef(({ job, resumeText, onClick, onDeleted, ...dragProps }, ref) => {
  const [match, setMatch] = useState(null);
  const [instantMatch, setInstantMatch] = useState(null);
  const [fetchedDesc, setFetchedDesc] = useState("");
  const fetchingRef = useRef(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const localRef = useRef(null);
  const attachRef = (node) => {
    localRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };
  const inView = useInViewport(localRef, "100px");

  // Try to fetch description from job_url if not provided
  useEffect(() => {
    let canceled = false;
    async function maybeFetchDesc() {
      if (!inView) return;
      if (job.description || !job.job_url || fetchedDesc || fetchingRef.current) return;
      fetchingRef.current = true;
      try {
        const desc = await fetchJobDescriptionFromUrl(job.job_url);
        if (!canceled) setFetchedDesc(desc || "");
        // Persist to Firestore to avoid refetch later
        if (desc && job.id) {
          try {
            const jobRef = doc(db, "job", job.id);
            await updateDoc(jobRef, { description: desc });
          } catch (e) {
            console.warn("Failed to persist fetched description:", e?.message || e);
          }
        }
      } finally {
        fetchingRef.current = false;
      }
    }
    maybeFetchDesc();
    return () => { canceled = true; };
  }, [job.description, job.job_url, fetchedDesc, job.id, inView]);

  const effectiveDescription = useMemo(() => {
    return job.description || fetchedDesc || job.job_title || "";
  }, [job.description, fetchedDesc, job.job_title]);

  // Debug info in development to inspect matching inputs
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const source = job.description ? "job.description" : (fetchedDesc ? "fetchedDesc" : (job.job_title ? "job_title" : ""));
    const resumeLen = (resumeText || "").length;
    const descLen = (effectiveDescription || "").length;
  console.debug("[card-match-input]", { jobId: job.id, source, descLen, resumeLen });
  }, [job.id, job.description, fetchedDesc, job.job_title, effectiveDescription, resumeText]);

  useEffect(() => {
    let canceled = false;
    async function computeMatch() {
      if (!inView) return;
      if (!resumeText || !effectiveDescription) {
        setInstantMatch(0);
        setMatch(0);
        return;
      }
      // Show an immediate local estimate, then update with async score
      const instant = estimateLocalMatch(effectiveDescription, resumeText);
      if (!canceled) setInstantMatch(instant);
      try {
        const finalScore = await getJobResumeMatch(effectiveDescription, resumeText);
        if (!canceled) setMatch(finalScore);
      } catch (err) {
        console.error("Match error:", err);
        if (!canceled) setMatch(instant);
      }
    }
    computeMatch();
    return () => { canceled = true; };
  }, [effectiveDescription, resumeText, inView]);

  return (
    <>
  <div className="card" onClick={() => { if (!confirmOpen) onClick?.(); }} ref={attachRef} {...dragProps}>
        <div className="card-heading">
          <span className="icon">
            {job.logoUrl ? (
              <img
                src={job.logoUrl}
                alt={job.company_name}
                className="company-logo"
                onError={(e) => (e.target.src = "/default-logo.png")}
              />
            ) : (
              <img
                src="/default-logo.png"
                alt="default"
                className="company-logo"
              />
            )}
          </span>
          <div className="job-info">
            <p className="company">{job.company_name}</p>
            <p className="role">{job.job_title}</p>
            <p className="date">{job.date}</p>
          </div>
          <div>
            <p className="match">{`${(typeof match === "number" ? match : (instantMatch ?? 0))}% Match`}</p>
          </div>
        </div>
        <button
            className="card-delete"
            aria-label="Delete job"
            onClick={(e) => { e.stopPropagation(); setConfirmOpen(true); }}
          >
            <IoClose />
          </button>
          <ConfirmDialog
            isOpen={confirmOpen}
            title="Delete Job"
            message="Are you sure you want to delete this job?"
            confirmText="Delete"
            cancelText="Cancel"
            variant="danger"
            onCancel={() => setConfirmOpen(false)}
            onConfirm={async () => {
              try {
                await deleteJob(job.id);
                if (onDeleted) onDeleted(job.id);
              } finally {
                setConfirmOpen(false);
              }
            }}
          />
      </div>
    </>
  );
});

export default Card;
