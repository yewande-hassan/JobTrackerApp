import Navbar from "../components/Navbar"
import "../styles/Setting.css"
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
// import { useTheme } from "../context/ThemeContext";
import { db, query, where, collection, getDocs } from "../services/firebase";
import { doc, deleteDoc as deleteDocDirect } from 'firebase/firestore'

function Setting() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  // const { theme, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [busy, setBusy] = useState(false);

  const exportJSON = async () => {
    if (!currentUser) return alert('Please sign in to export data');
    setBusy(true);
    try {
      const jobsRef = collection(db, 'job');
      const q = query(jobsRef, where('userId', '==', currentUser.uid));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'job-data.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export JSON failed', err);
      alert('Export failed. Check console for details.');
    } finally {
      setBusy(false);
    }
  }

  const exportCSV = async () => {
    if (!currentUser) return alert('Please sign in to export data');
    setBusy(true);
    try {
      const jobsRef = collection(db, 'job');
      const q = query(jobsRef, where('userId', '==', currentUser.uid));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (!data.length) return alert('No data to export');

      // Collect headers
      const headers = Object.keys(data.reduce((acc, cur) => ({ ...acc, ...cur }), {}));
      const rows = [headers.join(',')];
      data.forEach(item => {
        const line = headers.map(h => {
          const v = item[h] ?? '';
          if (typeof v === 'string') return `"${v.replace(/"/g,'""')}"`;
          return String(v);
        }).join(',');
        rows.push(line);
      });

      const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'job-data.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export CSV failed', err);
      alert('Export failed. Check console for details.');
    } finally {
      setBusy(false);
    }
  }

  const clearData = async () => {
    if (!currentUser) return alert('Please sign in to clear data');
    if (!confirm('This will permanently delete all your job data. Continue?')) return;
    setBusy(true);
    try {
      const jobsRef = collection(db, 'job');
      const q = query(jobsRef, where('userId', '==', currentUser.uid));
      const snap = await getDocs(q);
      const deletions = snap.docs.map(d => deleteDocDirect(doc(db, 'job', d.id)));
      await Promise.all(deletions);
      alert('All job data cleared');
    } catch (err) {
      console.error('Clear data failed', err);
      alert('Delete failed. Check console for details.');
    } finally {
      setBusy(false);
    }
  }

  return (
     <div className="container">
      <Navbar/>
      <div className="setting-container">
        <div className="setting-header">
          <p className="heading">Settings</p>
          <p className="text">Manage your app preferences and data.</p>
        </div>

        <div className="setting-card">
          <div className="setting-section">
          <h4>Appearance</h4>
          <p className="sub">Preference</p>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className="muted">Toggle between light and dark mode.</p>
            <label className="switch">
              <input
                type="checkbox"
                // checked={theme === 'dark'}
                // onChange={() => toggleTheme()}
              />
              <span className="slider" />
            </label>
          </div>
          </div>

          <hr />
        <div className="setting-section">
          <h4>Data Management</h4>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
            <div>
            <p className="sub">Export Data</p>
            <p className="muted">Download your data as a file.</p>
            </div>
            <div style={{ display: 'flex', gap: 12}}>
            <button className="btn-primary" onClick={exportJSON} disabled={busy}>Export as JSON</button>
            <button className="btn-primary" onClick={exportCSV} disabled={busy}>Export as CSV</button> 
            </div>
          </div>
           < div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', marginTop: 32}}>
            <div>
            <p className="sub">Clear All Data</p>
            <p className="muted">Permanently delete all your job tracking</p>
            </div>
            <button className="btn-danger" onClick={clearData} disabled={busy}>Clear Data</button> 
          </div>
        </div>

          <hr />
        <div className="setting-section">
          <h4>Notifications</h4>
          <p className="sub">Enable Notifications</p>
    
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className="muted">Receive reminders and updates.</p>
            <label className="switch">
              <input type="checkbox" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(v => !v)} />
              <span className="slider" />
            </label>
          </div>
        </div>
          <hr />
        <div className="setting-section">
          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 12 }}>
            <button
              className="btn-ghost"
              onClick={async () => {
                try {
                  await logout();
                  navigate("/");
                } catch (err) {
                  alert("Logout failed. Please try again.");
                  console.error("Logout error", err);
                }
              }}
            >
              Log out
            </button>
          </div>
        </div>
        </div>

      </div>
    </div>
  )
}

export default Setting