import Metrics from "../components/Metrics"
import Navbar from "../components/Navbar"
import "../styles/Report.css"
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db, query, where, collection, getDocs } from "../services/firebase";
import ReportOverview from "../components/ReportOverview";
import BreakdownByRole from "../components/BreakdownByRole";


function Report() {
  const { currentUser } = useAuth();
  const [totalJobs, setTotalJobs] = useState(0);
  const [appliedCount, setAppliedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchTotal() {
      setLoading(true);
      if (!currentUser) {
        setTotalJobs(0);
        setLoading(false);
        return;
      }
      try {
        const jobsRef = collection(db, "job");
        const q = query(jobsRef, where("userId", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        if (!mounted) return;
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  setJobs(docs);
  console.log('Report fetched jobs:', docs);
        setTotalJobs(docs.length);
        setAppliedCount(docs.filter((j) => j.status === "Applied").length);
        setRejectedCount(
          docs.filter((j) => j.status === "Rejected" || j.status === "Declined").length
        );
      } catch (err) {
        console.error("Failed to fetch total jobs:", err);
        if (mounted) setTotalJobs(0);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchTotal();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  return (
    <div className="container">
      <Navbar />
      <div className="report-container">
        <div className="report-header">
          <p className="heading">Visual insights into your job search</p>
          <p className="text">Track progress, analyze trends, and identify opportunities for improvement.</p>
        </div>
        <div className="metrics">
          <Metrics description="Total Jobs" count={loading ? "..." : totalJobs} />
          <Metrics description="Applied" count={loading ? "..." : appliedCount} />
          <Metrics description="Rejected" count={loading ? "..." : rejectedCount} />
        </div>

        <div style={{ display: 'flex', gap: 20, marginTop: 24 }}>
          <div style={{ flex: 1 }}>
            <ReportOverview jobs={jobs} />
          </div>
          <div style={{ flex: 1 }}>
            <BreakdownByRole jobs={jobs} />
          </div>
        </div>

      </div>
    </div>
  )
}

export default Report